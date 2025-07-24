'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCD5FoayYfZlMeNHph5QCBxVR7FF851R6w",
  authDomain: "article-8a9a1.firebaseapp.com",
  databaseURL: "https://article-8a9a1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "article-8a9a1",
  storageBucket: "article-8a9a1.firebasestorage.app",
  messagingSenderId: "537477655160",
  appId: "1:537477655160:web:6cec627306d71c4cea1b8d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_UID = "e95GbAquQtbYOQjW0fucGqjFuRi1";

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut, ADMIN_UID };
export { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc };
export type { User };
