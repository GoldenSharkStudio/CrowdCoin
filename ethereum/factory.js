import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x0F06C9da3517135334E719Fb1b68F8Ac38a2a430'
);

export default instance;