import { Client, Message } from "discord.js";
import { Service } from "./helpers/interfaces";

class LeaguePing implements Service {
    name = "League Ping";
    description = "Ping League of Legends servers";
    online = false;

    constructor() {
        this.online = true;
    }

    async execute(message: Message, client: Client) {
        if (message.content.trim() === "<@&379054265508823061>") {
            message.channel.send("<:0_:406198795404181504>");
        }
    }
}

export default LeaguePing;