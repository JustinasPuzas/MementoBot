import { Service } from "./helpers/interfaces";
import Client from "../discordClient";
import { Message, PartialMessage } from "discord.js";
import MessageDb from "../dataBase/schemas/Message";

class profileService implements Service {
  name: string = "profileService";
  description: string = "Profile Service";
  online = true;
  client: Client;

  constructor(Client: Client) {
    this.client = Client;

    this.client.on("messageCreate", async (message: Message) => {
      if (!this.online) return;
      if (message.author.bot) return;
      await MessageDb.create({
        authorId: message.author.id,
        messageId: message.id,
        content: message.content,
        message: message.toJSON(),
      });
    });

    this.client.on("messageUpdate", async (oldMessage, newMessage) => {
        // add massage to edits array
        console.log("message updated");
        if(!this.online) return;
        oldMessage = await oldMessage.fetch();
        newMessage = await newMessage.fetch();
        if(newMessage.author.bot) return;
        try {
            await MessageDb.findOneAndUpdate(
                {messageId: newMessage.id},
                {content: newMessage.content},
                {$push: {edits: newMessage.toJSON()}}
            );
            return;
        } catch (e) {
            console.log(e);
        }
        try{
            await MessageDb.create({
                authorId: newMessage.author.id,
                messageId: newMessage.id,
                content: oldMessage.content,
                message: oldMessage.toJSON(),
                edits: [newMessage.toJSON()]
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
            {messageId: message.id,},
            {deleted: true,}
          );
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  async getUser() {
    // get number of messages sent by user
    // check if exists
    // if not exists, create
    console.log("getUser");
  }

  private async registerUser() {
    // create user
    console.log("registerUser");
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
