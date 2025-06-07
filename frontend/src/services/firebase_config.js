import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaQEm0SKwqFsKW12uoS8rLD0g6W3-YJ0I",
  authDomain: "e-coletaslz.firebaseapp.com",
  projectId: "e-coletaslz",
  storageBucket: "e-coletaslz.firebasestorage.app",
  messagingSenderId: "469942108881",
  appId: "1:469942108881:web:7af476d354bfb3545c7bf0",
  measurementId: "G-G4C85DX838",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
