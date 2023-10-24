import React, { useContext, useState } from "react";
import useFireBase from "./useFirebase";
import { getStorage,  } from "firebase/storage";

const FirebaseStorageContext = React.createContext(null);

export function FirebaseStorageProvider({ children }) {
  const app = useFireBase();
  const storage = getStorage(app);

  return (
    <FirebaseStorageContext.Provider value={{ storage }}>
      {children}
    </FirebaseStorageContext.Provider>
  );
}

export function useFireBaseStorage() {
  return useContext(FirebaseStorageContext);
}
