import { AnyAPIActionRowComponent, DiscordAPIError, Message } from "discord.js";
import mongoose, { model, Schema, ObjectId } from "mongoose";

interface ITrack {
  id: String;
  title: String;
  author: String;
  url: String;
  thumbnail: String;
  duration: String;
  views: Number;
  requestedById: String;
  playlist?: String;
}

const trackSchema = new Schema<ITrack>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: { type: String, required: true },
  duration: { type: String, required: true },
  views: { type: Number, required: true },
  requestedById: { type: String, required: true },
  playlist: { type: String, required: false },
});

const TrackDb = model<ITrack>("Track", trackSchema);

export default TrackDb;
