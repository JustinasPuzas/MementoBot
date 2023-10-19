"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const gamePingInfoList = {
    "379054265508823061": {
        id: "lolPing",
        name: "League of Legends",
        description: "League of Legends Ping Manager",
        role: "379054265508823061",
        maxPlayers: 5,
        gameIcon: "<:lol:1050371342995820584>",
        playerReaction: "<:0_:406198795404181504>",
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Danger,
            custom_id: `lolPingYes`,
            emoji: "<:0_:406198795404181504>",
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "Bijau",
            style: discord_js_1.ButtonStyle.Secondary,
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
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Primary,
            custom_id: `tftPingYes`,
            emoji: "<:tftArena:1099121711309406258>",
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Secondary,
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
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "Yes",
            style: discord_js_1.ButtonStyle.Success,
            custom_id: `valPingYes`,
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "No",
            style: discord_js_1.ButtonStyle.Secondary,
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
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Primary,
            custom_id: `aramPingYes`,
            emoji: "<a:poroW:1070125024230506576>",
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Secondary,
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
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Success,
            custom_id: `mcPingYes`,
            emoji: "<a:beeee:1050387140481138688>",
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "nia",
            style: discord_js_1.ButtonStyle.Secondary,
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
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "да",
            style: discord_js_1.ButtonStyle.Success,
            custom_id: `csgoPingYes`,
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "нет",
            style: discord_js_1.ButtonStyle.Secondary,
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
    "1164677139933704303": {
        id: "rustPing",
        name: "RUST",
        description: "RUST Ping Manager",
        role: "1164677139933704303",
        maxPlayers: 5,
        gameIcon: "<:rust:1164678368105607299>",
        playerReaction: "<:kurwaRaketa:1164680791830319154>",
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "Let's Roll",
            style: discord_js_1.ButtonStyle.Success,
            custom_id: `rustPingYes`,
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "",
            emoji: "�",
            style: discord_js_1.ButtonStyle.Secondary,
            custom_id: `rustPingNo`,
        }),
        // keywords for Counter Strike: Global Offensive
        keywords: [
            "rust",
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
        buttonYes: new discord_js_1.ButtonBuilder({
            label: "yes",
            style: discord_js_1.ButtonStyle.Success,
            custom_id: `testPingYes`,
        }),
        buttonNo: new discord_js_1.ButtonBuilder({
            label: "no",
            style: discord_js_1.ButtonStyle.Danger,
            custom_id: `testPingNo`,
        }),
        // keywords for Testing
        keywords: ["test", "tst", "testing"],
    },
};
class PingManager {
    constructor(gameInfo, client) {
        this.members = new Map();
        this.message = undefined;
        this.interactions = new Map();
        this.client = client;
        this.gameInfo = gameInfo;
        const selectMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(this.gameInfo.id + "Select")
            .setPlaceholder("Palauk")
            .setOptions(new discord_js_1.StringSelectMenuOptionBuilder()
            .setValue("5")
            .setLabel("Pasmaukysiu")
            .setDescription("5 minutės"), new discord_js_1.StringSelectMenuOptionBuilder()
            .setValue("10")
            .setLabel("Išplausiu indus")
            .setDescription("10 minučių"), new discord_js_1.StringSelectMenuOptionBuilder()
            .setValue("30")
            .setLabel("Einu į dušą")
            .setDescription("30 minučių"), new discord_js_1.StringSelectMenuOptionBuilder()
            .setValue("60")
            .setLabel("Šiku")
            .setDescription("60 minučių"), new discord_js_1.StringSelectMenuOptionBuilder()
            .setValue("120")
            .setLabel("Priparkuosiu Narkauskui mašiną")
            .setDescription("2 valandos"));
        this.actionRows = [
            new discord_js_1.ActionRowBuilder().addComponents(this.gameInfo.buttonYes, this.gameInfo.buttonNo),
            new discord_js_1.ActionRowBuilder().addComponents(selectMenu),
        ];
    }
    execute(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reset();
            this.members.set(message.author.id, {
                user: message.author,
                timestamp: Math.round(Date.now() / 1000),
            });
            this.message = yield message.channel.send({
                content: `## ${this.gameInfo.gameIcon} ${this.gameInfo.name} \n\t${this.gameInfo.playerReaction} ${message.author}`,
                components: this.actionRows,
            });
            // register functions
            this.interactions.set(`${this.gameInfo.id}Yes`, this.handleYesInteraction);
            this.interactions.set(`${this.gameInfo.id}No`, this.handleNoInteraction);
            this.interactions.set(`${this.gameInfo.id}Select`, this.handleYesInteraction);
        });
    }
    handleInteractions(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const func = this.interactions.get(interaction.customId);
            if (func) {
                yield func(interaction, Math.round(Date.now() / 1000), this);
            }
        });
    }
    handleYesInteraction(interaction, timestamp, parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.isStringSelectMenu()) {
                timestamp += Number.parseInt(interaction.values[0]) * 60;
            }
            const user = interaction.user;
            parent.members.set(user.id, { user, timestamp });
            yield parent.update(interaction);
        });
    }
    //exported function
    handleNoInteraction(interaction, timestamp, parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parent.members.delete(interaction.user.id))
                return parent.update(interaction);
            yield interaction.reply({
                content: "Nu ir eik Nxj niekam nerrupi atsiciuhink",
                ephemeral: true,
            });
        });
    }
    update(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = this.members.size == 1 ? `## ${this.gameInfo.gameIcon} ${this.gameInfo.name}\n` : `### ${this.gameInfo.gameIcon} ${this.gameInfo.name}\n`;
            let counter = 1;
            this.members = new Map([...this.members.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp));
            this.members.forEach((member, id) => {
                if (counter == this.gameInfo.maxPlayers + 1)
                    content += "**Queue:** \n";
                content += `\t${this.gameInfo.playerReaction} <@${id}>`;
                if (member.timestamp > Math.round(Date.now() / 1000) + 60)
                    content += ` <t:${member.timestamp}:R>`;
                content += "\n";
                counter++;
            });
            if (this.members.size === 0)
                content = `# ${this.gameInfo.gameIcon} ${this.gameInfo.name}`;
            yield interaction.update({ content });
        });
    }
    reset() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // remove all active buttons
            try {
                this.interactions.clear();
                this.members = new Map();
                yield ((_a = this.message) === null || _a === void 0 ? void 0 : _a.delete());
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
class PingService {
    constructor(Client) {
        this.id = "Ping";
        this.name = "Ping Service";
        this.description = "Ping Service";
        this.online = false;
        this.pingManagers = new Map();
        this.pingInfo = gamePingInfoList;
        this.online = true;
        this.client = Client;
        // create ping managers
        for (let [id, role] of Object.entries(this.pingInfo)) {
            this.pingManagers.set(id, new PingManager(role, this.client));
        }
        // on button interaction
        this.client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (interaction.isButton()) {
                    if (!interaction.customId.includes("Ping"))
                        return;
                    // loop through all ping managers
                    for (let manager of this.pingManagers.values()) {
                        if (interaction.customId.indexOf(manager.gameInfo.id) === -1)
                            continue;
                        yield manager.handleInteractions(interaction);
                    }
                }
                else if (interaction.isStringSelectMenu()) {
                    console.log(interaction.customId);
                    if (!interaction.customId.includes("Select"))
                        return;
                    for (let manager of this.pingManagers.values()) {
                        if (interaction.customId.indexOf(manager.gameInfo.id) === -1)
                            continue;
                        yield manager.handleInteractions(interaction);
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        }));
        this.client.on("messageCreate", (message) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.online)
                return;
            if (message.mentions.roles.size === 0)
                return;
            try {
                // loop through all role mentions and initiate ping managers
                for (let roleId of message.mentions.roles.keys()) {
                    (_a = this.pingManagers.get(roleId)) === null || _a === void 0 ? void 0 : _a.execute(message, this.client);
                }
            }
            catch (e) {
                console.error(e);
            }
            return;
        }));
    }
}
exports.default = PingService;
