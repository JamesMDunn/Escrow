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
    expect(agreements.value).to.equal(1000);
  });

  it("Should be able to withdraw...", async () => {
    await escrow
      .connect(addr1)
      .register(await addr2.getAddress(), 1, { value: 1009 });
    const agreements = await escrow.agreements(1);

    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(1009);

    const balance1 = await addr2.getBalance();
    //mine a block
    await network.provider.send("evm_mine");
    await escrow.connect(addr2).withdraw(1);
    const balance2 = await addr2.getBalance();
    console.log(agreements.value.toString());
    let agreements2 = await escrow.agreements(1);
    console.log(
      "paid out",
      agreements2.paidOut.toString(),
      agreements2.payRate.toString()
    );
    expect(agreements2.paidOut).to.equal(agreements2.payRate);
    //TODO better test?
    assert.notEqual(balance1.toString(), balance2.toString());
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
