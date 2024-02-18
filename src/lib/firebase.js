// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpoeI7Aj_ahDIFmur-jpUt4gxwYK_7eJY",
  authDomain: "personaai-d7d1a.firebaseapp.com",
  projectId: "personaai-d7d1a",
  storageBucket: "personaai-d7d1a.appspot.com",
  messagingSenderId: "378383061925",
  appId: "1:378383061925:web:a05d9175097d9102f9ce4c",
  measurementId: "G-M42ND0YCFL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const firestore = getFirestore(app);
export const storageRef = getStorage(app);
export const auth = getAuth(app);