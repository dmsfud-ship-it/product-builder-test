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

  const run = async () => {
    await inject("#site-footer", "./footer.html");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
