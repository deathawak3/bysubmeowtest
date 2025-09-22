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
// --- iPad-only zoom-out & auto-fit (force phones to normal) ---
const vp = document.querySelector('meta[name="viewport"]');

// Always define a clean default viewport for non-iPad
const setDefaultViewport = () => {
    if (!vp) return;
    vp.setAttribute(
        "content",
        "width=device-width, initial-scale=1, user-scalable=yes, minimum-scale=0.25, maximum-scale=5, viewport-fit=cover"
    );
};

// Heuristic: detect iPad (including iPadOS that pretends to be Mac)
const ua = navigator.userAgent;
const isAppleTouch =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.userAgentData
        ? navigator.userAgentData.platform === "macOS" && navigator.maxTouchPoints > 1
        : ua.includes("Mac") && navigator.maxTouchPoints > 1);

// Use CSS pixel width; treat >= 768 as tablet
const isTabletSized = Math.min(window.innerWidth, window.innerHeight) >= 768;

// Telegram/other webviews sometimes misreport; if it says Telegram, be strict
const isTelegram = /Telegram/i.test(ua);

// Final iPad decision
const isIPad = isAppleTouch && isTabletSized && !/iPhone/i.test(ua);

// Always start from a safe default
setDefaultViewport();

function updateViewportForIPad() {
    if (!vp) return;

    if (isIPad && !isTelegram) {
        const wrap = document.querySelector(".wrap");
        if (!wrap) return;

        const layoutWidth = wrap.scrollWidth || wrap.offsetWidth;
        const vw = window.innerWidth;

        // Only shrink when layout is wider than the viewport
        if (layoutWidth > vw + 1) {
            let scale = vw / layoutWidth;
            scale = Math.min(1, Math.max(0.25, scale));

            vp.setAttribute(
                "content",
                `width=${layoutWidth}, initial-scale=${scale}, minimum-scale=0.25, maximum-scale=5, user-scalable=yes, viewport-fit=cover`
            );
        } else {
            setDefaultViewport();
        }
    } else {
        // Phones or webviews → force normal scale
        setDefaultViewport();
    }
}

updateViewportForIPad();
window.addEventListener("resize", updateViewportForIPad, { passive: true });
window.addEventListener("orientationchange", updateViewportForIPad);
// iOS back/forward cache restore
window.addEventListener("pageshow", updateViewportForIPad);
