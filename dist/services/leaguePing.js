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
class LeaguePing {
    constructor(Client) {
        this.id = "leaguePing";
        this.name = "League Ping";
        this.description = "Ping League of Legends servers";
        this.online = false;
        this.buttonYes = new discord_js_1.ButtonBuilder({
            label: "",
            style: discord_js_1.ButtonStyle.Danger,
            custom_id: `${this.id}Yes`,
            emoji: "<:0_:406198795404181504>"
        });
        this.buttonNo = new discord_js_1.ButtonBuilder({
            label: "Bijau",
            style: discord_js_1.ButtonStyle.Secondary,
            custom_id: `${this.id}No`,
        });
        this.actionRow = new discord_js_1.ActionRowBuilder().addComponents(this.buttonYes, this.buttonNo);
        this.members = new Map();
        this.message = undefined;
        this.online = true;
        this.client = Client;
    }
    execute(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.content.trim() !== "<@&379054265508823061>")
                return;
            yield this.reset();
            this.members.set(message.author.id, message.author);
            this.message = yield message.channel.send({
                content: `<:0_:406198795404181504> ${message.author}`,
                components: [this.actionRow],
            });
            this.client.interactions.set(`${this.id}Yes`, this.handleYesInteraction);
            this.client.interactions.set(`${this.id}No`, this.handleNoInteraction);
            return;
        });
    }
    //exported function
    handleYesInteraction(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = client.services.get("League Ping");
            console.log(interaction);
            const user = interaction.user;
            parent.members.set(user.id, user);
            yield parent.update(interaction);
        });
    }
    //exported function
    handleNoInteraction(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // find existing members and remove
            // if user doesn't exist, add to niger list
            const parent = client.services.get("League Ping");
            if (parent.members.delete(interaction.user.id))
                parent.update(interaction);
        });
    }
    update(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = ``;
            let counter = 1;
            this.members.forEach((id, user) => {
                if (counter == 5)
                    content += "**Queue:** \n";
                content += `<:0_:406198795404181504> <@${user}>\n`;
                counter++;
            });
            if (this.members.size === 0)
                content = "No one wants to play League :(";
            yield interaction.update({ content });
        });
    }
    reset() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.client.interactions.delete(`${this.id}Yes`);
            this.client.interactions.delete(`${this.id}No`);
            this.members = new Map();
            yield ((_a = this.message) === null || _a === void 0 ? void 0 : _a.delete());
        });
    }
}
exports.default = LeaguePing;
