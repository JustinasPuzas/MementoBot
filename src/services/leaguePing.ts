import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  Interaction,
  Message,
  User,
  SelectMenuOptionBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import Client from "../discordClient";
import { Service } from "./helpers/interfaces";

type GamePingInfoIds = keyof typeof gamePingInfoList;
type GamePingInfo = (typeof gamePingInfoList)[GamePingInfoIds];

const gamePingInfoList = {
  "379054265508823061": {
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
    // keywords for League of Legends
    keywords: ["lol", "league", "league of legends", "leagueoflegends"],
  },
  "1099120902341402744": {
    id: "tftPing",
    name: "Team Fight Tactics",
    description: "Team Fight Tactics Ping Manager",
    role: "1099120902341402744",
    maxPlayers: 8,
    gameIcon: "<:tft:1099115104198479872>",
    playerReaction: "<a:pengu:1099115708878700544>",
    buttonYes: new ButtonBuilder({
      label: "",
      style: ButtonStyle.Primary,
      custom_id: `tftPingYes`,
      emoji: "<:tftArena:1099121711309406258>",
    }),
    buttonNo: new ButtonBuilder({
      label: "",
      style: ButtonStyle.Secondary,
      custom_id: `tftPingNo`,
      emoji: "<:tftL:1099122414249582713>",
    }),
    // keywords for Team Fight Tactics
    keywords: ["tft", "team fight tactics", "teamfighttactics"],
  },
  "843933198907736066": {
    id: "valPing",
    name: "Valorant",
    description: "Valorant Ping Manager",
    role: "843933198907736066",
    maxPlayers: 5,
    gameIcon: "<:valorant:1099123434962821191>",
    playerReaction: "<a:goodSage:1099124499351355442>",
    buttonYes: new ButtonBuilder({
      label: "Yes",
      style: ButtonStyle.Success,
      custom_id: `valPingYes`,
    }),
    buttonNo: new ButtonBuilder({
      label: "No",
      style: ButtonStyle.Secondary,
      custom_id: `valPingNo`,
    }),
    // keywords for Valorant
    keywords: ["val", "valorant"],
  },
  "1070121180087988244": {
    id: "aramPing",
    name: "ARAM",
    description: "ARAM Ping Manager",
    role: "1070121180087988244",
    maxPlayers: 5,
    gameIcon: "<:Aram:1070119467293618278>",
    playerReaction: "<:snowBall:1070123779667279912>",
    buttonYes: new ButtonBuilder({
      label: "",
      style: ButtonStyle.Primary,
      custom_id: `aramPingYes`,
      emoji: "<a:poroW:1070125024230506576>",
    }),
    buttonNo: new ButtonBuilder({
      label: "",
      style: ButtonStyle.Secondary,
      custom_id: `aramPingNo`,
      emoji: "<a:poroL:1070125109429411910>",
    }),
    // keywords for ARAM
    keywords: ["aram", "arams", "aram ping", "aramping"],
  },
  "889446083074330624": {
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
    // keywords for Minecraft
    keywords: ["mc", "minecraft", "mine", "minecraf"],
  },
  "379054412875825154": {
    id: "csgoPing",
    name: "Counter Strike: Global Offensive",
    description: "Counter Strike: Global Offensive Ping Manager",
    role: "379054412875825154",
    maxPlayers: 5,
    gameIcon: "<:csgo:1050371298209058816>",
    playerReaction: ":flag_ru:",
    buttonYes: new ButtonBuilder({
      label: "да",
      style: ButtonStyle.Success,
      custom_id: `csgoPingYes`,
    }),
    buttonNo: new ButtonBuilder({
      label: "нет",
      style: ButtonStyle.Secondary,
      custom_id: `csgoPingNo`,
    }),
    // keywords for Counter Strike: Global Offensive
    keywords: [
      "csgo",
      "counter strike",
      "counterstrike",
      "counter strike global offensive",
      "counterstrikeglobaloffensive",
    ],
  },
  "1162806426670993458": {
    id: "testPing",
    name: "Test: Testing",
    description: "Test",
    role: "1162806426670993458",
    maxPlayers: 2,
    gameIcon: "",
    playerReaction: ":) ",
    buttonYes: new ButtonBuilder({
      label: "yes",
      style: ButtonStyle.Success,
      custom_id: `testPingYes`,
    }),
    buttonNo: new ButtonBuilder({
      label: "no",
      style: ButtonStyle.Danger,
      custom_id: `testPingNo`,
    }),
    // keywords for Testing
    keywords: ["test", "tst", "testing"],
  },
};

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
          .setDescription("2 valandos"),
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
    this.members.set(message.author.id, { user: message.author, timestamp: Math.round(Date.now()/1000) });
    this.message = await message.channel.send({
      content: `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n\t${this.gameInfo.playerReaction} ${message.author}`,
      components: this.actionRows,
    });

    // register functions
    this.interactions.set(`${this.gameInfo.id}Yes`, this.handleYesInteraction);
    this.interactions.set(`${this.gameInfo.id}No`, this.handleNoInteraction);
    this.interactions.set(`${this.gameInfo.id}Select`, this.handleYesInteraction)
  }

  public async handleInteractions(interaction: ButtonInteraction | StringSelectMenuInteraction) {
    const func = this.interactions.get(interaction.customId);
    if (func) {
      await func(interaction, Math.round(Date.now()/1000), this);
    }
  }

  private async handleYesInteraction(
    interaction: ButtonInteraction | StringSelectMenuInteraction,
    timestamp: number,
    parent: PingManager
  ) {
    if(interaction.isStringSelectMenu()){
      timestamp += Number.parseInt(interaction.values[0]) * 60
    }
    const user = interaction.user;
    parent.members.set(user.id, { user, timestamp});
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

  public async update(interaction: ButtonInteraction | StringSelectMenuInteraction) {
    let content = `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n`;
    let counter = 1;

    this.members.forEach((member, id) => {
      if (counter == this.gameInfo.maxPlayers + 1) content += "**Queue:** \n";
      content += `\t${this.gameInfo.playerReaction} <@${id}>`;
      if(member.timestamp > Math.round(Date.now()/1000) + 60)
      content += ` <t:${member.timestamp}:R>\n`
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
  readonly pingInfo = gamePingInfoList;

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
        }else if (interaction.isStringSelectMenu()){
          console.log(interaction.customId)
          if (!interaction.customId.includes("Select")) return;

          for (let manager of this.pingManagers.values()) {
            if (interaction.customId.indexOf(manager.gameInfo.id) === -1)
              continue;
            await manager.handleInteractions(interaction as StringSelectMenuInteraction);
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
