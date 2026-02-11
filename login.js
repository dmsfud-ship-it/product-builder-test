import {
  auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");

  const showStatus = (message, ok) => {
    if (!loginStatus) return;
    loginStatus.textContent = message;
    loginStatus.classList.toggle("ok", !!ok);
    loginStatus.classList.toggle("bad", ok === false);
  };

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId")?.value.trim() || "";
    const email = userId ? `${userId}@boxit.com` : "";
    const password = document.getElementById("pw")?.value.trim() || "";

    if (!userId || !password) {
      showStatus("아이디와 비밀번호를 입력해 주세요.", false);
      return;
    }

    try {
      // persistence는 로그인 전에 1회 설정이 맞음
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("[auth] login success", result.user?.uid);

      showStatus("로그인 성공! 메인으로 이동합니다.", true);

      // ✅ 배포가 서브 경로일 수도 있으니 상대경로가 더 안전한 경우가 많음
      // location.href = "/index.html";
      location.assign("./index.html");
    } catch (err) {
      console.error("[auth] login failed", err);

      const code = err?.code || "unknown";
      const map = {
        "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
        "auth/user-not-found": "존재하지 않는 계정입니다.",
        "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
        "auth/too-many-requests": "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        "auth/network-request-failed": "네트워크 오류입니다. 인터넷 연결을 확인해 주세요.",
      };

      showStatus(map[code] || `로그인 실패 (${code})`, false);
    }
  });
});
