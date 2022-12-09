import { Service } from "./helpers/interfaces";
import Client from "../discordClient";


class profileService implements Service {
    name: string = "profileService";
    description: string = "Profile Service";
    online = true;
    client: Client;
    
    constructor(Client: Client) {
        this.client = Client;
    }

    async getUser() {
        // get number of messages sent by user
        // check if exists
        // if not exists, create
        console.log("getUser");
    }

    private async registerUser() {
        // create user
        console.log("registerUser");
    }

    async connectToOpGg() {
        // check if exists
        // connect to op.gg
        // get user info
        // update user
    }

    async execute() {
        // count time in voice channel
        // count messages 
    }
}

export default profileService;