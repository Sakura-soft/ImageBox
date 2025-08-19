import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Link to={"/user/home"}>
        <Button>Enter</Button>
      </Link>
    </div>
  );
};

export default Home;
