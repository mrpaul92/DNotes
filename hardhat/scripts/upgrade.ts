import { ethers, upgrades } from "hardhat";

const V1_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
async function main() {
  const DNotesFactoryV2 = await ethers.getContractFactory("DNotesV2");
  const DNotesV2 = await upgrades.upgradeProxy(V1_ADDRESS, DNotesFactoryV2);
  console.log("DNotes Upgraded to DNotesV2");
  console.log("DNotesV2 deployed to:", DNotesV2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
