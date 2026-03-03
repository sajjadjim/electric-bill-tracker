import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpf6MCHytLr-d8lmdoqSivqXbILa9ZXp8",
  authDomain: "electricbill-management.firebaseapp.com",
  projectId: "electricbill-management",
  storageBucket: "electricbill-management.firebasestorage.app",
  messagingSenderId: "140712868770",
  appId: "1:140712868770:web:5e7f604f85d9fcb1cd90fb"
};



// Initialize Firebase (prevents multiple instances)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };