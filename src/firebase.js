import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDTJhPHB8ZtFQ3BswYh3lWSft28IrDOAJI",
  authDomain: "subsync-01.firebaseapp.com",
  projectId: "subsync-01",
  storageBucket: "subsync-01.appspot.com",
  messagingSenderId: "774920679039",
  appId: "1:774920679039:web:c0d5995270407beba6194a",
  measurementId: "G-6MG9Z4H21T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc, messaging };