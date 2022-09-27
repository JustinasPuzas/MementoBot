import {
  Client as DiscordClient,
  ClientOptions,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import PingCommand from "./commands/ping";
import fs from "fs/promises";
import { Command } from "./commands/helpers/interfaces";
import RiotClient from "./leagueClient";

export default class Client extends DiscordClient {
  public commands!: Map<string, Command>;
  public commandTemplates!: any[];
  public riotClient?: RiotClient;

  constructor(options: ClientOptions, riotClient: RiotClient) {
    super(options);
    this.riotClient = riotClient;

    this.on("ready", async () => {
      await this.connectToMongoDB();
      const { cmds, cmdsTmpl } = await this.fetchCommands();
      this.commands = cmds;
      await this.refreshDiscordApplicationCommands(cmdsTmpl);
    });

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      await this.commands
        .get(interaction.commandName)
        ?.execute(interaction, this);
    });

    this.login(process.env.DISCORD_BOT_TOKEN);
  }

  // connect to MongoDB
  private connectToMongoDB = async () => {
    try {
      mongoose.connect(`${process.env.DB_CONN_STRING}`);
      console.log("Connected to MongoDB Atlas");
    } catch (error) {
      console.log(error);
    }
  };

  // update discord application commands
  private refreshDiscordApplicationCommands = async (
    commandTemplates: any[]
  ) => {
    const rest = new REST({ version: "10" }).setToken(
      `${process.env.DISCORD_BOT_TOKEN}`
    );

    try {
      console.log("Started refreshing application (/) commands.");
      await this.fetchCommands();
      await rest.put(Routes.applicationCommands(`${process.env.CLIENT_ID}`), {
        body: commandTemplates,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  };

  // fetch commands from commands folder
  private fetchCommands = async () => {
    const cmds: Map<string, Command> = new Map();
    const cmdsTmpl = [];
    const commandFiles = await fs.readdir(__dirname + "/commands");

    for (let commandFile of commandFiles) {
      const command = await import(`${__dirname}/commands/${commandFile}`);
      const cmd: Command = new command.default();
      cmds.set(cmd.name, cmd);
      console.log(cmd.template);
      if (cmd.template) cmdsTmpl.push(cmd.template);
    }

    return { cmds, cmdsTmpl };
  };
}
