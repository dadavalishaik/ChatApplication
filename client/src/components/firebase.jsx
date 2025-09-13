// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"



// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyBMoQRyVckJNaU6MTXIBbSpn1quc7K3gC8",
    authDomain: "chatapp-49465.firebaseapp.com",
    projectId: "chatapp-49465",
    storageBucket: "chatapp-49465.firebasestorage.app",
    messagingSenderId: "367407981794",
    appId: "1:367407981794:web:90df6f19c1d6744d2aeabb",
    measurementId: "G-L1LZGEH3JY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);