import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔴 TEMPORARY HARDCODE TEST
const firebaseConfig = {
  apiKey: "AIzaSyAnlbxAMSFsr1zZWSw0fFpl5ARYgEZHD-U",
  authDomain: "restorehealthservices-967ba.firebaseapp.com",
  projectId: "restorehealthservices-967ba",
  storageBucket: "restorehealthservices-967ba.firebasestorage.app",
  messagingSenderId: "1008670831853",
  appId: "1:1008670831853:web:879ee352cf7f8e6daf48e4",
  measurementId: "G-VY7JDFTWMB",
};

// Browser mein sirf verification ke liye
if (typeof window !== "undefined") {
  console.log("🔥 Firebase Config Loaded (Direct Strings):", firebaseConfig);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
