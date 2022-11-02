import { ethers } from "hardhat";

async function main() {
  const DNotesFactory = await ethers.getContractFactory("DNotes");
  const DNotes = await DNotesFactory.deploy();

  await DNotes.deployed();

  console.log(`DNotes deployed to ${DNotes.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
