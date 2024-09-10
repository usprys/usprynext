import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from "firebase/auth";
import { createContext, useContext } from "react";
import { getDatabase, set, ref } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const firbaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
const database = getDatabase(firebaseApp);
const FirbaseContext = createContext(null);
export const useFirebase = () => useContext(FirbaseContext);
export const FirebaseProvider = (props) => {
  const signupUserWithEmailAndPass = (email, password) => {
    return createUserWithEmailAndPassword(firbaseAuth, email, password);
  };

  const putData = (key, data) => {
    set(ref(database, key), data);
  };

  const deleteData = (email) => {
    return deleteUser(email);
  };
  return (
    <FirbaseContext.Provider
      value={{ signupUserWithEmailAndPass, putData, deleteData }}
    >
      {props.children}
    </FirbaseContext.Provider>
  );
};
