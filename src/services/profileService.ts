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
      await prisma.message.create({
        data: {
          authorId: message.author.id,
          messageId: message.id,
          content: message.content,
          message: message.toString(),
        },
      });
    });

    this.client.on("messageUpdate", async (oldMessage, newMessage) => {
      // add massage to edits array
      console.log("message updated");
      if (!this.online) return;
      oldMessage = await oldMessage.fetch();
      newMessage = await newMessage.fetch();
      if (newMessage.author.bot) return;
      try {
        await MessageDb.findOneAndUpdate(
          { messageId: newMessage.id },
          { content: newMessage.content },
          { $push: { edits: newMessage.toJSON() } }
        );
        return;
      } catch (e) {
        console.log(e);
      }
      try {
        await MessageDb.create({
          authorId: newMessage.author.id,
          messageId: newMessage.id,
          content: oldMessage.content,
          message: oldMessage.toJSON(),
          edits: [newMessage.toJSON()],
        });
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
          await MessageDb.findOneAndUpdate(
            { messageId: message.id },
            { deleted: true }
          );
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  public async getMemberProfileEmbed(
    member: GuildMember
  ): Promise<EmbedBuilder> {
    const userDb = await UserDb.findOne({ userId: member.id });
    member = this.getMemberProfile(member);
    const embed = new EmbedBuilder()
      .setThumbnail(member.avatar)
      .setTitle(member.nickname);

    // get number of messages sent by user
    // check if exists
    // if not exists, create
    return embed;
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

  async connectToOpGg() {
    // check if exists
    // connect to op.gg
    // get user info
    // update user
  }

  async execute() {
    // count time in voice channel
    // count messages
  }
}

export default profileService;
