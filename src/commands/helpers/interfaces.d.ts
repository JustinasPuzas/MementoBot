import { Client } from "../index";

export interface Command {
  online: boolean;
  name: string;
  description: string;
  template: any;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>,
    client: Client
  ) => Promise<void | InteractionResponse<boolean>>;
}
