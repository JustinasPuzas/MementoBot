import {
  Client as DiscordClient,
  ClientOptions,
  GatewayIntentBits,
  Guild,
  Interaction,
  REST,
  Routes,
} from "discord.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs/promises";
import { Command } from "./commands/helpers/interfaces";
import { Service } from "./services/helpers/interfaces";

const displayList = (list: Map<string, any>) => {
  if (list.size > 0) {
    let display = "";
    for (let i of list) {
      display += `✅ ${i[0]}\n`;
    }
    return `\n${display}`;
  }
  return "none\n";
};

export default class Client extends DiscordClient {
  public commands!: Map<string, Command>;
  public commandTemplates!: any[];
  public services!: Map<string, Service>;
  public GUILD!: Guild;
  constructor(options: ClientOptions) {
    super(options);

    this.on("ready", async () => {
      console.log("🌀 Connecting to MongoDB Atlas...");
      await this.connectToMongoDB();

      this.GUILD = this.guilds.cache.get("308024048967745536") as Guild;

      this.services = await this.fetchServices();
      console.log("Services loaded:", displayList(this.services));

      const { cmds, cmdsTmpl } = await this.fetchCommands();
      this.commands = cmds;
      console.log("Commands loaded:", displayList(this.commands));

      await this.refreshDiscordApplicationCommands(cmdsTmpl);
    });

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.user) return;
      if (!interaction.isChatInputCommand()) return;
      try {
        const reply = await this.commands
          .get(interaction.commandName)
          ?.execute(interaction, this);
        if (reply)
          setTimeout(async () => {
            await interaction.deleteReply();
          }, 120 * 1000);
      } catch (e) {
        console.log(e);
        const reply = await interaction.reply(
          `**There was an error while executing this command!**\n${e}`
        );
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 60 * 1000);
      }
    });

    this.login(process.env.DISCORD_BOT_TOKEN);
  }

  // connect to MongoDB
  private connectToMongoDB = async () => {
    try {
      await mongoose.connect(`${process.env.DB_CONN_STRING}`);
      console.log("✅ Connected to MongoDB Atlas");
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

      console.log("✅ Successfully reloaded application (/) commands.\n");
    } catch (error) {
      console.error(error);
    }
  };

  // fetch commands from commands folder
  private fetchCommands = async () => {
    const cmds: Map<string, Command> = new Map();
    const cmdsTmpl = [];
    const commandFiles = await fs.readdir(__dirname + "/commands", {
      withFileTypes: true,
    });

    for (let commandFile of commandFiles) {
      if (commandFile.isDirectory()) continue;
      const command = await import(`${__dirname}/commands/${commandFile.name}`);
      const cmd: Command = new command.default();
      if (!cmd.online) continue;
      cmds.set(cmd.name, cmd);
      //console.log(cmd.template);
      if (cmd.template) cmdsTmpl.push(cmd.template);
    }

    return { cmds, cmdsTmpl };
  };

  private fetchServices = async () => {
    const services: Map<string, Service> = new Map();
    const servicesFiles = await fs.readdir(__dirname + "/services", {
      withFileTypes: true,
    });
    for (let service of servicesFiles) {
      if (service.isDirectory()) continue;
      const serviceClass = await import(
        `${__dirname}\\services\\${service.name}`
      );
      if (!serviceClass) continue;
      const serviceInstance: Service = new serviceClass.default(this);
      if (serviceInstance.online)
        services.set(serviceInstance.name, serviceInstance);
    }

    return services;
  };
}
