import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "kvSkj9a4johP4tOd7RA", // Fake
  authDomain: "great-unknown.firebaseapp.com",
  projectId: "great-unknown",
  storageBucket: "great-unknown.firebasestorage.app",
  messagingSenderId: "199011519338",
  appId: "1:199011519338:web:b460a771ed9e66d9b8f313",
  measurementId: "G-TX3J6RY905",
};

export { getAuth, initializeApp, firebaseConfig, getAnalytics };
