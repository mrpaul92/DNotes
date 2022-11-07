import { Alert, Box, Button, Container, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DNotesApi } from "../api";
import { RootState, useAppDispatch } from "../store";
import { userActions } from "../store/slices/userSlice";
import AppbarNormal from "./Layout/AppbarNormal";

const Signup = () => {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const key = useSelector((state: RootState) => state.user.key);

  const addUser = async () => {
    setDisabled(true);
    if (inputRef.current?.value) {
      await DNotesApi.createUser(inputRef.current?.value);
      dispatch(userActions.register({ name: inputRef.current.value, key }));
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
      <AppbarNormal />
      <Container>
        <Box sx={{ m: 1 }} />
        <Alert style={{ display: "flex", justifyContent: "center" }} variant="standard" color="info">
          Enter your name below to proceed with one time signup process.
        </Alert>
        <br />
        <TextField inputRef={inputRef} required label="Enter Your Name" style={{ width: "100%" }} />
        <br />
        <br />
        <Button disabled={disabled} variant="outlined" onClick={addUser}>
          Get Started
        </Button>
      </Container>
    </>
  );
};

export default Signup;
