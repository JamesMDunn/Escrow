import React, { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { abi } from "./config";

const App = () => {
  const [allAddresses, setAllAddresses] = useState<String[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [id, setId] = useState(0);
  const [escrowContract, setEscrowContract] = useState<Contract>(
    {} as Contract
  );
  const [toAddress, setToAddress] = useState("");
  const [payInterval, setPayInterval] = useState(0);

  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();
  console.log(" this is contract", escrowContract);
  console.log("testing this");

  useEffect(() => {
    getAddresses();
    connectContract();
    return () => {
      // escrowContract.removeAllListeners();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const connectContract = () => {
    let contract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi,
      provider
    );
    console.log("connected", contract);
    setEscrowContract(contract);
    contract.on("Registered", (escrowId, depositer, withdrawer) => {
      console.log("event sent contract", escrowId, depositer, withdrawer);
    });
  };

  const getAddresses = async (): Promise<void> => {
    const accs = await provider.listAccounts();
    console.log(accs);
    setAllAddresses(accs);
  };

  const idOnClick = async () => {
    console.log(id);
    let agreement = await escrowContract.agreements(id);
    console.log(agreement);
  };

  const register = async () => {
    const sign = escrowContract.connect(signer);

    const reg = await sign.register(toAddress, payInterval);
    console.log(reg);
  };

  return (
    <div className="App flex bg-gray-800 h-full">
      <div className="flex flex-col text-white w-3/12 h-full border-r-2">
        <div className="pb-2">
          <label className="pr-2">Address</label>
          <input
            className="rounded text-black"
            type="text"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          />
        </div>
        <div className="pb-2">
          <label className="pr-2">ID</label>
          <input
            className="rounded text-black"
            type="number"
            value={id}
            onChange={(e) => setId(Number(e.target.value))}
          />
          <button className="h-10 w-10" type="button" onClick={idOnClick}>
            Get
          </button>
        </div>
        <div className="pb-2">
          <h2 className="pr-2">Register</h2>
          <label className="pr-2"> To </label>
          <input
            className="rounded text-black"
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <label className="pr-2"> Pay Interval</label>
          <input
            className="rounded text-black"
            type="number"
            value={payInterval}
            onChange={(e) => setPayInterval(Number(e.target.value))}
          />
          <button className="h-10 w-10" type="button" onClick={register}>
            Get
          </button>
        </div>
        <div>
          {allAddresses.map((addy, index) => (
            <p key={index}>{addy}</p>
          ))}
        </div>
      </div>
      <div className="z-10">
        <h1> hello </h1>
      </div>
    </div>
  );
};

export default App;
