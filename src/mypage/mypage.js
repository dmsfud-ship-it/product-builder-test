import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
} from "../../firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const usernameDisplay = document.getElementById("usernameDisplay");
  const nameDisplay = document.getElementById("nameDisplay");
  const emailDisplay = document.getElementById("emailDisplay");
  const phoneDisplay = document.getElementById("phoneDisplay");
  const logoutBtn = document.getElementById("mypageLogout");

  const redirectToLogin = () => {
    window.location.href = "login.html";
  };

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    const uid = user.uid;
    console.log("[mypage] uid:", uid);

    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) {
        console.log("[mypage] user doc not found");
        return;
      }

      const data = snap.data();
      console.log("[mypage] data:", data);

      if (usernameDisplay) usernameDisplay.textContent = data.username || "";
      if (nameDisplay) nameDisplay.textContent = data.name || "";
      if (emailDisplay) emailDisplay.textContent = data.email || "";
      if (phoneDisplay) phoneDisplay.textContent = data.phone || "";
    } catch (err) {
      console.error("[mypage] failed to load user data", err);
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } finally {
        redirectToLogin();
      }
    });
  }
});
