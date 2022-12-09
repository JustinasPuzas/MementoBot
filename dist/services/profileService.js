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
class profileService {
    constructor(Client) {
        this.name = "profileService";
        this.description = "Profile Service";
        this.online = true;
        this.client = Client;
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
