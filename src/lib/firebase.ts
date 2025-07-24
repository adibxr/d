'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getDatabase, ref, get, set, push, remove, child } from 'firebase/database';


const firebaseConfig = {
  
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

const ADMIN_UID = "";

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut, ADMIN_UID };
export { ref, get, set, push, remove, child };
export type { User };
