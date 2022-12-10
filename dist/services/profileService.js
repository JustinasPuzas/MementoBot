"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("../dataBase/schemas/Message"));
class profileService {
    constructor(Client) {
        this.name = "profileService";
        this.description = "Profile Service";
        this.online = true;
        this.client = Client;
        this.client.on("messageCreate", (message) => __awaiter(this, void 0, void 0, function* () {
            if (!this.online)
                return;
            if (message.author.bot)
                return;
            yield Message_1.default.create({
                authorId: message.author.id,
                messageId: message.id,
                content: message.content,
                message: message.toJSON(),
            });
        }));
        this.client.on("messageUpdate", (oldMessage, newMessage) => __awaiter(this, void 0, void 0, function* () {
            // add massage to edits array
            console.log("message updated");
            if (!this.online)
                return;
            oldMessage = yield oldMessage.fetch();
            newMessage = yield newMessage.fetch();
            if (newMessage.author.bot)
                return;
            try {
                yield Message_1.default.findOneAndUpdate({ messageId: newMessage.id }, { content: newMessage.content }, { $push: { edits: newMessage.toJSON() } });
                return;
            }
            catch (e) {
                console.log(e);
            }
            try {
                yield Message_1.default.create({
                    authorId: newMessage.author.id,
                    messageId: newMessage.id,
                    content: oldMessage.content,
                    message: oldMessage.toJSON(),
                    edits: [newMessage.toJSON()]
                });
                return;
            }
            catch (e) {
                console.log(e);
            }
        }));
        this.client.on("messageDelete", (message) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.online)
                return;
            if ((_a = message.author) === null || _a === void 0 ? void 0 : _a.bot)
                return;
            try {
                yield Message_1.default.findOneAndUpdate({ messageId: message.id, }, { deleted: true, });
            }
            catch (e) {
                console.log(e);
            }
        }));
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            // get number of messages sent by user
            // check if exists
            // if not exists, create
            console.log("getUser");
        });
    }
    registerUser() {
        return __awaiter(this, void 0, void 0, function* () {
            // create user
            console.log("registerUser");
        });
    }
    connectToOpGg() {
        return __awaiter(this, void 0, void 0, function* () {
            // check if exists
            // connect to op.gg
            // get user info
            // update user
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // count time in voice channel
            // count messages
        });
    }
}
exports.default = profileService;
