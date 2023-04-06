import { CommandInteraction } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import { Command } from "./helpers/interfaces";

class PingCommand implements Command {
  online = false;
  name = "ping";
  description = "Replies with Pong!";
  template = {
    name: this.name,
    description: this.description,
  };

  async execute(interaction: CommandInteraction, client: Client) {
    const usr = await UserDb.findOne({discordId: interaction.user.id})
    await interaction.reply(`ss`);
    return;
  }
}

export default PingCommand;
