// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // TAMBAHKAN INI

const firebaseConfig = {
  apiKey: "AIzaSyA9Ej4enGKELDhPmqfZLj9pqh8ptW3ygmQ",
  authDomain: "pendragon-5d408.firebaseapp.com",
  projectId: "pendragon-5d408",
  storageBucket: "pendragon-5d408.firebasestorage.app",
  messagingSenderId: "656604272931",
  appId: "1:656604272931:web:577d4b4c04b5730f0dd496",
  measurementId: "G-VVEQ58K5WG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app); // TAMBAHKAN INI
const googleProvider = new GoogleAuthProvider(); // TAMBAHKAN INI

export { app, db, storage, analytics, auth, googleProvider };