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
class NowPlayingCommand {
    constructor() {
        this.name = "np";
        this.description = "Show Currently playing song";
        this.template = {
            name: "np",
            description: "Show Currently playing song",
        };
    }
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(interaction.user);
            const playerService = client.services.get("MusicService");
            if (!playerService)
                throw new Error("No song is currently playing!");
            yield playerService.isPlaying();
            const queue = playerService.queue;
            const track = queue.current;
            const progress = queue.getPlayerTimestamp();
            const desc = `${progress === null || progress === void 0 ? void 0 : progress.current}/${progress.end}`;
            const memberP = new Member_1.default(interaction.user);
            const embed = new discord_js_1.EmbedBuilder({
                title: track.title,
                url: track.url,
                description: desc,
                author: { name: track.author, url: track.url },
                color: 0xffffff,
                image: { url: track.thumbnail },
                footer: {
                    text: (yield memberP.getMember()).displayName,
                    icon_url: track.requestedBy.displayAvatarURL(),
                },
            });
            return yield interaction.reply({ embeds: [embed] });
        });
    }
}
exports.default = NowPlayingCommand;
