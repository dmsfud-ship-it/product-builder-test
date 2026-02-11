import { auth, signOut } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const data = {
    name: "박은령",
    pointsAmount: 0,
    couponCount: 2,
    totalOrderAmount: 0,
    totalOrderCount: 0,
    orderStatusCounts: {
      beforePay: 0,
      preparing: 0,
      shipping: 0,
      delivered: 0,
    },
    csCounts: {
      cancel: 0,
      exchange: 0,
      return: 0,
    },
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("nameDisplay", data.name);
  setText("pointsAmount", `${data.pointsAmount}원`);
  setText("couponCount", `${data.couponCount}개`);
  setText("totalOrder", `${data.totalOrderAmount}원(${data.totalOrderCount}회)`);
  setText("beforePay", data.orderStatusCounts.beforePay);
  setText("preparing", data.orderStatusCounts.preparing);
  setText("shipping", data.orderStatusCounts.shipping);
  setText("delivered", data.orderStatusCounts.delivered);
  setText("cancel", data.csCounts.cancel);
  setText("exchange", data.csCounts.exchange);
  setText("return", data.csCounts.return);

  const menu = document.getElementById("sidebarMenu");
  if (menu) {
    menu.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-item");
      if (!btn) return;

      const menuKey = btn.dataset.menu;
      menu.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.toggle("active", item === btn);
      });

      if (menuKey === "logout") {
        return;
      }

      console.log("[mypage] menu click:", menuKey);
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("[mypage] signOut failed", err);
      }
    });
  }
});
