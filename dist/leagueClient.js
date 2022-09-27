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
        this.defaultRegion = constants_1.Regions.EU_WEST;
    }
    // default EUW1
    getUser(userName, region = this.defaultRegion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const req = yield this.Summoner.getByName(userName, region);
                return req.response;
            }
            catch (err) {
                console.log(err);
                throw new Error("User not found");
            }
        });
    }
}
exports.default = Client;
