import discord, { APIInteractionGuildMember } from "discord.js";
import UserDb from "../dataBase/schemas/User";
import Client from "../discordClient";
import {client} from "../index";


class MemberP{
    private client: Client = client
    private user: discord.User;
    public guildMember!: discord.GuildMember;

    constructor(user: discord.User){
        this.user = user;
    }

    async getMember(){
        if(this.guildMember) return this.guildMember;
        this.guildMember = await client.GUILD.members.fetch(this.user.id)
        return this.guildMember;
    }

    async avatarURL(){
        const member = await this.getMember();
        return member.avatarURL()! || member.user.avatarURL()! || member.user.defaultAvatarURL;
    }

    async bannerURL(){
        const member = await this.getMember();
        return member.user.bannerURL()! || member.user.defaultAvatarURL;
    }

}

export default MemberP;