import {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  serverTimestamp,
} from "./firebase.js";

const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const notice = document.getElementById("signupNotice");

const getValue = (id) => {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
};

const showNotice = (message, isError = false) => {
  if (!notice) return;
  notice.textContent = message;
  notice.style.display = "block";
  notice.classList.toggle("error", isError);
  notice.classList.toggle("success", !isError);
};

const handleSignup = async (e) => {
  e.preventDefault();

  const phone = getValue("phone");
  const username = getValue("username");
  const name = getValue("name");
  const email = username ? `${username}@boxit.com` : "";
  const password = getValue("password");
  const passwordConfirm = getValue("passwordConfirm");

  if (!phone || !username || !name || !email || !password || !passwordConfirm) {
    showNotice("필수 항목을 모두 입력해 주세요.", true);
    return;
  }

  if (password !== passwordConfirm) {
    showNotice("비밀번호가 일치하지 않습니다.", true);
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = result;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      username,
      name,
      phone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    showNotice("회원가입이 완료되었습니다.", false);
    if (signupForm) signupForm.reset();
  } catch (err) {
    console.error(err);
    const message = err?.message || "회원가입에 실패했습니다.";
    showNotice(message, true);
  }
};

if (signupBtn) {
  signupBtn.addEventListener("click", handleSignup);
}

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}
