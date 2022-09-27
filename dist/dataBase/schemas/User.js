"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    discordId: { type: String, required: true },
    userName: { type: String, required: true },
    leagueOfLegendsNickName: { type: String, required: false },
});
const UserDb = (0, mongoose_1.model)('User', userSchema);
exports.default = UserDb;
