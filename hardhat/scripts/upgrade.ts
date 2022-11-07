import { ethers, upgrades } from "hardhat";

const PREVIOUS_ADDRESS = "0x4AAbF5854dAdBAC67FFf1E2Aa2af948e04d8a551";
async function main() {
  const DNotesFactoryV2 = await ethers.getContractFactory("DNotesV2");
  const DNotesV2 = await upgrades.upgradeProxy(PREVIOUS_ADDRESS, DNotesFactoryV2);
  console.log("DNotes Upgraded to DNotesV2");
  console.log("DNotesV2 deployed to:", DNotesV2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
