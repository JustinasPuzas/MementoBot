"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importDefault(require("mongoose"));
const promises_1 = __importDefault(require("fs/promises"));
class Client extends discord_js_1.Client {
    constructor(options, riotClient) {
        super(options);
        // connect to MongoDB
        this.connectToMongoDB = () => __awaiter(this, void 0, void 0, function* () {
            try {
                mongoose_1.default.connect(`${process.env.DB_CONN_STRING}`);
                console.log("Connected to MongoDB Atlas");
            }
            catch (error) {
                console.log(error);
            }
        });
        // update discord application commands
        this.refreshDiscordApplicationCommands = (commandTemplates) => __awaiter(this, void 0, void 0, function* () {
            const rest = new discord_js_1.REST({ version: "10" }).setToken(`${process.env.DISCORD_BOT_TOKEN}`);
            try {
                console.log("Started refreshing application (/) commands.");
                yield this.fetchCommands();
                yield rest.put(discord_js_1.Routes.applicationCommands(`${process.env.CLIENT_ID}`), {
                    body: commandTemplates,
                });
                console.log("Successfully reloaded application (/) commands.");
            }
            catch (error) {
                console.error(error);
            }
        });
        // fetch commands from commands folder
        this.fetchCommands = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cmds = new Map();
            const cmdsTmpl = [];
            const commandFiles = yield promises_1.default.readdir(__dirname + "/commands");
            for (let commandFile of commandFiles) {
                const command = yield (_a = `${__dirname}/commands/${commandFile}`, Promise.resolve().then(() => __importStar(require(_a))));
                const cmd = new command.default();
                cmds.set(cmd.name, cmd);
                console.log(cmd.template);
                if (cmd.template)
                    cmdsTmpl.push(cmd.template);
            }
            return { cmds, cmdsTmpl };
        });
        this.fetchServices = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const services = new Map();
            const servicesFiles = yield promises_1.default.readdir(__dirname + "/services");
            for (let service of servicesFiles) {
                const serviceClass = yield (_b = `${__dirname}/services/${service}`, Promise.resolve().then(() => __importStar(require(_b))));
                const serviceInstance = new serviceClass.default(this);
                services.set(serviceInstance.name, serviceInstance);
            }
            return services;
        });
        this.on("ready", () => __awaiter(this, void 0, void 0, function* () {
            yield this.connectToMongoDB();
            console.log("Connected to MongoDB Atlas");
            this.GUILD = this.guilds.cache.get("308024048967745536");
            const { cmds, cmdsTmpl } = yield this.fetchCommands();
            this.commands = cmds;
            console.log("Commands loaded:", this.commands);
            yield this.refreshDiscordApplicationCommands(cmdsTmpl);
            console.log("Command templates loaded:", this.commandTemplates);
            this.services = yield this.fetchServices();
            console.log("Services loaded:", this.services);
        }));
        this.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            if (!interaction.user)
                return;
            if (!interaction.isChatInputCommand())
                return;
            try {
                const reply = yield ((_c = this.commands
                    .get(interaction.commandName)) === null || _c === void 0 ? void 0 : _c.execute(interaction, this));
                if (reply)
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield interaction.deleteReply();
                    }), 120 * 1000);
            }
            catch (e) {
                console.log(e);
                const reply = yield interaction.reply(`**There was an error while executing this command!**\n${e}`);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 60 * 1000);
            }
        }));
        this.login(process.env.DISCORD_BOT_TOKEN);
    }
}
exports.default = Client;
