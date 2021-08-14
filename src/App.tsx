import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "./config.ts";

const App = () => {
  const [address, setAddress] = useState("");
  const [id, setId] = useState(0);

  const provider = new ethers.providers.JsonRpcProvider();
  const escrowContract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi,
    provider
  );

  useEffect(() => {
    getAddress();
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAddress = async (): Promise<void> => {
    const acc = await provider.listAccounts();
    console.log(acc);
    setAddress(acc[0]);
  };

  const idOnClick = () => {
    console.log(id);
  };

  return (
    <div className="App bg-gray-800 h-full">
      <div className="flex flex-col text-white w-3/12 h-full border-r-2">
        <div className="pb-2">
          <label className="pr-2">Address</label>
          <input className="rounded" type="text" />
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
      </div>
    </div>
  );
};

export default App;
