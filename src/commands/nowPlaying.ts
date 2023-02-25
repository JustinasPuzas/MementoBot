import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { url } from "inspector";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import MusicService from "../services/musicService";
import { Command } from "./helpers/interfaces";
import MemberP from "../parsers/Member";

class NowPlayingCommand implements Command {
  name = "np";
  description = "Show Currently playing song";
  template = {
    name: "np",
    description: "Show Currently playing song",
  };

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    client: Client
  ) {
    console.log(interaction.user);
    const playerService = client.services.get("MusicService") as MusicService;

    if (!playerService) throw new Error("No song is currently playing!");

    await playerService.isPlaying();
    const queue = playerService.queue!;
    const track = queue.current;
    const progress = queue.getPlayerTimestamp();
    const desc = `${progress?.current}/${progress.end}`;
    const memberP = new MemberP(interaction.user);

    const embed = new EmbedBuilder({
      title: track.title,
      url: track.url,
      description: desc,
      author: { name: track.author, url: track.url },
      color: 0xffffff,
      image: { url: track.thumbnail },
      footer: {
        text: (await memberP.getMember()).displayName,
        icon_url: track.requestedBy.displayAvatarURL(),
      },
    });

    return await interaction.reply({ embeds: [embed] });
  }
}

export default NowPlayingCommand;
