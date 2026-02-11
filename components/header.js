import { auth, onAuthStateChanged, signOut } from "/firebase.js";

const setActiveNav = () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const map = {
    "products.html": "products",
    "boxes.html": "boxes",
    "bulk.html": "bulk",
    "custom.html": "custom",
    "sale.html": "sale",
  };
  const key = map[path];
  if (!key) return;
  const links = document.querySelectorAll(`.bx-hd__navLink[data-nav='${key}']`);
  links.forEach((link) => link.classList.add("active"));
};

const bindAuthState = () => {
  const guestEls = document.querySelectorAll("[data-auth='guest']");
  const userEls = document.querySelectorAll("[data-auth='user']");
  const logoutBtn = document.getElementById("headerLogoutBtn");

  onAuthStateChanged(auth, (user) => {
    const loggedIn = !!user;
    console.log("[auth] state", loggedIn ? "IN" : "OUT", user?.uid);
    guestEls.forEach((el) => el.classList.toggle("bx-hd__hidden", loggedIn));
    userEls.forEach((el) => el.classList.toggle("bx-hd__hidden", !loggedIn));
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "/index.html";
      } catch (err) {
        console.error("[header] signOut failed", err);
      }
    });
  }
};

const ensureHeaderRoot = () => {
  let target = document.getElementById("site-header");
  if (target) return target;
  target = document.createElement("div");
  target.id = "site-header";
  document.body.prepend(target);
  return target;
};

const initHeader = async () => {
  const target = ensureHeaderRoot();
  if (!target.querySelector(".bx-hd-skeleton")) {
    target.innerHTML = '<div class="bx-hd-skeleton"></div>';
  }
  if (target.querySelector(".bx-hd")) return;

  try {
    const url = "/components/header.html";
    console.log("[header] fetching", url);
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      console.error("[header] inject failed", res.status, url);
      const debug = document.createElement("span");
      debug.textContent = "HEADER LOAD FAILED";
      debug.style.display = "none";
      target.appendChild(debug);
      return;
    }
    target.innerHTML = await res.text();
    setActiveNav();
    bindAuthState();
    const img = document.querySelector(".bx-hd__logo img");
    const cssLoaded = [...document.styleSheets].some((sheet) =>
      String(sheet.href).includes("/components/header.css")
    );
    console.log("[header] injected ok, bx-hd=", document.querySelectorAll(".bx-hd").length);
    console.log("[header] logo src=", img?.getAttribute("src"));
    console.log("[header] header.css loaded=", cssLoaded);
  } catch (err) {
    console.error("[header] inject failed", err);
    const debug = document.createElement("span");
    debug.textContent = "HEADER LOAD FAILED";
    debug.style.display = "none";
    target.appendChild(debug);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeader);
} else {
  initHeader();
}
