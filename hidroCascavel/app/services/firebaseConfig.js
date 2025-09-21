// services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFrQLT0Sn_N3zdLFVGmRDa1c7DF2uHR9Q",
  authDomain: "hidrocascavel-fcccf.firebaseapp.com",
  projectId: "hidrocascavel-fcccf",
  storageBucket: "hidrocascavel-fcccf.firebasestorage.app",
  messagingSenderId: "83041242189",
  appId: "1:83041242189:web:2371745589a7140c772004",
  measurementId: "G-QFDWQGCTXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;