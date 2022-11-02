import React from "react";
import { ethers } from "ethers";
import { useAppDispatch } from "../store";
import { userActions } from "../store/slices/userSlice";
import { User } from "../interfaces";
import { DNotesApi } from "../api";

const getEthereumObject = () => (window as any).ethereum;
const ethereum = getEthereumObject();

const Block = () => {
  const dispatch = useAppDispatch();
  const connectHandler = async () => {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        dispatch(userActions.connect({ key: accounts[0] }));
        getUser();
      }
    }
  };

  const getUser = async () => {
    let data: User = await DNotesApi.getUser();
    if (data.name != "") {
      dispatch(userActions.register({ name: data.name, key: data.key }));
    }
  };
  return (
    <div>
      <p>Please install Metamask & Connect!</p>
      <button onClick={connectHandler}>Connect Metamask</button>
    </div>
  );
};

export default Block;
