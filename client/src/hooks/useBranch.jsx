import React, { useContext, useState } from "react";

const BranchContext = React.createContext();

export function useBranch() {
  return useContext(BranchContext);
}

export function BranchProvider({ children }) {
  const [currentBranch, setCurrentBranch] = useState("main");

  return (
    <BranchContext.Provider value={{ currentBranch }}>
      {children}
    </BranchContext.Provider>
  );
}
