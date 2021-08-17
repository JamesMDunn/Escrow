import React, { useEffect, useState } from "react";
import { BigNumber, BigNumberish, Contract, ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface Register {
  escrowId: BigNumberish;
  depositer: string;
  withdrawer: string;
}

interface Agreement extends Register {
  value: BigNumberish;
  payBlockInterval: BigNumberish;
  payRate: BigNumberish;
  lastActivityBlock: BigNumberish;
  expiredLock: BigNumberish;
  isExpired: boolean;
  paidOut: BigNumberish;
}

const App = () => {
  const [allAddresses, setAllAddresses] = useState<String[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [id, setId] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [payInterval, setPayInterval] = useState(0);
  const [lastRegister, setLastRegister] = useState<Register>({} as Register);
  const [currentAgreement, setCurrentAgreement] = useState<Agreement>(
    {} as Agreement
  );
  const [value, setValue] = useState("");

  useEffect(() => {
    // getAddresses();
    connectContract();
    return () => {
      // escrowContract.removeAllListeners();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const requestAccount = async () => {
    //@ts-ignore
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };
  const getProvider = () => {
    //@ts-ignore
    if (typeof window.ethereum !== "undefined") {
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return provider;
    }
  };

  const connectContract = () => {
    const provider = getProvider();
    let contract = new ethers.Contract(contractAddress, Escrow.abi, provider);
    console.log("connected", contract);
    console.log({ provider });
    contract.on("Registered", (escrowId, depositer, withdrawer) => {
      console.log(
        "event sent contract",
        typeof escrowId.toString(),
        depositer,
        withdrawer
      );
      setLastRegister({ escrowId, depositer, withdrawer });
    });
  };

  // const getAddresses = async (): Promise<void> => {
  //   const accs = await provider.listAccounts();
  //   setAllAddresses(accs);
  // };

  const idOnClick = async () => {
    const contract = new ethers.Contract(
      contractAddress,
      Escrow.abi,
      getProvider()
    );
    console.log("got here", contract);
    let data = await contract.agreements(id);
    let agreement: Agreement = {
      escrowId: id,
      depositer: data[0],
      withdrawer: data[1],
      value: data[2],
      payBlockInterval: data[3],
      payRate: data[4],
      lastActivityBlock: data[5],
      expiredLock: data[6],
      isExpired: data[7],
      paidOut: data[8],
    };
    console.log(agreement);
    setCurrentAgreement(agreement);
  };

  const register = async () => {
    await requestAccount();
    const provider = getProvider();
    const signer = provider?.getSigner();
    const contract = new ethers.Contract(contractAddress, Escrow.abi, signer);
    console.log(ethers.utils.parseUnits(value));
    const transaction = await contract.register(toAddress, payInterval, {
      value: ethers.utils.parseUnits(value),
    });
    await transaction.wait();
  };

  const readAgreementData = () => {
    let data = [];
    for (let key in currentAgreement) {
      let val = currentAgreement[key as keyof Agreement].toString();
      if (key === "value" || key === "payRate") {
        val = ethers.utils.formatUnits(val);
      }
      data.push(
        <p key={key}>
          {key}: {val}
        </p>
      );
    }
    return data;
  };

  const withdrawFromAgreement = async () => {
    // const sign = escrowContract.connect(signer);
    // try {
    //   await sign.withdraw(id);
    // } catch (err) {
    //   console.log(err.error);
    // }
  };

  return (
    <div className="App flex bg-gray-800 h-full">
      <div className="flex flex-col text-white w-1/3 h-full border-r-2 overflow-scroll p-3">
        <div className="pb-2">
          <label className="pr-2">Value</label>
          <input
            className="rounded text-black"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
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
          <div className="pb-2">
            <label className="pr-2"> To </label>
            <input
              className="rounded text-black"
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
          </div>
          <div className="pb-2">
            <label className="pr-2">Pay Interval</label>
            <input
              className="rounded text-black"
              type="number"
              value={payInterval}
              onChange={(e) => setPayInterval(Number(e.target.value))}
            />
            <button className="h-10 w-10" type="button" onClick={register}>
              Create
            </button>
          </div>
        </div>
        <div className="pb-2">
          <button
            className="h-10 w-10"
            type="button"
            onClick={withdrawFromAgreement}
          >
            Withdraw
          </button>
        </div>
        <div>
          {allAddresses.map((addy, index) => (
            <p key={index}>{addy}</p>
          ))}
        </div>
      </div>
      <div className="flex items-center w-full flex-col text-white">
        <div>
          <h1> Last Register </h1>
          <p> ID: {lastRegister?.escrowId?.toString()}</p>
          <p> Depositer: {lastRegister?.depositer} </p>
          <p> Withdrawer: {lastRegister?.withdrawer} </p>
        </div>
        <div>
          <h1> Current Agreement </h1>
          {currentAgreement?.depositer && readAgreementData()}
        </div>
      </div>
    </div>
  );
};

export default App;
