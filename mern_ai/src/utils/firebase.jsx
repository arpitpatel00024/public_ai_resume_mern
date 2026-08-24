import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzIe_xJ-v3QUn_JRfvi-PiUP-332q-_wU",
  authDomain: "mernai-bfdf8.firebaseapp.com",
  projectId: "mernai-bfdf8",
  storageBucket: "mernai-bfdf8.firebasestorage.app",
  messagingSenderId: "648071416630",
  appId: "1:648071416630:web:7e60dea95a82196727c197",
  measurementId: "G-8VYR3V4T91"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };