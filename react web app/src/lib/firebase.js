// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDon9OMk1ShmoNqRNgnqmwKTMa1sErtMDw",
  authDomain: "safetyscan-8a191.firebaseapp.com",
  projectId: "safetyscan-8a191",
  storageBucket: "safetyscan-8a191.appspot.com",
  messagingSenderId: "886388596622",
  appId: "1:886388596622:web:d84e4cc6a4236f02f1cedf",
  measurementId: "G-L5TYV490WP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const firestore = getFirestore(app);
export const storageRef = getStorage(app);
export const auth = getAuth(app);