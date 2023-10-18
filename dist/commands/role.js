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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Member_1 = __importDefault(require("../parsers/Member"));
class RoleCommand {
    constructor() {
        this.online = true;
        this.name = "role";
        this.description = "Opens role selection window";
        this.template = {
            name: "role",
            description: "Opens role selection window",
            // options: [
            //     {
            //         name: "query",
            //         type: ApplicationCommandOptionType.String,
            //         description: "The song you want to play",
            //         required: true
            //     }
            // ]
        };
        this.roleAddInputActionRow = new discord_js_1.ActionRowBuilder({
            type: discord_js_1.ComponentType.ActionRow,
            components: [
                new discord_js_1.TextInputBuilder({
                    required: false,
                    type: discord_js_1.ComponentType.TextInput,
                    custom_id: "roleAdd_modal_input",
                    placeholder: "LOL, FLEX, TFT, VALORANT, etc...",
                    max_length: 200,
                    label: "Add Roles",
                    style: discord_js_1.TextInputStyle.Short,
                }),
            ],
        });
        this.roleRemoveInputActionRow = new discord_js_1.ActionRowBuilder({
            type: discord_js_1.ComponentType.ActionRow,
            components: [
                new discord_js_1.TextInputBuilder({
                    required: false,
                    type: discord_js_1.ComponentType.TextInput,
                    custom_id: "roleRemove_modal_input",
                    placeholder: "LOL, FLEX, TFT, VALORANT, etc...",
                    max_length: 200,
                    label: "Remove Roles",
                    style: discord_js_1.TextInputStyle.Short,
                }),
            ],
        });
    }
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // user roles
            const memberp = new Member_1.default(interaction.user);
            const member = yield memberp.getMember();
            if (!member)
                throw new Error("Couldn't associate User with a server member");
            const memberRoles = member.roles;
            // ping roles
            const pingService = client.services.get("Ping Service");
            const pingRoles = pingService.pingInfo;
            // Sort Roles and populate keywords
            const addableRoles = new Map();
            const removableRoles = new Map();
            for (let role of pingRoles) {
                const keywords = role[1].keywords;
                if (memberRoles.cache.has(role[0])) {
                    removableRoles.set(role, keywords);
                }
                addableRoles.set(role, keywords);
            }
            // inject roles to add ==> add roles placeholder
            console.log(`${Array.from(addableRoles.keys()).map((role) => role[1].name).join(", ")}`);
            this.roleRemoveInputActionRow.components[0].placeholder = `${Array.from(removableRoles.keys()).map((role) => role[1].name).join(", ")}`;
            // inject roles to remove ==> remove roles placeholder
            const modal = new discord_js_1.ModalBuilder({
                title: "Role Selection",
                custom_id: "role_selection",
                components: [this.roleAddInputActionRow, this.roleRemoveInputActionRow],
            });
            yield interaction.showModal(modal);
            return;
        });
    }
}
exports.default = RoleCommand;
