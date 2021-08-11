import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const App = () => {
  const [address, setAddress] = useState("");

  const provider = new ethers.providers.JsonRpcProvider();

  useEffect(() => {
    getAddress();
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAddress = async (): Promise<void> => {
    const acc = await provider.listAccounts();
    console.log(acc);
    setAddress(acc[0]);
  };

  return (
    <div className="App">
      <h1>test</h1>
      <p>{address} </p>
    </div>
  );
};

export default App;
