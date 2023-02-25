import { Client } from "../index";

export interface Command {
    name: string;
    description: string;
    template: any;
    async execute: (interaction: ChatInputCommandInteraction<CacheType>, client: Client) => Promise<void | InteractionResponse<boolean>>;
  }