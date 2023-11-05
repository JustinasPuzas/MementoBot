import Client from "../discordClient";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "./helpers/interfaces";
import { pingServiceCfg } from "../config/pingServiceCfg"
import { prisma } from "../index"

export default class PingCommand implements Command {
  online = false;
  name = "emote";
  description = "Set custom emote for Ping Service";

  template = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Select Ping emote to change")
        .setRequired(true)
        .addChoices(
          ...(Object.entries(pingServiceCfg).map((info) => {return {name: info[1].name, value: info[0]}}))
        )
    )
    .addStringOption((option) => 
        option
          .setName("emote")
          .setDescription("Select emote (only default and from this server | empty to reset)")
          .setRequired(false)
          
    )

  async execute(interaction: CommandInteraction, client: Client) {
    const gameId = interaction.options.get("game")?.value
    const emote = interaction.options.get("emote")?.value



    return;
  }
}
