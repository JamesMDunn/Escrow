const { expect, assert } = require("chai");

describe("Escrow", function () {
  xit("Should not register on same account...", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.deployed();

    const [_owner, addr1] = await ethers.getSigners();
    await expect(
      escrow.connect(addr1).register(addr1.address, { value: 1000 })
    ).to.be.revertedWith("Cannot register the same address");
  });

  xit("Should increment escrowId and have less balance from sender...", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.deployed();

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const balance = await addr1.getBalance();
    await escrow.connect(addr1).register(addr2.address, { value: 1000 });
    const agreements = await escrow.agreements(1);

    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(1000);
  });

  it("Should be able to withdraw...", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.deployed();

    const [_owner, addr1, addr2] = await ethers.getSigners();
    await escrow.connect(addr1).register(addr2.address, 1, { value: 1009 });
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
    //TODO better test?
    assert.notEqual(balance1.toString(), balance2.toString());
  });

  xit("Should return the new greeting once it's changed", async function () {
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
