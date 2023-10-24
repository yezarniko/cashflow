import React, { useContext, useState } from "react";

const CashListContext = React.createContext();

export function useCashList() {
  return useContext(CashListContext);
}

export function CashListContextProvider({ children }) {
  const [cashList, setCashList] = useState([]);
  return (
    <CashListContext.Provider value={{ cashList, setCashList }}>
      {children}
    </CashListContext.Provider>
  );
}
