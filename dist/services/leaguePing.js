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
Object.defineProperty(exports, "__esModule", { value: true });
class LeaguePing {
    constructor() {
        this.name = "League Ping";
        this.description = "Ping League of Legends servers";
        this.online = false;
        this.online = true;
    }
    execute(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.content.trim() === "<@&379054265508823061>") {
                message.channel.send("<:0_:406198795404181504>");
            }
        });
    }
}
exports.default = LeaguePing;
