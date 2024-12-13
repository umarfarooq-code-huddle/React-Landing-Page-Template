// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVDsX15KMIOUFFR2cQZXHCsHIbOAGfPOM",
  authDomain: "grantyourwishfoundation-88b95.firebaseapp.com",
  projectId: "grantyourwishfoundation-88b95",
  storageBucket: "grantyourwishfoundation-88b95.firebasestorage.app",
  messagingSenderId: "198002427035",
  appId: "1:198002427035:web:bc2fbb5913d20596eeb23e",
  measurementId: "G-VCX938Y8RN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth  = getAuth();
const db = getFirestore(app)

export default app;