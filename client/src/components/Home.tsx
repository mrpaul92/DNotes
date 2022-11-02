import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Home = () => {
  const name = useSelector((state: RootState) => state.user.name);
  const key = useSelector((state: RootState) => state.user.key);
  return (
    <div>
      Welcome!
      <p>
        {name} ({key})
      </p>
    </div>
  );
};

export default Home;
