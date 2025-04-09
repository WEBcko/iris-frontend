import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqY21qInH0c2VqO02lsuNtoJa2pQAfQ5s",
  authDomain: "chat-318a3.firebaseapp.com",
  projectId: "chat-318a3",
  storageBucket: "chat-318a3.firebasestorage.app",
  messagingSenderId: "981110148055",
  appId: "1:981110148055:web:e8c04c080367cf75de1992",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();

export default app;
