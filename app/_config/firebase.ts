import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU6qdlrNZe6Ps6QW_D3-IO9RymwoFEe9k",
  authDomain: "biztech-a2ed4.firebaseapp.com",
  projectId: "biztech-a2ed4",
  storageBucket: "biztech-a2ed4.appspot.com",
  messagingSenderId: "434923188649",
  appId: "1:434923188649:android:385975efa00faa70b4d4b8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

