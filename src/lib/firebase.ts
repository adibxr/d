'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

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
const provider = new GoogleAuthProvider();

const ADMIN_UID = "e95GbAquQtbYOQjW0fucGqjFuRi1";

export { auth, provider, onAuthStateChanged, signInWithPopup, signOut, ADMIN_UID };
export type { User };
