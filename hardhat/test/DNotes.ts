import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DNotes", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDNotes() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const DNotesFactory = await ethers.getContractFactory("DNotes");
    const DNotes = await DNotesFactory.deploy();

    return { DNotes, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("Register a user", async () => {
      const { DNotes, owner, otherAccount } = await loadFixture(deployDNotes);
      await DNotes.createUser("User");
    });
    it("Get User Data", async () => {
      const { DNotes, owner, otherAccount } = await loadFixture(deployDNotes);
      const user = await DNotes.getUser();
    });
  });
});
