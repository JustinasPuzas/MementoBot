import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { PrismaClient } from '@prisma/client'

import Client from "./discordClient";

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
export const prisma = new PrismaClient()
export const client = new Client({ intents });