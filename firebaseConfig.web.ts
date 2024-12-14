import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {

    apiKey: "AIzaSyDbJ1Cr1FZ7qphsLpAA1uPSIobyFmEsGoQ",
  
    authDomain: "fir-v-dcf1c.firebaseapp.com",
  
    projectId: "fir-v-dcf1c",
  
    storageBucket: "fir-v-dcf1c.firebasestorage.app",
  
    messagingSenderId: "1070299525958",
  
    appId: "1:1070299525958:web:1ebcfa7884c278b976eb47",
  
    measurementId: "G-8S0095EVXD"
  
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;
