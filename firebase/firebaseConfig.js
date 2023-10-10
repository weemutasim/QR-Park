import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5j-J0KwV08SC4PtXfKJqsSunu_KZyHl4",
  authDomain: "car-parking-qr-45c2a.firebaseapp.com",
  databaseURL: "https://car-parking-qr-45c2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "car-parking-qr-45c2a",
  storageBucket: "car-parking-qr-45c2a.appspot.com",
  messagingSenderId: "571279812972",
  appId: "1:571279812972:web:07309e57f219a976172b49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export {auth, db}