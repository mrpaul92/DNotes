import React, { useState } from "react";
import { ethers } from "ethers";
import { useAppDispatch } from "../store";
import { userActions } from "../store/slices/userSlice";
import { User } from "../interfaces";
import { DNotesApi } from "../api";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { Fingerprint } from "@mui/icons-material";
import AppbarNormal from "./Layout/AppbarNormal";

const getEthereumObject = () => (window as any).ethereum;

const Block = () => {
  const dispatch = useAppDispatch();
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean | null>(null);

  const connectHandler = async () => {
    const ethereum = getEthereumObject();
    if (ethereum) {
      const isMetaMask = ethereum.isMetaMask;
      if (isMetaMask) {
        setIsMetaMaskAvailable(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          dispatch(userActions.connect({ key: accounts[0] }));
          getUser();
        }
      } else {
        setIsMetaMaskAvailable(false);
      }
    } else {
      setIsMetaMaskAvailable(false);
    }
  };

  const getUser = async () => {
    let data: User = await DNotesApi.getUser();
    if (data.name !== "") {
      dispatch(userActions.register({ name: data.name, key: data.key }));
    }
  };
  return (
    <>
      <AppbarNormal />
      <Container>
        <Box sx={{ m: 1 }} />
        <Alert style={{ display: "flex", justifyContent: "center" }} variant="standard" color="info">
          DNotes is a decentralised platform to store your personal notes into blockchain. Install the The Metamask Google Chrome extension and create/import your ethereum wallet to get started.
        </Alert>
        <div style={{ margin: "20px auto", textAlign: "center" }}>
          <Button variant="outlined" startIcon={<Fingerprint />} onClick={connectHandler}>
            Connect Metamask
          </Button>
          {isMetaMaskAvailable === false && <Typography color="primary">MetaMask still not found! Refresh the page</Typography>}
        </div>
      </Container>
    </>
  );
};

export default Block;
