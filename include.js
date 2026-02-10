(() => {
  const inject = async (selector, url) => {
    const target = document.querySelector(selector);
    if (!target) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      target.innerHTML = await res.text();
      return target;
    } catch (err) {
      console.error(err);
      target.innerHTML = "";
      return null;
    }
  };

  const setActiveMenu = (headerEl) => {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const setActive = (key) => {
      const link = headerEl.querySelector(`[data-nav="${key}"]`);
      if (link) link.classList.add("active");
    };

    if (path === "login.html") {
      setActive("login");
    } else if (path === "signup.html") {
      setActive("signup");
    } else if (path === "admin.html") {
      setActive("admin");
    } else if (path === "" || path === "index.html") {
      const logoLink = headerEl.querySelector(".site-logo");
      if (logoLink) logoLink.classList.add("active");
    }
  };

  const applyLogo = (headerEl) => {
    const img = headerEl.querySelector("#siteLogoImg");
    const text = headerEl.querySelector("#siteLogoText");
    if (!img || !text) return;
    let settings = {};
    try {
      settings = JSON.parse(localStorage.getItem("siteSettings") || "{}");
    } catch (err) {
      console.error(err);
    }
    if (settings.logoImageUrl) {
      img.src = settings.logoImageUrl;
      img.style.display = "block";
      text.style.display = "none";
    } else {
      img.style.display = "none";
      text.style.display = "block";
    }
  };

  const applyAuthState = (headerEl) => {
    let currentUser = null;
    try {
      const raw = localStorage.getItem("currentUser");
      currentUser = raw ? JSON.parse(raw) : null;
      if (currentUser && !currentUser.role) {
        currentUser.role = currentUser.id === "admin" ? "admin" : "user";
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error(err);
    }
    const isLoggedIn = !!currentUser;
    const isAdmin = isLoggedIn && currentUser.role === "admin";
    const guestEls = headerEl.querySelectorAll(".auth-guest");
    const userEls = headerEl.querySelectorAll(".auth-user");
    const adminEls = headerEl.querySelectorAll(".auth-admin");

    guestEls.forEach((el) => el.classList.toggle("is-hidden", isLoggedIn));
    userEls.forEach((el) => el.classList.toggle("is-hidden", !isLoggedIn));
    adminEls.forEach((el) => el.classList.toggle("is-hidden", !isAdmin));

    const logoutLink = headerEl.querySelector("#logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
      });
    }
  };

  const run = async () => {
    const headerEl = await inject("#site-header", "./header.html");
    await inject("#site-footer", "./footer.html");
    if (headerEl) {
      applyAuthState(headerEl);
      setActiveMenu(headerEl);
      applyLogo(headerEl);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
