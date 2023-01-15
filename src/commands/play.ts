import{ ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import MusicService from "../services/musicService";
import { Command } from "./helpers/interfaces";

class PlayCommand implements Command {
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
            required: true
        }
    ]
  }

  async execute(interaction: CommandInteraction, client: Client) {
    const playerService = client.services.get("MusicService") as MusicService;
    await interaction.deferReply({ ephemeral: true });
    await playerService.addToQueue("Link", interaction);
    await interaction.editReply("Song added to queue!");
    return;
}
}

export default PlayCommand;
