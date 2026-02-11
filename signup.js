import { signup } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const status = document.getElementById("signupStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value.trim();
    const pw = document.getElementById("pw").value.trim();
    const pwConfirm = document.getElementById("pwConfirm").value.trim();

    if (pw !== pwConfirm) {
      status.textContent = "비밀번호가 일치하지 않습니다.";
      return;
    }

    try {
      await signup(userId, pw);
      status.textContent = "회원가입 성공!";
      window.location.href = "login.html";
    } catch (err) {
      status.textContent = "이미 존재하는 아이디";
      console.error(err);
    }
  });
});
