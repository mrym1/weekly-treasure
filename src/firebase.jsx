// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhl4sxnPLo9wP9d84y21lmvfzVys7TobI",
  authDomain: "weekly-treasure-4c3b5.firebaseapp.com",
  projectId: "weekly-treasure-4c3b5",
  storageBucket: "weekly-treasure-4c3b5.appspot.com",
  messagingSenderId: "93289193618",
  appId: "1:93289193618:web:ec9cd70a179b4d2806064b",
  measurementId: "G-06HEVP68CJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;