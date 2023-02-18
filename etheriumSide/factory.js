import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  process.env.CAMPAIGN_FACTORY
  //address where our CampaignFactory contract has been deployed ,we made this file to access that contract from our code
);

export default instance;
