
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDbjJ7fETNaZRC5DOD56gUZA-JvFsvMm_4",
  authDomain: "peer-learning-project-7c0bb.firebaseapp.com",
  projectId: "peer-learning-project-7c0bb",
  storageBucket: "peer-learning-project-7c0bb.firebasestorage.app",
  messagingSenderId: "890618271563",
  appId: "1:890618271563:web:846d56446df4540da67ace"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);