import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAnlbxAMSFsr1zZWSw0fFpl5ARYgEZHD-U",
  authDomain: "restorehealthservices-967ba.firebaseapp.com",
  projectId: "restorehealthservices-967ba",
  storageBucket: "restorehealthservices-967ba.firebasestorage.app",
  messagingSenderId: "1008670831853",
  appId: "1:1008670831853:web:879ee352cf7f8e6daf48e4",
  measurementId: "G-VY7JDFTWMB",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };