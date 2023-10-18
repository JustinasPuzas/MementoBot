import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import MusicService from "../services/musicService";
import { Command } from "./helpers/interfaces";

export default class PlayCommand implements Command {
  online = false;
  name = "play";
  description = "Play a song!";
  template = {
    name: "play",
    description: "Plays a song!",
    options: [
      {
        name: "query",
        type: ApplicationCommandOptionType.String,
        description: "The song you want to play",
        required: true,
      },
    ],
  };

  async execute(interaction: CommandInteraction, client: Client) {
    const playerService = client.services.get("MusicService") as MusicService;
    await interaction.deferReply({ ephemeral: true });
    await playerService.addToQueue("Link", interaction);
    await interaction.editReply("Song added to queue!");
    return;
  }
}
