import { LolApi, Constants } from "twisted";
import { IBaseApiParams } from "twisted/dist/base/base.utils";
import { Regions } from "twisted/dist/constants";

export default class Client extends LolApi {
  private defaultRegion = Regions.EU_WEST;

  constructor(options: IBaseApiParams) {
    super(options);
  }

  // default EUW1
  async getUser(userName: string, region: Regions = this.defaultRegion) {
    try {
      const req = await this.Summoner.getByName(userName, region);
      return req.response;
    } catch (err) {
      console.log(err);
      throw new Error("User not found");
    }
  }
}
