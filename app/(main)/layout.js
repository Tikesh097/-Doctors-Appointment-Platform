import React from "react";
import { Toaster } from "sonner";

const Mainlayout = ({ children }) => {
  return (
    <div className="container mx-auto my-20">
      {children}

      <Toaster
        richColors
        position="top-right"
      />
    </div>
  );
};

export default Mainlayout;