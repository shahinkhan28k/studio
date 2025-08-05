
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCh3OwU5XxzJfKuGrhcf0xf_7Tg5D3ja3g",
  authDomain: "onearn-platform.firebaseapp.com",
  databaseURL: "https://onearn-platform-default-rtdb.firebaseio.com",
  projectId: "onearn-platform",
  storageBucket: "onearn-platform.firebasestorage.app",
  messagingSenderId: "350477123762",
  appId: "1:350477123762:web:09b7987cf92882d04d09ab"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
