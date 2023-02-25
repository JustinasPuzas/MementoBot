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
class SkipCommand {
    constructor() {
        this.name = "skip";
        this.description = "Skip a song!";
        this.template = {
            name: "skip",
            description: "Skips a song!",
            options: [
                {
                    name: "skip",
                    type: discord_js_1.ApplicationCommandOptionType.Number,
                    description: "How Many songs you want to skip",
                    required: false,
                },
            ],
        };
    }
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerService = client.services.get("MusicService");
            yield interaction.deferReply({ ephemeral: true });
            yield playerService.skip(interaction);
            yield interaction.editReply("Song has been skiped");
            return;
        });
    }
}
exports.default = SkipCommand;
