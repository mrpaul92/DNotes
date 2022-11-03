import React from "react";
import { ethers } from "ethers";
import { useAppDispatch } from "../store";
import { userActions } from "../store/slices/userSlice";
import { User } from "../interfaces";
import { DNotesApi } from "../api";
import { Alert, Button, Container } from "@mui/material";
import { Fingerprint } from "@mui/icons-material";

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
    if (data.name !== "") {
      dispatch(userActions.register({ name: data.name, key: data.key }));
    }
  };
  return (
    <Container>
      <Alert style={{ display: "flex", justifyContent: "center" }} variant="standard" color="info">
        Please connect with MetaMask!
      </Alert>
      <div style={{ margin: "20px auto", textAlign: "center" }}>
        <Button variant="outlined" startIcon={<Fingerprint />} onClick={connectHandler}>
          Connect Metamask
        </Button>
      </div>
    </Container>
  );
};

export default Block;
