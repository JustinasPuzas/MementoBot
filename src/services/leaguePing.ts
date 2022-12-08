import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  Interaction,
  Message,
  User,
} from "discord.js";
import Client from "../discordClient";
import { Service } from "./helpers/interfaces";

interface GameInfo {
  id: string;
  name: string;
  description: string;
  role: string;
  buttonYes: ButtonBuilder;
  buttonNo: ButtonBuilder;
  playerReaction?: string;
  gameIcon?: string;
  maxPlayers: number;
}

const gameInfo: Map<String, GameInfo> = new Map([
  [
    "379054265508823061",
    {
      id: "lolPing",
      name: "League of Legends",
      description: "League of Legends Ping Manager",
      role: "379054265508823061",
      maxPlayers: 5,
      gameIcon: "<:lol:1050371342995820584>",
      playerReaction: "<:0_:406198795404181504>",
      buttonYes: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Danger,
        custom_id: `lolPingYes`,
        emoji: "<:0_:406198795404181504>",
      }),
      buttonNo: new ButtonBuilder({
        label: "Bijau",
        style: ButtonStyle.Secondary,
        custom_id: `lolPingNo`,
      }),
    },
  ],

  [
    "379054412875825154",
    {
      id: "csgoPing",
      name: "Counter Strike: Global Offensive",
      description: "Counter Strike: Global Offensive Ping Manager",
      role: "379054412875825154",
      maxPlayers: 5,
      gameIcon: "<:csgo:1050371298209058816>",
      playerReaction: ":flag_ru:",
      buttonYes: new ButtonBuilder({
        label: "да",
        style: ButtonStyle.Danger,
        custom_id: `csgoPingYes`,
      }),
      buttonNo: new ButtonBuilder({
        label: "нет",
        style: ButtonStyle.Secondary,
        custom_id: `csgoPingNo`,
      }),
    },
  ],
]);

class PingManager {
  gameInfo: GameInfo;
  private actionRow: ActionRowBuilder<ButtonBuilder>;
  private members: Map<String, User> = new Map();
  private message?: Message = undefined;
  private client: Client;
  private interactions: Map<String, Function> = new Map();

  constructor(gameInfo: GameInfo, client: Client) {
    this.client = client;
    this.gameInfo = gameInfo;
    this.actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      this.gameInfo.buttonYes,
      this.gameInfo.buttonNo
    );
  }

  public async execute(message: Message, client: Client) {
    await this.reset();
    this.members.set(message.author.id, message.author);
    this.message = await message.channel.send({
      content: `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n${this.gameInfo.playerReaction} ${message.author}`,
      components: [this.actionRow],
    });
    // register functions

    this.interactions.set(`${this.gameInfo.id}Yes`, this.handleYesInteraction);
    this.interactions.set(`${this.gameInfo.id}No`, this.handleNoInteraction);
  }

  public async handleInteractions(interaction: ButtonInteraction) {
    const func = this.interactions.get(interaction.customId);
    if (func) {
      await func(interaction, this);
    }
  }

  private async handleYesInteraction(interaction: ButtonInteraction, parent: PingManager) {
    const user = interaction.user;
    parent.members.set(user.id, user);
    await parent.update(interaction);
  }

  //exported function
  private async handleNoInteraction(interaction: ButtonInteraction, parent: PingManager) {
    if (parent.members.delete(interaction.user.id)) return parent.update(interaction);
    interaction.reply({ content: "Nu ir eik Nxj niekam nerrupi atsiciuhink", ephemeral: true });
  }

  public async update(interaction: ButtonInteraction) {
    let content = `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n`;
    let counter = 1;

    this.members.forEach((id, user) => {
      if (counter == this.gameInfo.maxPlayers) content += "**Queue:** \n";
      content += `<:0_:406198795404181504> <@${user}>\n`;
      counter++;
    });

    if (this.members.size === 0) content = "No one wants to play :(";

    await interaction.update({ content });
  }

  private async reset() {
    // remove all active buttons
    this.interactions.clear();
    this.members = new Map();
    await this.message?.delete();
  }
}

class PingService implements Service {
  public id = "Ping";
  public name = "Ping Service";
  public description = "Ping Service";
  public online = false;
  private client!: Client;
  private pingManagers: Map<String, PingManager> = new Map();

  constructor(Client: Client) {
    this.online = true;
    this.client = Client;
    //manage button clicks
    for (let info of gameInfo) {
      this.pingManagers.set(info[0], new PingManager(info[1], this.client));
    }

    this.client.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isButton()) return;

      for (let manager of this.pingManagers.values()) {
        if(interaction.customId.indexOf(manager.gameInfo.id) === -1) continue;
        await manager.handleInteractions(interaction as ButtonInteraction);
      }

      // on button click

      // find registered function
    });
  }

  public async execute(message: Message, client: Client) {
    if (message.mentions.roles.size === 0) return;
    // create ping managers
    for (let roleId of message.mentions.roles.keys()) {
      this.pingManagers.get(roleId)?.execute(message, client);
    }
    return;
  }
  //exported function
}

export default PingService;
