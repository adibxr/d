'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getDatabase, ref, get, set, push, remove, child } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyALo9qIYAH0oe5eYBzBSpC_a_GUSanfHMM",
  authDomain: "website-473ae.firebaseapp.com",
  databaseURL: "https://website-473ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "website-473ae",
  storageBucket: "website-473ae.firebasestorage.app",
  messagingSenderId: "727463953378",
  appId: "1:727463953378:web:9864fa5d1611158a9d2fbb",
  measurementId: "G-ZM6E3BECSD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

const ADMIN_UID = "e95GbAquQtbYOQjW0fucGqjFuRi1";

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut, ADMIN_UID };
export { ref, get, set, push, remove, child };
export type { User };
