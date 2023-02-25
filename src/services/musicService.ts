import Client from "../discordClient";
import { APIEmbedField, ColorResolvable, EmbedBuilder } from "discord.js";
import { Service } from "./helpers/interfaces";
import { Player, Queue, QueryType } from "discord-player";
import { getAverageColor } from "fast-average-color-node";

import {
  CommandInteraction,
  Guild,
  GuildMember,
  TextBasedChannel,
  VoiceBasedChannel,
} from "discord.js";

class MusicService implements Service {
  name: string = "MusicService";
  description: string = "Ping Service";
  online = true;
  client: Client;
  //   queue: Array<String> = [];

  // OFF = 0,
  // TRACK = 1,
  // QUEUE = 2,
  // AUTOPLAY = 3
  private DEFAULT_REPEAT_MODE = 2;
  private player: Player;
  queue?: Queue<unknown>;
  private textChannel!: TextBasedChannel;

  public async isPlaying()  
  {
    try{
      if(!this.queue) throw new Error("No queue found");
      if(!this.queue.current) throw new Error("No song is currently playing");
      return true;
    }catch (err){
      throw new Error("No song is currently playing");
    }
  }

  //change repeat mode
  public async changeRepeatMode(interaction: CommandInteraction) {
    if(!this.queue) throw new Error("No queue found");
    const member = interaction.member as GuildMember;
    if (!member?.voice?.channel) return;
    const mode = interaction.options.get("mode")?.value as string;
    switch (mode) {
      case "off":
        this.queue.repeatMode = 0;
        break;
      case "track":
        this.queue.repeatMode = 1;
        break;
      case "queue":
        this.queue.repeatMode = 2;
        break;
      case "autoplay":
        this.queue.repeatMode = 3;
        break;
      default:
        break;
    }
  }

  public async nowPlaying(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    if(!this.queue) throw new Error("No queue found");
    if (!member?.voice?.channel) return;
    const track = this.queue.current;
    const progress = this.queue.getPlayerTimestamp();
    
    const embed = new EmbedBuilder();
    embed.setTitle(track?.title);
    embed.setDescription(track?.url);
    embed.setImage(track?.thumbnail);
    embed.setFooter({ text: track?.author });
    embed.setColor(`#ffffff`);
    interaction.reply({ embeds: [embed] });
  }

  //save current playlist to db

  //load playlist from db

  //get currentPlaylist
  public async currentPlaylist(interaction: CommandInteraction) {
    if(!this.queue) throw new Error("No queue found");
    const member = interaction.member as GuildMember;
    if (!member?.voice?.channel) return;
    const currentPlaylist = this.queue.tracks;
    const embed = new EmbedBuilder();
    const fields: APIEmbedField[] = [];
    fields.push({ name: `-> ${this.queue.current?.title}`, value: `-> ${this.queue.current?.url}`})
    currentPlaylist.forEach((track) => {
      const field: APIEmbedField = { name: track.title, value: track.url };
      fields.push(field);
    });
    embed.addFields(fields);
    await interaction.reply({ embeds: [embed] });
  }

  public async skip(interaction: CommandInteraction) {
    if(!this.queue) throw new Error("No queue found");
    const member = interaction.member as GuildMember;
    if (!member?.voice?.channel) return;
    this.queue.skip();
  }

  // Add song to queue
  public async addToQueue(link: String, interaction: CommandInteraction) {
    if(!this.queue){
      this.queue = this.player.createQueue(this.client.GUILD);
      this.queue.repeatMode = this.DEFAULT_REPEAT_MODE;
    }
    const member = interaction.member as GuildMember;
    const songLink = interaction.options.get("query")?.value as string;

    this.textChannel = interaction.channel as TextBasedChannel;

    // Join voice channel if not already in one
    if (!this.queue.connection && member?.voice?.channel)
      await this.queue.connect(member.voice.channel);

    // Search for song
    const result = await this.player.search(songLink, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    // Add song to queue
    const song = result.tracks[0];
    this.queue.addTrack(song);

    // Play song if not already playing
    if (!this.queue.playing) await this.queue.play();

    return;
  }

  private async getTrackLength(){
    if(!this.queue) throw new Error("No queue found");
    const trackLength = this.queue.current?.duration;
    return trackLength;
  }

  constructor(Client: Client) {
    this.client = Client;
    this.player = new Player(this.client, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    });

    this.queue = this.player.createQueue(this.client.GUILD);
    this.queue.repeatMode = this.DEFAULT_REPEAT_MODE;

    // on song start
    this.player.on("trackStart", async (queue: Queue<unknown>, track) => {
      if(!this.queue) throw new Error("No queue found");
        console.log(this.queue.getPlayerTimestamp())
      const embed = new EmbedBuilder()
        .setAuthor({ name: track.author, url: track.url })
        .setTitle(track.title)
        .setURL(track.url)
        .setImage(track.thumbnail)
        .setColor(`#ffffff`);
      await this.textChannel.send({ embeds: [embed] });
      console.log("trackStart");
    });

    this.player.on("botDisconnect", (queue) => {
      if(!this.queue) throw new Error("No queue found");
      // destroy queue
      this.queue = undefined;
      console.log("queueDestroy");
    });

    // on song end
    this.player.on("trackEnd", (queue, track) => {
      // is repeat on?
      // play next song if needed or notify of song ending
      // play next playlist if needed or notify of playlist ending

      console.log("trackEnd");
    });

    this.player.on("connectionError", (queue, error) => {
      console.log(error);
    });

    this.player.on("error", (queue, error) => {
      console.log(error);
    });
  }
}

export default MusicService;
