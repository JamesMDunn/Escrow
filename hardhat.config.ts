import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "solidity-coverage";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      chainId: 1337,
    },
  },
  solidity: "0.8.4",
};
