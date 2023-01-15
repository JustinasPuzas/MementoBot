import Client from "../discordClient";
import { EmbedBuilder } from "discord.js";
import { Service } from "./helpers/interfaces";
import { Player, Queue, QueryType } from "discord-player";
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
  private repeatMode = 2;
  private player: Player;
  private queue!: Queue<unknown>;
  private textChannel!: TextBasedChannel;

  public async play() {

  }

  public async addToQueue(link: String, interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const songLink = interaction.options.get("query")?.value as string;

    this.textChannel = interaction.channel as TextBasedChannel;

    if (!this.queue.connection && member?.voice?.channel)
      await this.queue.connect(member.voice.channel);
    const result = await this.player.search(songLink, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });
    const song = result.tracks[0];
    console.log(song)
    this.queue.addTrack(song);
    if (!this.queue.playing) await this.queue.play();
    return;
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
    this.queue.repeatMode = this.repeatMode;

    this.player.on("trackStart", async (queue: Queue<unknown>, track) => {
      const embed = new EmbedBuilder()
        .setFooter({ text: track.author })
        .setTitle(track.title)
        .setThumbnail(track.thumbnail)
        .setDescription(track.url)
        .setColor("#fff");
      await this.textChannel.send({ embeds: [embed] });
      console.log("trackStart");
    });

    this.player.on("trackEnd", (queue, track) => {
      // is repeat on?
      // play next song if needed or notify of song ending
      // play next playlist if needed or notify of playlist ending

      console.log("trackEnd");
    });

    this.player.on("connectionError", (queue, error) => {
      // notify of connection error
      console.log(error);
    });

    this.player.on("error", (queue, error) => {
      // notify of error
      // restart if needed
      console.log(error);
    });
  }
}

export default MusicService;
