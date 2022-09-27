import { CommandInteraction } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import { Command } from "./helpers/interfaces";

class PingCommand implements Command {
  name = "ping";
  description = "Replies with Pong!";
  template = {
    name: this.name,
    description: this.description,
  };

  async execute(interaction: CommandInteraction, client: Client) {
    const summoner = await client.riotClient?.getUser("IGORIS");
    const usr = await UserDb.findOne({discordId: interaction.user.id})
    console.log(summoner)
    await interaction.reply(`${summoner}`);
    return;
  }
}

export default PingCommand;
