// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg63gguZ_JB9pQg57F2qUJOgUGjuE9594",
  authDomain: "color-quest-memory-roll.firebaseapp.com",
  projectId: "color-quest-memory-roll",
  storageBucket: "color-quest-memory-roll.firebasestorage.app",
  messagingSenderId: "659969642335",
  appId: "1:659969642335:web:d5edd3a17c1652803870ea",
  databaseURL: "https://color-quest-memory-roll-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
