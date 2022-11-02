import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { DNotesApi } from "../api";
import { RootState, useAppDispatch } from "../store";
import { userActions } from "../store/slices/userSlice";

const Signup = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const key = useSelector((state: RootState) => state.user.key);

  const addUser = async () => {
    if (inputRef.current?.value) {
      await DNotesApi.createUser(inputRef.current?.value);
      dispatch(userActions.register({ name: inputRef.current.value, key }));
    }
  };

  return (
    <div>
      <input ref={inputRef} />
      <button type="button" onClick={addUser}>
        SignUp
      </button>
    </div>
  );
};

export default Signup;
