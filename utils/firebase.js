import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLH3uqd_8q_dn3YK8RDMnoLQRKTlpw1NU",
  authDomain: "library-management-syste-a3368.firebaseapp.com",
  projectId: "library-management-syste-a3368",
  storageBucket: "library-management-syste-a3368.firebasestorage.app",
  messagingSenderId: "1007248350615",
  appId: "1:1007248350615:web:5b8ed0db15dd356111f8d2",
  measurementId: "G-4VPB3N9DG3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);