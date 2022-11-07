import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootState, useAppDispatch } from "./store";
import { useSelector } from "react-redux";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Block from "./components/Block";
import { userActions } from "./store/slices/userSlice";
import { DNotesApi } from "./api";
import { User } from "./interfaces";
import { ethers } from "ethers";
import { CircularProgress, Container } from "@mui/material";

const getEthereumObject = () => (window as any).ethereum;
const ethereum = getEthereumObject();

const App = () => {
  const dispatch = useAppDispatch();
  const [ethereumDetected, setEthereumDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isMetaMaskAvailable = useSelector((state: RootState) => state.user.isMetaMaskAvailable);
  const isLogged = useSelector((state: RootState) => state.user.isLogged);

  useEffect(() => {
    if (ethereum) {
      setEthereumDetected(true);

      const isMetaMask = ethereum.isMetaMask;
      // const isConnected = ethereum.isConnected();

      // if (!isMetaMask || !isConnected) return;
      if (!isMetaMask) return;

      const provider = new ethers.providers.Web3Provider(ethereum);
      provider.send("eth_accounts", []).then((accounts) => {
        if (accounts.length > 0) {
          dispatch(userActions.connect({ key: accounts[0] }));
          getUser();
        }
      });
    }
  }, [isLogged]);

  const getUser = async () => {
    let data: User = await DNotesApi.getUser();
    console.log(data);

    if (data.name !== "") {
      dispatch(userActions.register({ name: data.name, key: data.key, role: data.role }));
    }
  };

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {isLoading && (
            <Route
              path="/"
              element={
                <Container style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
                  <CircularProgress color="warning" />
                </Container>
              }
            />
          )}
          {(!ethereumDetected || !isMetaMaskAvailable) && <Route path="/" element={<Block />} />}
          {!isLogged && <Route path="/" element={<Signup />} />}
          {isLogged && <Route path="/" element={<Home />} />}
          <Route path="*" element={<>404</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
