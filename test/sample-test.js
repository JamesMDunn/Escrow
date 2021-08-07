const { expect } = require("chai");

describe("Escrow", function () {
  it("Should increment escrowId ...", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();
    await escrow.deployed();
    const [owner, addr1] = await ethers.getSigners();
    console.log("Addy ", addr1);
    await escrow.register(addr1.address);
    expect(await escrow.escrowId()).to.equal(1);
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
