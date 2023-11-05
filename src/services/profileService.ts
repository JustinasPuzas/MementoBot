import { Service } from "./helpers/interfaces";
import Client from "../discordClient";
import { EmbedBuilder, GuildMember, Message, PartialMessage } from "discord.js";
import MessageDb from "../dataBase/schemas/Message";
import UserDb from "../dataBase/schemas/User";
import { prisma } from "../index";

class profileService implements Service {
  name: string = "Profile Service";
  description: string = "Profile Service";
  online = true;
  client: Client;

  constructor(Client: Client) {
    this.client = Client;

    this.client.on("messageCreate", async (message: Message) => {
      if (!this.online) return;
      if (message.author.bot) return;
      try{
        await prisma.message.create({
          data: {
            authorId: message.author.id,
            messageId: message.id,
            content: message.content,
            message: message.toJSON() as any,
          },
        });
      }catch (e){
        console.log(e)
      }
    });

    this.client.on("messageUpdate", async (oldMessage, newMessage) => {
      console.log("message updated");
      if (!this.online) return;
      oldMessage = await oldMessage.fetch();
      newMessage = await newMessage.fetch();
      if (newMessage.author.bot) return;
      try {
        await prisma.message.update({
          where: {
            messageId: newMessage.id,
          },
          data: {
            content: newMessage.content,
            edits: { push: newMessage.toJSON() as any },
          },
          
        });
        return;
      } catch (e) {
        console.log(e);
      }
      try {
        prisma.message.create({
          data:{
            authorId: newMessage.author.id,
            messageId: newMessage.id,
            content: oldMessage.content,
            message: oldMessage.toJSON() as any,
            edits: [newMessage.toJSON() as any],
          }
        })
        return;
      } catch (e) {
        console.log(e);
      }
    });

    this.client.on(
      "messageDelete",
      async (message: Message | PartialMessage) => {
        if (!this.online) return;
        if (message.author?.bot) return;
        try {
          await prisma.message.update({
            where: {
              messageId: message.id
            },
            data: {
              deleted: true
            }
          })
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  public getMemberProfile(member: GuildMember): GuildMember {
    member.nickname = member.nickname ? member.nickname : member.user.username;
    member.avatar = member.avatarURL()
      ? member.avatarURL()
      : member.user.avatarURL()
      ? member.user.avatarURL()
      : member.user.defaultAvatarURL;
    return member;
  }



  async execute() {
    // count time in voice channel
    // count messages
  }
}

export default profileService;
