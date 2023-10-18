import {
  APIActionRowComponent,
  APITextInputComponent,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import MusicService from "../services/musicService";
import { Command } from "./helpers/interfaces";
import PingService from "../services/leaguePing";
import MemberP from "../parsers/Member";

export default class RoleCommand implements Command {
  online = true;
  name = "role";
  description = "Opens role selection window";
  template = {
    name: "role",
    description: "Opens role selection window",
    // options: [
    //     {
    //         name: "query",
    //         type: ApplicationCommandOptionType.String,
    //         description: "The song you want to play",
    //         required: true
    //     }
    // ]
  };

  private roleAddInputActionRow: any = new ActionRowBuilder({
    type: ComponentType.ActionRow,
    components: [
      new TextInputBuilder({
        required: false,
        type: ComponentType.TextInput,
        custom_id: "roleAdd_modal_input",
        placeholder: "LOL, FLEX, TFT, VALORANT, etc...",
        max_length: 200,
        label: "Add Roles",
        style: TextInputStyle.Short,
      }),
    ],
  });

  private roleRemoveInputActionRow: any = new ActionRowBuilder({
    type: ComponentType.ActionRow,
    components: [
      new TextInputBuilder({
        required: false,
        type: ComponentType.TextInput,
        custom_id: "roleRemove_modal_input",
        placeholder: "LOL, FLEX, TFT, VALORANT, etc...",
        max_length: 200,
        label: "Remove Roles",
        style: TextInputStyle.Short,
      }),
    ],
  });

  async execute(interaction: CommandInteraction, client: Client) {
    // user roles
    const memberp: MemberP = new MemberP(interaction.user)
    const member = await memberp.getMember();
    if(!member) throw new Error("Couldn't associate User with a server member");
    const memberRoles = member.roles;

    // ping roles
    const pingService = client.services.get("Ping Service") as PingService;
    const pingRoles = pingService.pingInfo;

    // Sort Roles and populate keywords
    const addableRoles = new Map();
    const removableRoles = new Map();
    
    for(let role of pingRoles){
        const keywords = role[1].keywords
        if(memberRoles.cache.has(role[0])){
            removableRoles.set(role, keywords)
        }
            
        addableRoles.set(role, keywords)
    }

    // inject roles to add ==> add roles placeholder
    console.log(`${Array.from(addableRoles.keys()).map((role) => role[1].name).join(", ")}`)
    this.roleRemoveInputActionRow.components[0].placeholder = `${Array.from(removableRoles.keys()).map((role) => role[1].name).join(", ")}`
    // inject roles to remove ==> remove roles placeholder

    const modal = new ModalBuilder({
      title: "Role Selection",

      custom_id: "role_selection",
      components: [this.roleAddInputActionRow, this.roleRemoveInputActionRow],
    });
    await interaction.showModal(modal);

    return;
  }
}
