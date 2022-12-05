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
import { Service } from "./services/helpers/interfaces";

export default class Client extends DiscordClient {
  public commands!: Map<string, Command>;
  public commandTemplates!: any[];
  public services!: Map<string, Service>;
  public riotClient?: RiotClient;

  constructor(options: ClientOptions, riotClient?: RiotClient) {
    super(options);

    this.on("ready", async () => {
      await this.connectToMongoDB();

      const { cmds, cmdsTmpl } = await this.fetchCommands();
      this.commands = cmds;
      console.log("Commands loaded:", this.commands);

      await this.refreshDiscordApplicationCommands(cmdsTmpl);
      console.log("Command temoplates loaded:", this.commandTemplates);

      this.services = await this.fetchServices();
      console.log("Services loaded:", this.services);
    });

    this.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      this.services.forEach(async (service) => {
        await service.execute(message, this);
      })
    })

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

  private fetchServices = async () => {
    const services: Map<string, Service> = new Map();

    const servicesFiles = await fs.readdir(__dirname + "/services");
    for (let service of servicesFiles) {
      const serviceClass = await import(`${__dirname}/services/${service}`);
      const serviceInstance: Service = new serviceClass.default();
      services.set(serviceInstance.name, serviceInstance);
    }

    return services;
  }
}
