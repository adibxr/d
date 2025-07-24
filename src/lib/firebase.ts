'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getDatabase, ref, get, set, push, remove, child } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyCD5FoayYfZlMeNHph5QCBxVR7FF851R6w",
  authDomain: "article-8a9a1.firebaseapp.com",
  databaseURL: "https://website-473ae-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "article-8a9a1",
  storageBucket: "article-8a9a1.firebasestorage.app",
  messagingSenderId: "537477655160",
  appId: "1:537477655160:web:6cec627306d71c4cea1b8d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

const ADMIN_UID = "e95GbAquQtbYOQjW0fucGqjFuRi1";

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut, ADMIN_UID };
export { ref, get, set, push, remove, child };
export type { User };
