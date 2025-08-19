import React from "react";
import Layout from "./Layout";
import { UploadProvider } from "./context/UploadContext";
import { TooltipProvider } from "./components/ui/tooltip";

const App = () => {
  return (
    <UploadProvider>
      <TooltipProvider>
        <Layout />
      </TooltipProvider>
    </UploadProvider>
  );
};

export default App;
