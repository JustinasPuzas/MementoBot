import { Client } from "../index";
import { Message } from "discord.js";

export interface Service {
    name: string;
    description: string;
    async execute: (message: Message, client: Client) => Promise<void>;
  }