import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ChainBank", function () {
  let chainBank: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const ChainBank = await ethers.getContractFactory("ChainBank");
    chainBank = await ChainBank.deploy();
    await chainBank.deployed();
  });

  it("should set the bank owner on deployment", async function () {
    expect(await chainBank.bankOwner()).to.equal(owner.address);
  });

  it("should allow a user to create an account", async function () {
    await expect(chainBank.connect(user1).createAccount("User1"))
      .to.emit(chainBank, "CreateAccount")
      .withArgs("User1", 0, user1.address);

    const account = await chainBank.accounts(user1.address);
    expect(account.name).to.equal("User1");
    expect(account.balance).to.equal(0);
    expect(account.accountNumber).to.equal(user1.address);
  });

  it("should prevent a user from creating multiple accounts", async function () {
    await chainBank.connect(user1).createAccount("User1");
    await expect(
      chainBank.connect(user1).createAccount("User1")
    ).to.be.revertedWith("Account already exists");
  });

  it("should allow a user to deposit Ether", async function () {
    await chainBank.connect(user1).createAccount("User1");

    await chainBank.connect(user1).deposit({ value: ethers.utils.parseEther("1") });

    const account = await chainBank.accounts(user1.address);
    expect(account.balance).to.equal(ethers.utils.parseEther("1"));
  });

  it("should allow a user to withdraw Ether", async function () {
    await chainBank.connect(user1).createAccount("User1");
    await chainBank.connect(user1).deposit({ value: ethers.utils.parseEther("1") });

    await chainBank.connect(user1).withdraw(ethers.utils.parseEther("0.5"));

    const account = await chainBank.accounts(user1.address);
    expect(account.balance).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("should allow a user to transfer Ether to another account", async function () {
    await chainBank.connect(user1).createAccount("User1");
    await chainBank.connect(user2).createAccount("User2");

    await chainBank.connect(user1).deposit({ value: ethers.utils.parseEther("1") });

    await expect(chainBank.connect(user1).transfer(user2.address, ethers.utils.parseEther("0.5")))
      .to.emit(chainBank, "TransactionEvent")
      .withArgs(user1.address, user2.address, ethers.utils.parseEther("0.5"));

    const account1 = await chainBank.accounts(user1.address);
    const account2 = await chainBank.accounts(user2.address);

    expect(account1.balance).to.equal(ethers.utils.parseEther("0.5"));
    expect(account2.balance).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("should revert on invalid withdrawal or transfer attempts", async function () {
    await chainBank.connect(user1).createAccount("User1");

    await expect(chainBank.connect(user1).withdraw(ethers.utils.parseEther("1")))
      .to.be.revertedWith("Insuffient balance");

    await expect(chainBank.connect(user1).transfer(user2.address, ethers.utils.parseEther("1")))
      .to.be.revertedWith("Insufficient balance");
  });

  it("should emit ShowBalance event when checking balance", async function () {
    await chainBank.connect(user1).createAccount("User1");

    await chainBank.connect(user1).deposit({ value: ethers.utils.parseEther("1") });

    await expect(chainBank.connect(user1).getBalance())
      .to.emit(chainBank, "ShowBalance")
      .withArgs("Your account balance is", ethers.utils.parseEther("1"));
  });
});
