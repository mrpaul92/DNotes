import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userSlice from "./slices/userSlice";

const store = configureStore({
  devTools: true,
  reducer: {
    user: userSlice.reducer,
  },
});

// important state types handle
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

// return the global store
export default store;
