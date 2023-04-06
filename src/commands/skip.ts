import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import MusicService from "../services/musicService";
import { Command } from "./helpers/interfaces";

class SkipCommand implements Command {
  online = false;
  name = "skip";
  description = "Skip a song!";
  template = {
    name: "skip",
    description: "Skips a song!",
    options: [
      {
        name: "skip",
        type: ApplicationCommandOptionType.Number,
        description: "How Many songs you want to skip",
        required: false,
      },
    ],
  };

  async execute(interaction: CommandInteraction, client: Client) {
    const playerService = client.services.get("MusicService") as MusicService;
    await interaction.deferReply({ ephemeral: true });
    await playerService.skip(interaction);
    await interaction.editReply("Song has been skiped");
    return;
  }
}

export default SkipCommand;
