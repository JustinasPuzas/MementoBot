import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import MusicService from "../services/musicService";
import { Command } from "./helpers/interfaces";

class SkipCommand implements Command {
  online = false;
  name = "queue";
  description = "Request queue!";
  template = {
    name: "queue",
    description: "Displays the current queue!",
  };

  async execute(interaction: CommandInteraction, client: Client) {
    const playerService = client.services.get("MusicService") as MusicService;
    await playerService.currentPlaylist(interaction);
    return;
  }
}

export default SkipCommand;
