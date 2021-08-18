/* eslint-disable jest/valid-expect */
import { ethers, network } from "hardhat";
import { expect, assert } from "chai";
import { Contract, Signer } from "ethers";

describe("Escrow", () => {
  let Escrow;
  let escrow: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    await escrow.deployed();
  });

  it("Should not register on same account...", async () => {
    await expect(
      escrow
        .connect(addr1)
        .register(await addr1.getAddress(), 1, { value: 1000 })
    ).to.be.revertedWith("Cannot register the same address");
  });

  it("Should increment escrowId and have less balance from sender...", async () => {
    await escrow
      .connect(addr1)
      .register(await addr2.getAddress(), 1, { value: 1000 });
    const agreements = await escrow.agreements(1);

    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value.eq(1000)).to.equal(true);
  });

  it("Should be able to withdraw...", async () => {
    await escrow
      .connect(addr1)
      .register(await addr2.getAddress(), 2, { value: 1009 });
    const agreements = await escrow.agreements(1);
    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(1009);

    const balance1 = await addr2.getBalance();
    //mine a block
    await network.provider.send("evm_mine");
    await network.provider.send("evm_mine");
    await escrow.connect(addr2).withdraw(1);
    const balance2 = await addr2.getBalance();

    let agreements2 = await escrow.agreements(1);
    expect(agreements2.paidOut.eq(agreements2.payRate)).to.equal(true);
    expect(
      agreements.lastActivityBlock.lt(agreements2.lastActivityBlock)
    ).to.equal(true);

    expect(agreements.expiredLock.lt(agreements2.expiredLock)).to.equal(true);
    expect(balance1.eq(balance2)).to.equal(false);
  });

  it("Should be able to withdraw last payment...", async () => {
    // TODO last payment could be less than gas so wont be worth to withdraw
    await escrow
      .connect(addr1)
      .register(await addr2.getAddress(), 1, { value: 2000000000000000 });

    const balance1 = await addr2.getBalance();
    //mine a block
    await network.provider.send("evm_mine");
    await escrow.connect(addr2).withdraw(1);
    const balance2 = await addr2.getBalance();
    expect(balance2.gt(balance1)).to.equal(true);
  });

  it("Should not be able to withdraw, not payblock...", async () => {
    await escrow
      .connect(addr1)
      .register(await addr2.getAddress(), 1, { value: 1009 });
    const agreements = await escrow.agreements(1);

    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(1009);

    await expect(escrow.connect(addr2).withdraw(1)).to.be.revertedWith(
      "Its not payblock time yet"
    );
  });

  it("Should not be able to withdraw, not withdrawer...", async () => {
    await escrow
      .connect(addr1)
      .register(await addr2.getAddress(), 1, { value: 1009 });
    const agreements = await escrow.agreements(1);

    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(1009);

    await expect(escrow.connect(addr1).withdraw(1)).to.be.revertedWith(
      "you are not the withdrawer"
    );
  });

  it("Should be able to depositerwithdraw...", async () => {
    await escrow.connect(addr1).register(await addr2.getAddress(), 1, {
      value: ethers.utils.parseUnits("30"),
    });
    const agreements = await escrow.agreements(1);

    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(ethers.utils.parseUnits("30"));

    const balance1 = await addr1.getBalance();
    await escrow.connect(addr1).depositorWithdraw(1);
    const balance2 = await addr1.getBalance();

    expect(balance1.lt(balance2)).to.equal(true);
  });

  xit("Should return the new greeting once it's changed", async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
