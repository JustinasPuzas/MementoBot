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
    isPlaying() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.queue)
                    throw new Error("No queue found");
                if (!this.queue.current)
                    throw new Error("No song is currently playing");
                return true;
            }
            catch (err) {
                throw new Error("No song is currently playing");
            }
        });
    }
    //change repeat mode
    changeRepeatMode(interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queue)
                throw new Error("No queue found");
            const member = interaction.member;
            if (!((_a = member === null || member === void 0 ? void 0 : member.voice) === null || _a === void 0 ? void 0 : _a.channel))
                return;
            const mode = (_b = interaction.options.get("mode")) === null || _b === void 0 ? void 0 : _b.value;
            switch (mode) {
                case "off":
                    this.queue.repeatMode = 0;
                    break;
                case "track":
                    this.queue.repeatMode = 1;
                    break;
                case "queue":
                    this.queue.repeatMode = 2;
                    break;
                case "autoplay":
                    this.queue.repeatMode = 3;
                    break;
                default:
                    break;
            }
        });
    }
    nowPlaying(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const member = interaction.member;
            if (!this.queue)
                throw new Error("No queue found");
            if (!((_a = member === null || member === void 0 ? void 0 : member.voice) === null || _a === void 0 ? void 0 : _a.channel))
                return;
            const track = this.queue.current;
            const progress = this.queue.getPlayerTimestamp();
            const embed = new discord_js_1.EmbedBuilder();
            embed.setTitle(track === null || track === void 0 ? void 0 : track.title);
            embed.setDescription(track === null || track === void 0 ? void 0 : track.url);
            embed.setImage(track === null || track === void 0 ? void 0 : track.thumbnail);
            embed.setFooter({ text: track === null || track === void 0 ? void 0 : track.author });
            embed.setColor(`#ffffff`);
            interaction.reply({ embeds: [embed] });
        });
    }
    //save current playlist to db
    //load playlist from db
    //get currentPlaylist
    currentPlaylist(interaction) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queue)
                throw new Error("No queue found");
            const member = interaction.member;
            if (!((_a = member === null || member === void 0 ? void 0 : member.voice) === null || _a === void 0 ? void 0 : _a.channel))
                return;
            const currentPlaylist = this.queue.tracks;
            const embed = new discord_js_1.EmbedBuilder();
            const fields = [];
            fields.push({ name: `-> ${(_b = this.queue.current) === null || _b === void 0 ? void 0 : _b.title}`, value: `-> ${(_c = this.queue.current) === null || _c === void 0 ? void 0 : _c.url}` });
            currentPlaylist.forEach((track) => {
                const field = { name: track.title, value: track.url };
                fields.push(field);
            });
            embed.addFields(fields);
            yield interaction.reply({ embeds: [embed] });
        });
    }
    skip(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queue)
                throw new Error("No queue found");
            const member = interaction.member;
            if (!((_a = member === null || member === void 0 ? void 0 : member.voice) === null || _a === void 0 ? void 0 : _a.channel))
                return;
            this.queue.skip();
        });
    }
    // Add song to queue
    addToQueue(link, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queue) {
                this.queue = this.player.createQueue(this.client.GUILD);
                this.queue.repeatMode = this.DEFAULT_REPEAT_MODE;
            }
            const member = interaction.member;
            const songLink = (_a = interaction.options.get("query")) === null || _a === void 0 ? void 0 : _a.value;
            this.textChannel = interaction.channel;
            // Join voice channel if not already in one
            if (!this.queue.connection && ((_b = member === null || member === void 0 ? void 0 : member.voice) === null || _b === void 0 ? void 0 : _b.channel))
                yield this.queue.connect(member.voice.channel);
            // Search for song
            const result = yield this.player.search(songLink, {
                requestedBy: interaction.user,
                searchEngine: discord_player_1.QueryType.YOUTUBE_VIDEO,
            });
            // Add song to queue
            const song = result.tracks[0];
            this.queue.addTrack(song);
            // Play song if not already playing
            if (!this.queue.playing)
                yield this.queue.play();
            return;
        });
    }
    getTrackLength() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queue)
                throw new Error("No queue found");
            const trackLength = (_a = this.queue.current) === null || _a === void 0 ? void 0 : _a.duration;
            return trackLength;
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
        this.DEFAULT_REPEAT_MODE = 2;
        this.client = Client;
        this.player = new discord_player_1.Player(this.client, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25,
            },
        });
        this.queue = this.player.createQueue(this.client.GUILD);
        this.queue.repeatMode = this.DEFAULT_REPEAT_MODE;
        // on song start
        this.player.on("trackStart", (queue, track) => __awaiter(this, void 0, void 0, function* () {
            if (!this.queue)
                throw new Error("No queue found");
            console.log(this.queue.getPlayerTimestamp());
            const embed = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: track.author, url: track.url })
                .setTitle(track.title)
                .setURL(track.url)
                .setImage(track.thumbnail)
                .setColor(`#ffffff`);
            yield this.textChannel.send({ embeds: [embed] });
            console.log("trackStart");
        }));
        this.player.on("botDisconnect", (queue) => {
            if (!this.queue)
                throw new Error("No queue found");
            // destroy queue
            this.queue = undefined;
            console.log("queueDestroy");
        });
        // on song end
        this.player.on("trackEnd", (queue, track) => {
            // is repeat on?
            // play next song if needed or notify of song ending
            // play next playlist if needed or notify of playlist ending
            console.log("trackEnd");
        });
        this.player.on("connectionError", (queue, error) => {
            console.log(error);
        });
        this.player.on("error", (queue, error) => {
            console.log(error);
        });
    }
}
exports.default = MusicService;
