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
const User_1 = __importDefault(require("../dataBase/schemas/User"));
class PlayCommand {
    constructor() {
        this.name = "play";
        this.description = "Play a song!";
        this.template = {
            name: "play",
            description: "Plays a song!",
            options: [
                {
                    name: "query",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "The song you want to play",
                    required: true
                }
            ]
        };
    }
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerService = client.services.get("MusicService");
            const response = yield interaction.deferReply({ ephemeral: true });
            yield playerService.addToQueue("Link", interaction);
            yield interaction.editReply("Song added to queue!");
            const usr = yield User_1.default.findOne({ discordId: interaction.user.id });
            return;
        });
    }
}
exports.default = PlayCommand;
