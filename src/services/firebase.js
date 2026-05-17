// src/services/firebase.js
import { initializeApp } from "firebase/app";
// Import the specific SDKs your app needs for Auth and Database
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your friend's unique web app configuration keys
const firebaseConfig = {
  apiKey: "AIzaSyDbjJ7fETNaZRC5DOD56gUZA-JvFsvMm_4",
  authDomain: "peer-learning-project-7c0bb.firebaseapp.com",
  projectId: "peer-learning-project-7c0bb",
  storageBucket: "peer-learning-project-7c0bb.firebasestorage.app",
  messagingSenderId: "890618271563",
  appId: "1:890618271563:web:846d56446df4540da67ace"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export instances exactly how the project expects them
export const auth = getAuth(app);
export const db = getFirestore(app);