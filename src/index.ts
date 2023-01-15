import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import Client from "./discordClient";
import RiotClient from "./leagueClient";

dotenv.config();

// discord intents
const intents = [
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildVoiceStates,
];

//const riotClient = new RiotClient({ key: process.env.RIOT_API_KEY });
const client = new Client({ intents });
