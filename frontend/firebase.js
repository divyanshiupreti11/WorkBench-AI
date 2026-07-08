// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
authDomain: "workbenchai-5ad85.firebaseapp.com",
  projectId: "workbenchai-5ad85",
  storageBucket: "workbenchai-5ad85.firebasestorage.app",
  messagingSenderId: "946350473513",
  appId: "1:946350473513:web:4fb0c232ffc71c6d3df738"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const googleProvider =
  new GoogleAuthProvider();

export const githubProvider =
  new GithubAuthProvider();