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
const index_1 = require("../index");
class MemberP {
    constructor(user) {
        this.client = index_1.client;
        this.user = user;
    }
    getMember() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.guildMember)
                return this.guildMember;
            this.guildMember = yield index_1.client.GUILD.members.fetch(this.user.id);
            return this.guildMember;
        });
    }
    avatarURL() {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.getMember();
            return member.avatarURL() || member.user.avatarURL() || member.user.defaultAvatarURL;
        });
    }
    bannerURL() {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.getMember();
            return member.user.bannerURL() || member.user.defaultAvatarURL;
        });
    }
}
exports.default = MemberP;
