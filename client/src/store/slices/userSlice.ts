import { createSlice } from "@reduxjs/toolkit";
import { Note } from "../../interfaces";

const userSlice = createSlice({
  name: "user",
  initialState: { name: "", key: "", isLogged: false, isMetaMaskAvailable: false, notes: [] },
  reducers: {
    register: (state, action) => {
      state.name = action.payload.name;
      state.key = action.payload.key;
      state.isLogged = true;
      state.isMetaMaskAvailable = true;
    },
    connect: (state, action) => {
      state.key = action.payload.key;
      state.isMetaMaskAvailable = true;
    },
    setNotes: (state, action) => {
      state.notes = action.payload.notes.filter((item: Note) => item.status === true);
    },
  },
});
export default userSlice;
export const userActions = userSlice.actions;
