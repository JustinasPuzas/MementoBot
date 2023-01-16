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
const discord_player_1 = require("discord-player");
class MusicService {
    play() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    addToQueue(link, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const member = interaction.member;
            const songLink = (_a = interaction.options.get("query")) === null || _a === void 0 ? void 0 : _a.value;
            this.textChannel = interaction.channel;
            if (!this.queue.connection && ((_b = member === null || member === void 0 ? void 0 : member.voice) === null || _b === void 0 ? void 0 : _b.channel))
                yield this.queue.connect(member.voice.channel);
            const result = yield this.player.search(songLink, {
                requestedBy: interaction.user,
                searchEngine: discord_player_1.QueryType.YOUTUBE_VIDEO,
            });
            const song = result.tracks[0];
            console.log(song);
            this.queue.addTrack(song);
            if (!this.queue.playing)
                yield this.queue.play();
            return;
        });
    }
    constructor(Client) {
        this.name = "MusicService";
        this.description = "Ping Service";
        this.online = true;
        //   queue: Array<String> = [];
        // OFF = 0,
        // TRACK = 1,
        // QUEUE = 2,
        // AUTOPLAY = 3
        this.repeatMode = 2;
        this.client = Client;
        this.player = new discord_player_1.Player(this.client, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25,
            },
        });
        this.queue = this.player.createQueue(this.client.GUILD);
        this.queue.repeatMode = this.repeatMode;
        this.player.on("trackStart", (queue, track) => __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.EmbedBuilder()
                .setFooter({ text: track.author })
                .setTitle(track.title)
                .setThumbnail(track.thumbnail)
                .setDescription(track.url)
                .setColor("#fff");
            yield this.textChannel.send({ embeds: [embed] });
            console.log("trackStart");
        }));
        this.player.on("trackEnd", (queue, track) => {
            // is repeat on?
            // play next song if needed or notify of song ending
            // play next playlist if needed or notify of playlist ending
            console.log("trackEnd");
        });
        this.player.on("connectionError", (queue, error) => {
            // notify of connection error
            console.log(error);
        });
        this.player.on("error", (queue, error) => {
            // notify of error
            // restart if needed
            console.log(error);
        });
    }
}
exports.default = MusicService;
