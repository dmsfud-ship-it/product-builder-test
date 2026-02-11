import { login } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[login] loaded");

  const form = document.getElementById("loginForm");
  const status = document.getElementById("loginStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value.trim();
    const pw = document.getElementById("pw").value.trim();

    try {
      await login(userId, pw);
      status.textContent = "로그인 성공!";
      window.location.href = "index.html";
    } catch (err) {
      status.textContent = "로그인 실패";
      console.error(err);
    }
  });
});
