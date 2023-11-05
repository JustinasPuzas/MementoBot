import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Interaction,
  Message,
  User,
  StringSelectMenuInteraction,
} from "discord.js";
import Client from "../discordClient";
import { Service } from "./helpers/interfaces";
import { pingServiceCfg } from "../config/pingServiceCfg"

type GamePingInfoIds = keyof typeof pingServiceCfg;
type GamePingInfo = (typeof pingServiceCfg)[GamePingInfoIds];

class PingManager {
  readonly gameInfo: GamePingInfo;
  private actionRows: ActionRowBuilder<
    ButtonBuilder | StringSelectMenuBuilder
  >[];
  private members: Map<String, { user: User; timestamp: number }> = new Map();
  private message?: Message = undefined;
  private client: Client;
  private interactions: Map<String, Function> = new Map();

  constructor(gameInfo: GamePingInfo, client: Client) {
    this.client = client;
    this.gameInfo = gameInfo;
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(this.gameInfo.id + "Select")
      .setPlaceholder("Palauk")
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setValue("5")
          .setLabel("Pasmaukysiu")
          .setDescription("5 minutės"),
        new StringSelectMenuOptionBuilder()
          .setValue("10")
          .setLabel("Išplausiu indus")
          .setDescription("10 minučių"),
        new StringSelectMenuOptionBuilder()
          .setValue("30")
          .setLabel("Einu į dušą")
          .setDescription("30 minučių"),
        new StringSelectMenuOptionBuilder()
          .setValue("60")
          .setLabel("Šiku")
          .setDescription("60 minučių"),
        new StringSelectMenuOptionBuilder()
          .setValue("120")
          .setLabel("Priparkuosiu Narkauskui mašiną")
          .setDescription("2 valandos")
      );
    this.actionRows = [
      new ActionRowBuilder<
        ButtonBuilder | StringSelectMenuBuilder
      >().addComponents(this.gameInfo.buttonYes, this.gameInfo.buttonNo),
      new ActionRowBuilder<
        ButtonBuilder | StringSelectMenuBuilder
      >().addComponents(selectMenu),
    ];
  }

  public async execute(message: Message, client: Client) {
    await this.reset();
    this.members.set(message.author.id, {
      user: message.author,
      timestamp: Math.round(Date.now() / 1000),
    });
    this.message = await message.channel.send({
      content: `## ${this.gameInfo.gameIcon} ${this.gameInfo.name} \n\t${this.gameInfo.playerReaction} ${message.author}`,
      components: this.actionRows,
    });

    // register functions
    this.interactions.set(`${this.gameInfo.id}Yes`, this.handleYesInteraction);
    this.interactions.set(`${this.gameInfo.id}No`, this.handleNoInteraction);
    this.interactions.set(
      `${this.gameInfo.id}Select`,
      this.handleYesInteraction
    );
  }

  public async handleInteractions(
    interaction: ButtonInteraction | StringSelectMenuInteraction
  ) {
    const func = this.interactions.get(interaction.customId);
    if (func) {
      await func(interaction, Math.round(Date.now() / 1000), this);
    }
  }

  private async handleYesInteraction(
    interaction: ButtonInteraction | StringSelectMenuInteraction,
    timestamp: number,
    parent: PingManager
  ) {
    if (interaction.isStringSelectMenu()) {
      timestamp += Number.parseInt(interaction.values[0]) * 60;
    }
    const user = interaction.user;
    parent.members.set(user.id, { user, timestamp });
    await parent.update(interaction);
  }

  //exported function
  private async handleNoInteraction(
    interaction: ButtonInteraction,
    timestamp: Number,
    parent: PingManager
  ) {
    if (parent.members.delete(interaction.user.id))
      return parent.update(interaction);
    await interaction.reply({
      content: "Nu ir eik Nxj niekam nerrupi atsiciuhink",
      ephemeral: true,
    });
  }

  public async update(
    interaction: ButtonInteraction | StringSelectMenuInteraction
  ) {
    let content =
      this.members.size == 1
        ? `## ${this.gameInfo.gameIcon} ${this.gameInfo.name}\n`
        : `### ${this.gameInfo.gameIcon} ${this.gameInfo.name}\n`;
    let counter = 1;

    this.members = new Map(
      [...this.members.entries()].sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )
    );

    this.members.forEach((member, id) => {
      if (counter == this.gameInfo.maxPlayers + 1) content += "**Queue:** \n";
      content += `\t${this.gameInfo.playerReaction} <@${id}>`;
      if (member.timestamp > Math.round(Date.now() / 1000) + 60)
        content += ` <t:${member.timestamp}:R>`;
      content += "\n";
      counter++;
    });

    if (this.members.size === 0)
      content = `# ${this.gameInfo.gameIcon} ${this.gameInfo.name}`;

    await interaction.update({ content });
  }

  private async reset() {
    // remove all active buttons
    try {
      this.interactions.clear();
      this.members = new Map();
      await this.message?.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

class PingService implements Service {
  public id = "Ping";
  public name = "Ping Service";
  public description = "Ping Service";
  public online = false;
  private client!: Client;
  private pingManagers: Map<String, PingManager> = new Map();
  readonly pingInfo = pingServiceCfg;

  constructor(Client: Client) {
    this.online = true;
    this.client = Client;

    // create ping managers
    for (let [id, role] of Object.entries(this.pingInfo)) {
      this.pingManagers.set(id, new PingManager(role, this.client));
    }

    // on button interaction
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      try {
        if (interaction.isButton()) {
          if (!interaction.customId.includes("Ping")) return;

          // loop through all ping managers

          for (let manager of this.pingManagers.values()) {
            if (interaction.customId.indexOf(manager.gameInfo.id) === -1)
              continue;
            await manager.handleInteractions(interaction as ButtonInteraction);
          }
        } else if (interaction.isStringSelectMenu()) {
          console.log(interaction.customId);
          if (!interaction.customId.includes("Select")) return;

          for (let manager of this.pingManagers.values()) {
            if (interaction.customId.indexOf(manager.gameInfo.id) === -1)
              continue;
            await manager.handleInteractions(
              interaction as StringSelectMenuInteraction
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    this.client.on("messageCreate", async (message: Message) => {
      if (!this.online) return;
      if (message.mentions.roles.size === 0) return;
      try {
        // loop through all role mentions and initiate ping managers
        for (let roleId of message.mentions.roles.keys()) {
          this.pingManagers.get(roleId)?.execute(message, this.client);
        }
      } catch (e) {
        console.error(e);
      }
      return;
    });
  }
}

export default PingService;
