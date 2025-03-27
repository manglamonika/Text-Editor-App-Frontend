import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyA8-DduY67PhUQOOVK1KzNc89CJ2KWo84w",
  authDomain: "docs-4f7f4.firebaseapp.com",
  projectId: "docs-4f7f4",
  storageBucket: "docs-4f7f4.appspot.com",
  messagingSenderId: "913491608709",
  appId: "1:913491608709:web:ae1c2ab033e0e147e3d5ec"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };