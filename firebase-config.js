// ============================================================
// FIREBASE CONFIGURATION
// Replace the values below with your Firebase project config.
// Get them from: Firebase Console → Project Settings → General
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

 const firebaseConfig = {
    apiKey: "AIzaSyDxNtqP_tYD5X7sk2kryf9S4dEX-8RfKKE",
    authDomain: "couri-674bd.firebaseapp.com",
    projectId: "couri-674bd",
    storageBucket: "couri-674bd.firebasestorage.app",
    messagingSenderId: "127783621682",
    appId: "1:127783621682:web:049f444a85484eadf5d82b",
    measurementId: "G-KWM9DVBH0C"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ============================================================
// ADMIN CONFIGURATION
// Set the Firebase UID of the admin user here.
// After your first login, find UID in Firebase Console → Authentication
// ============================================================
export const ADMIN_UID = "YOUR_ADMIN_UID_HERE";
