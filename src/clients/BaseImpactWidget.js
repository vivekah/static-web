import BaseWidget from "./BaseWidget";

class BaseImpactWidget extends BaseWidget {
  constructor(options = {}) {
    super(options);
    this._state = {
      hash: null,
      data: null,
    };
    this.input = {
      user: null,
      nonprofit: null,
      chain: null
    };
  }

  getCacheKey(input) {
    let str = `${input.nonprofit || ""}${input.user || ""}`;
    return super.getCacheKey(str);
  }

  async getData(args) {
    let cacheKey = this.getCacheKey(args);

    let data = this.data;
    
    if (this.options.beamCommunityData){
      return this.options.beamCommunityData
    }
    
    if (this.options.lan){
      this.options.themeConfig.lan = this.options.lan
    }

    if (cacheKey !== this.cacheKey) {
      this.cacheKey = cacheKey;
      this.input.user = args.user;
      this.input.nonprofit = args.nonprofit;
      this.input.chain = args.chain;

      data = await this.makeAPIRequest("api/v2/chains/impact/all", {
        // nonprofit: args.nonprofit,
        // user: args.user,
        lan: this.options.lan,
        chain: args.chain
      });
    }

    return data;
  }
}

export default BaseImpactWidget;
