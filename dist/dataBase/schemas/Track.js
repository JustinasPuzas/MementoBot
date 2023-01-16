"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trackSchema = new mongoose_1.Schema({
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
const TrackDb = (0, mongoose_1.model)("Track", trackSchema);
exports.default = TrackDb;
