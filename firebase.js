import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW0f4MdxGsumCR_wEWKlHU6IuP25FCmVU",
  authDomain: "boxit-web.firebaseapp.com",
  projectId: "boxit-web",
  storageBucket: "boxit-web.firebasestorage.app",
  messagingSenderId: "962041292263",
  appId: "1:962041292263:web:b863ce9d3aaee939e00942",
  measurementId: "G-YX17N1PMP4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
  await setPersistence(auth, browserLocalPersistence);
} catch (err) {
  console.error("[auth] persistence failed", err);
}

export {
  auth,
  db,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
};
