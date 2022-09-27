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
const twisted_1 = require("twisted");
const constants_1 = require("twisted/dist/constants");
class Client extends twisted_1.LolApi {
    constructor(options) {
        super(options);
    }
    // default EUW1
    getUser(userName, region = constants_1.Regions.EU_WEST) {
        return __awaiter(this, void 0, void 0, function* () {
            const Summoner = yield this.Summoner.getByName(userName, region);
            return;
        });
    }
}
exports.default = Client;
