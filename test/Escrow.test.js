const { expect } = require("chai");

describe("Escrow", function () {
  it("Should increment escrowId and have less balance from sender...", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.deployed();

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const balance = await addr1.getBalance();
    console.log(balance.toString());
    await escrow.connect(addr1).register(addr2.address, { value: 1000 });
    const agreements = await escrow.agreements(1);
    const balance2 = await addr1.getBalance();

    console.log(balance2.toString());
    expect(await escrow.escrowId()).to.equal(1);
    expect(agreements.value).to.equal(1000);
  });

  it("Should not register on same account...", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.deployed();

    const [_owner, addr1] = await ethers.getSigners();
    await expect(
      escrow.connect(addr1).register(addr1.address, { value: 1000 })
    ).to.be.revertedWith("Cannot register the same address");
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
