import mongoose, { model, Schema, ObjectId } from "mongoose";

interface IUser {
  discordId: string;
  userName: string;
  leagueOfLegendsNickName?: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  discordId: { type: String, required: true },
  userName: { type: String, required: true },
  leagueOfLegendsNickName: { type: String, required: false },
});

const UserDb = model<IUser>("User", userSchema);

export default UserDb;
