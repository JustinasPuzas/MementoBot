import { Client } from "../index";

export interface Command {
    name: string;
    description: string;
    template: any;
    async execute: (interaction: Interaction<CacheType>, client: Client) => Promise<void>;
  }