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
const gameInfo = new Map([
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
        },
    ],
    [
        "1050387555427815434", {
            id: "mcPing",
            name: "Minecraft",
            description: "Minecraft Ping Manager",
            role: "1050387555427815434",
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
        }
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
        },
    ],
]);
class PingManager {
    constructor(gameInfo, client) {
        this.members = new Map();
        this.message = undefined;
        this.interactions = new Map();
        this.client = client;
        this.gameInfo = gameInfo;
        this.actionRow = new discord_js_1.ActionRowBuilder().addComponents(this.gameInfo.buttonYes, this.gameInfo.buttonNo);
    }
    execute(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reset();
            this.members.set(message.author.id, message.author);
            this.message = yield message.channel.send({
                content: `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n\t${this.gameInfo.playerReaction} ${message.author}`,
                components: [this.actionRow],
            });
            // register functions
            this.interactions.set(`${this.gameInfo.id}Yes`, this.handleYesInteraction);
            this.interactions.set(`${this.gameInfo.id}No`, this.handleNoInteraction);
        });
    }
    handleInteractions(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const func = this.interactions.get(interaction.customId);
            if (func) {
                yield func(interaction, this);
            }
        });
    }
    handleYesInteraction(interaction, parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.user;
            parent.members.set(user.id, user);
            yield parent.update(interaction);
        });
    }
    //exported function
    handleNoInteraction(interaction, parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parent.members.delete(interaction.user.id))
                return parent.update(interaction);
            interaction.reply({ content: "Nu ir eik Nxj niekam nerrupi atsiciuhink", ephemeral: true });
        });
    }
    update(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = `**${this.gameInfo.gameIcon} ${this.gameInfo.name}**\n`;
            let counter = 1;
            this.members.forEach((id, user) => {
                if (counter == this.gameInfo.maxPlayers)
                    content += "**Queue:** \n";
                content += `\t${this.gameInfo.playerReaction} <@${user}>\n`;
                counter++;
            });
            if (this.members.size === 0)
                content = "No one wants to play :(";
            yield interaction.update({ content });
        });
    }
    reset() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // remove all active buttons
            this.interactions.clear();
            this.members = new Map();
            yield ((_a = this.message) === null || _a === void 0 ? void 0 : _a.delete());
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
        this.online = true;
        this.client = Client;
        //manage button clicks
        for (let info of gameInfo) {
            this.pingManagers.set(info[0], new PingManager(info[1], this.client));
        }
        this.client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isButton())
                return;
            for (let manager of this.pingManagers.values()) {
                if (interaction.customId.indexOf(manager.gameInfo.id) === -1)
                    continue;
                yield manager.handleInteractions(interaction);
            }
            // on button click
            // find registered function
        }));
    }
    execute(message, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.mentions.roles.size === 0)
                return;
            // create ping managers
            for (let roleId of message.mentions.roles.keys()) {
                (_a = this.pingManagers.get(roleId)) === null || _a === void 0 ? void 0 : _a.execute(message, client);
            }
            return;
        });
    }
}
exports.default = PingService;
