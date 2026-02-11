import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW0f4MDxGsumCR_wEWK1HU6IuP25FCmVU",
  authDomain: "boxit-web.firebaseapp.com",
  projectId: "boxit-web",
  storageBucket: "boxit-web.firebasestorage.app",
  messagingSenderId: "962041292263",
  appId: "1:962041292263:web:b863ce9d3aaee939e00942",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
