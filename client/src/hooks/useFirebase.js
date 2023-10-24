// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


//  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv7Z0E4Dkj4YO5zNJij3jQ4ocuQlnkaME",
  authDomain: "cashflow-ab32b.firebaseapp.com",
  projectId: "cashflow-ab32b",
  storageBucket: "cashflow-ab32b.appspot.com",
  messagingSenderId: "1050957325016",
  storageBucket: "gs://cashflow-ab32b.appspot.com/",
  appId: "1:1050957325016:web:6297d9930cee0318d1edad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function useFireBase() {
  return app;
}
