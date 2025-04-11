import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';

const firebaseConfig = {
    apiKey: "AIzaSyAe-SboGPlHsGZZulRdBoFudDmRJ-XDCvw",
    authDomain: "first-project-83c57.firebaseapp.com",
    projectId: "first-project-83c57",
    storageBucket: "first-project-83c57.firebasestorage.app",
    messagingSenderId: "861508216024",
    appId: "1:861508216024:web:864f4b56fa46c8c8dc23ad",
    measurementId: "G-KQZ17CY11Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };