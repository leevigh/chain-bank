import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = vars.get("API_KEY");
const SECRET_KEY = vars.get("SECRET_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    // for testnet
    "lisk-sepolia": {
      url: process.env.LISK_RPC_URL!,
      accounts: [SECRET_KEY!],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
    apiKey: {
      "lisk-sepolia": "123",
    },
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  // networks: {
  //   sepolia: {
  //     url: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`,
  //     accounts: [`${SECRET_KEY}`],
  //   },
  // },
  // etherscan: {
  //   apiKey: {
  //     sepolia: ETHERSCAN_API_KEY,
  //   },
  // },
};

// Deployed Addresses

// ChainBankModule#ChainBank - 0x4eb165E328557d5529b35B6254E874ccA68c8589

export default config;
