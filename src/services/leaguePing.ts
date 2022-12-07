import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  Interaction,
  Message,
  User,
} from "discord.js";
import Client from "../discordClient";
import { Service } from "./helpers/interfaces";

class LeaguePing implements Service {
  public id = "leaguePing";
  public name = "League Ping";
  public description = "Ping League of Legends servers";
  public online = false;

  private buttonYes = new ButtonBuilder({
    label: "",
    style: ButtonStyle.Danger,
    custom_id: `${this.id}Yes`,
    emoji: "<:0_:406198795404181504>"
  });

  private buttonNo = new ButtonBuilder({
    label: "Bijau",
    style: ButtonStyle.Secondary,
    custom_id: `${this.id}No`,
  });

  private actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    this.buttonYes,
    this.buttonNo
  );

  private client!: Client;
  private members: Map<String, User> = new Map();
  private message?: Message = undefined;

  constructor(Client: Client) {
    this.online = true;
    this.client = Client;
  }

  public async execute(message: Message, client: Client) {
    if (message.content.trim() !== "<@&379054265508823061>") return;
    await this.reset();
    this.members.set(message.author.id, message.author);
    this.message = await message.channel.send({
      content: `<:0_:406198795404181504> ${message.author}`,
      components: [this.actionRow],
    });
    this.client.interactions.set(`${this.id}Yes`, this.handleYesInteraction);
    this.client.interactions.set(`${this.id}No`, this.handleNoInteraction);
    return;
  }

  //exported function
  private async handleYesInteraction(
    interaction: ButtonInteraction,
    client: Client
  ) {
    const parent = client.services.get("League Ping") as LeaguePing;
    console.log(interaction);
    const user = interaction.user;
    parent.members.set(user.id, user);
    await parent.update(interaction);
  }

  //exported function
  private async handleNoInteraction(
    interaction: ButtonInteraction,
    client: Client
  ) {
    // find existing members and remove
    // if user doesn't exist, add to niger list
    const parent = client.services.get("League Ping") as LeaguePing;
    if (parent.members.delete(interaction.user.id)) parent.update(interaction);
  }

  public async update(interaction: ButtonInteraction) {
    let content = ``;
    let counter = 1;

    this.members.forEach((id, user) => {
      if(counter == 5) content += "**Queue:** \n";
      content += `<:0_:406198795404181504> <@${user}>\n`;
      counter++;
    });

    if(this.members.size === 0) content = "No one wants to play League :(";

    await interaction.update({ content });
  }

  private async reset() {
    this.client.interactions.delete(`${this.id}Yes`);
    this.client.interactions.delete(`${this.id}No`);
    this.members = new Map();
    await this.message?.delete();
  }
}

export default LeaguePing;
