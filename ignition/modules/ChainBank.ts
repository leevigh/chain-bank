import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ChainBankModule = buildModule("ChainBankModule", (m) => {

  const chainBank = m.contract("ChainBank");

  return { chainBank };
});

export default ChainBankModule;
