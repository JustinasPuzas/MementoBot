import Client from "../discordClient";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "./helpers/interfaces";
import { pingServiceCfg } from "../config/pingServiceCfg";
import { prisma } from "../index";

export default class PingCommand implements Command {
  online = true;
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
          ...Object.entries(pingServiceCfg).map((info) => {
            return { name: info[1].name, value: info[0] };
          })
        )
    )
    .addStringOption((option) =>
      option
        .setName("emote")
        .setDescription(
          "Select emote (only default and from this server | empty to reset)"
        )
        .setRequired(false)
    );

  async execute(interaction: CommandInteraction, client: Client) {
    const gameId: any = interaction.options.get("game")?.value?.toString();
    if (!gameId) return; // handle error
    const emote = interaction.options.get("emote")?.value?.toString();
    const user = interaction.user;
    const gameInfo = (pingServiceCfg as any)[gameId];
    // if emote null = reset to default aka delete setting
    if (!emote) {
      console.log("delete Emote");
      await prisma.pingSettings.deleteMany({
        where: {
          userId: user.id,
          gameName: gameId,
        },
      });
      return await interaction.reply({
        ephemeral: true,
        content: `You've rest your **${gameInfo.gameIcon} ${gameInfo.name}** emote to default: ${gameInfo.playerReaction}`,
      });
    }

    const customEmotes = (str: string) => str.match(/<a?:.+?:\d{18,19}>/gu);
    const defaultEmotes = (str: string) =>
      str.match(/\p{Extended_Pictographic}/gu);
    console.log(customEmotes(emote));
    console.log(defaultEmotes(emote));
    const defaultEmote = defaultEmotes(emote);
    const customEmote = customEmotes(emote);

    if (defaultEmote) {
      this.updatePingSettings(defaultEmote[0], user.id, gameId);
      return await interaction.reply({
        ephemeral: true,
        content: `Your new emote for **${gameInfo.gameIcon} ${gameInfo.name}** is ${emote}`,
      });
    }

    if (!customEmote)
      return await interaction.reply({
        ephemeral: true,
        content: `Couldn't figure out emote you provided ${customEmote}`,
      });

    const customEmoteId = customEmote[0].match(/\d{18,19}/);

    if (!customEmoteId)
      return await interaction.reply({
        ephemeral: true,
        content: `Couldn't figure out id of emote you provided ${customEmoteId}`,
      });

    console.log(customEmoteId[0])
    if (!(await interaction.guild?.emojis?.fetch())?.has(customEmoteId[0]))
      return await interaction.reply({
        ephemeral: true,
        content: "Emote you provided is't form this server :/",
      });

    await this.updatePingSettings(customEmote[0], user.id, gameId);
    return await interaction.reply({
      ephemeral: true,
      content: `Your new emote for **${gameInfo.gameIcon} ${gameInfo.name}** is ${emote}`,
    });
  }

  private updatePingSettings = async (
    emote: string,
    userId: string,
    gameName: string
  ) => {
    await prisma.pingSettings.upsert({
      where: {
        userId_gameName: { userId, gameName },
      },
      update: {
        emote,
      },
      create: {
        userId,
        gameName,
        emote,
      },
    });
  };
}
