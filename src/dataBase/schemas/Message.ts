import { AnyAPIActionRowComponent, DiscordAPIError, Message } from "discord.js";
import mongoose, { model, Schema, ObjectId } from "mongoose";

interface IMessage {
  authorId: string;
  messageId: string;
  content: String;
  message: JSON | Message;
  deleted: Boolean;
  edits?: Array<JSON | Message>;
}

const userSchema = new Schema<IMessage>({
  authorId: { type: String, required: true },
  messageId: { type: String, required: true },
  content: { type: String, required: false },
  message: { type: JSON, required: true },
  deleted: { type: Boolean, required: true, default: false },
  edits: { type: Array<JSON>, required: false },
});

const MessageDb = model<IMessage>("Message", userSchema);

export default MessageDb;
