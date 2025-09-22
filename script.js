document.addEventListener("DOMContentLoaded", () => {
  // Copy crosshair code
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const code = btn.dataset.code || "";
    try {
      await navigator.clipboard.writeText(code);
      btn.classList.add("copied");
      setTimeout(() => btn.classList.remove("copied"), 1200);
    } catch (err) {
      console.error("Не удалось скопировать код:", err);
    }
  });

  // Theme toggle
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    const applyTheme = (t) => {
      root.setAttribute("data-theme", t);
      themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-label", t === "dark" ? "Светлая тема" : "Тёмная тема");
    };
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved ?? (prefersDark ? "dark" : "light"));

    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  // Lightbox
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const lbImg = lb.querySelector(".lightbox__img");
  const lbClose = lb.querySelector(".lightbox__close");

  const open = (src, alt = "") => {
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add("is-open");
  };

  const close = () => lb.classList.remove("is-open");

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".gallery .ph");
    if (!link) return;
    e.preventDefault();
    const img = link.querySelector("img");
    open(link.href, img ? img.alt : "");
  });

  lbClose.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
// --- iOS / iPad zoom-out & auto-fit ---
const ua = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    // Detect iPadOS masquerading as "Mac" on Safari
    (navigator.userAgentData
        ? navigator.userAgentData.platform === "macOS" && navigator.maxTouchPoints > 1
        : ua.includes("Mac") && navigator.maxTouchPoints > 1);


if (isIOS) {
    const vp = document.querySelector('meta[name="viewport"]');

    const updateViewportScale = () => {
        const wrap = document.querySelector(".wrap");
        if (!wrap || !vp) return;

        // Total layout width; your CSS makes the site a fixed wide grid
        const layoutWidth = wrap.scrollWidth || wrap.offsetWidth;
        const vw = window.innerWidth;

        // Scale to fit (but don’t go above 1 or below 0.25)
        let scale = vw / layoutWidth;
        scale = Math.min(1, Math.max(0.25, scale));

        // Use content width so Safari knows the page can be wider than the device
        vp.setAttribute(
            "content",
            `width=${layoutWidth}, initial-scale=${scale}, minimum-scale=0.25, maximum-scale=5, user-scalable=yes, viewport-fit=cover`
        );
    };

    updateViewportScale();
    window.addEventListener("resize", updateViewportScale, { passive: true });
    window.addEventListener("orientationchange", updateViewportScale);
}
