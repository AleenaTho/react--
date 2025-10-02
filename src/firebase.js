// src/firebase.js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDcpa8GauMlYLz86Gg_5dLhFpkSGF_hwOQ",
    authDomain: "mannah-2025.firebaseapp.com",
    projectId: "mannah-2025",
    storageBucket: "mannah-2025.appspot.com",
    messagingSenderId: "382843986729",
    appId: "1:382843986729:web:b7eb661293d9912a5d4d38",
    measurementId: "G-C22Y3ERH2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore };
export default app;