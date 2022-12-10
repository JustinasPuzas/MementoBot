"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    authorId: { type: String, required: true },
    messageId: { type: String, required: true },
    content: { type: String, required: false },
    message: { type: JSON, required: true },
    deleted: { type: Boolean, required: true, default: false },
    edits: { type: (Array), required: false },
});
const MessageDb = (0, mongoose_1.model)('Message', userSchema);
exports.default = MessageDb;
