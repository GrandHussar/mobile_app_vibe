import { initializeApp } from "firebase/app";
import { initializeAuth, indexedDBLocalPersistence } from "firebase/auth"; // Use `indexedDBLocalPersistence` as an alternative
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";


// Your Firebase configuration
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

// Initialize Firebase Auth with indexedDBLocalPersistence
const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});

const firestore = getFirestore(app);

export { auth, firestore };
export default app;
