import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades"; // for proxy
import "@nomiclabs/hardhat-etherscan";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.GOERLI_NODE_URL,
      accounts: [process.env.GOERLI_ACCOUNT_PRIVATE_KEY ? process.env.GOERLI_ACCOUNT_PRIVATE_KEY : ""],
    },
    polygon: {
      url: process.env.POLYGON_NODE_URL,
      accounts: [process.env.POLYGON_ACCOUNT_PRIVATE_KEY ? process.env.POLYGON_ACCOUNT_PRIVATE_KEY : ""],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
