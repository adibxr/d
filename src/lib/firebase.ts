'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getDatabase, ref, get, set, push, remove, child, onValue, off } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyDfEcRsBbTFXLVJTTq3RXlyNocoB5SJFS8",
  authDomain: "website-62637.firebaseapp.com",
  databaseURL: "https://website-62637-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "website-62637",
  storageBucket: "website-62637.firebasestorage.app",
  messagingSenderId: "699881734453",
  appId: "1:699881734453:web:d793e55ef1c082572e4c7c"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

const ADMIN_UID = "CAt8VbqwdShjzaty2NJFAxZuwkB2";

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut, ADMIN_UID };
export { ref, get, set, push, remove, child, onValue, off };
export type { User };
