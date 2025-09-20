
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBg4giVxpT70xXVRnUVj0nlL1jnAH9-L3Y",
  authDomain: "studio-126745911-bad1e.firebaseapp.com",
  projectId: "studio-126745911-bad1e",
  storageBucket: "studio-126745911-bad1e.appspot.com",
  messagingSenderId: "400537452761",
  appId: "1:400537452761:web:fa707a67ba909c31467ec8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
