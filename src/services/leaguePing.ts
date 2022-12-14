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
    "889446083074330624",
    {
      id: "mcPing",
      name: "Minecraft",
      description: "Minecraft Ping Manager",
      role: "889446083074330624",
      maxPlayers: 100,
      gameIcon: "<:minecraft:1050387214770638878>",
      playerReaction: "<a:beeee:1050387140481138688>",
      buttonYes: new ButtonBuilder({
        label: "",
        style: ButtonStyle.Success,
        custom_id: `mcPingYes`,
        emoji: "<a:beeee:1050387140481138688>",
      }),
      buttonNo: new ButtonBuilder({
        label: "nia",
        style: ButtonStyle.Secondary,
        custom_id: `mcPingNo`,
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
        label: "????",
        style: ButtonStyle.Success,
        custom_id: `csgoPingYes`,
      }),
      buttonNo: new ButtonBuilder({
        label: "??????",
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
      content: `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n\t${this.gameInfo.playerReaction} ${message.author}`,
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

  private async handleYesInteraction(
    interaction: ButtonInteraction,
    parent: PingManager
  ) {
    const user = interaction.user;
    parent.members.set(user.id, user);
    await parent.update(interaction);
  }

  //exported function
  private async handleNoInteraction(
    interaction: ButtonInteraction,
    parent: PingManager
  ) {
    if (parent.members.delete(interaction.user.id))
      return parent.update(interaction);
    await interaction.reply({
      content: "Nu ir eik Nxj niekam nerrupi atsiciuhink",
      ephemeral: true,
    });
  }

  public async update(interaction: ButtonInteraction) {
    let content = `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n`;
    let counter = 1;

    this.members.forEach((id, user) => {
      if (counter == this.gameInfo.maxPlayers + 1) content += "**Queue:** \n";
      content += `\t${this.gameInfo.playerReaction} <@${user}>\n`;
      counter++;
    });

    if (this.members.size === 0) content = "No one wants to play :(";

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

  constructor(Client: Client) {
    this.online = true;
    this.client = Client;

    // create ping managers
    for (let info of gameInfo) {
      this.pingManagers.set(info[0], new PingManager(info[1], this.client));
    }

    // on button interaction
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      try {
        if (!interaction.isButton()) return;
        if(!interaction.customId.includes("Ping")) return;

        // loop through all ping managers
        for (let manager of this.pingManagers.values()) {
          if (interaction.customId.indexOf(manager.gameInfo.id) === -1) continue;
          await manager.handleInteractions(interaction as ButtonInteraction);
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
