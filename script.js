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
// --- iPad-only zoom-out & safe auto-fit ---
const vp = document.querySelector('meta[name="viewport"]');

const setDefaultViewport = () => {
    if (!vp) return;
    vp.setAttribute(
        "content",
        "width=device-width, initial-scale=1, user-scalable=yes, minimum-scale=0.25, maximum-scale=5, viewport-fit=cover"
    );
};

// Heuristics
const ua = navigator.userAgent;
const isWebView = /Telegram|Instagram|FBAN|FBAV|Line|MiuiBrowser/i.test(ua);

// Apple touch (no deprecated props)
const isAppleTouch =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.userAgentData
        ? navigator.userAgentData.platform === "macOS" && navigator.maxTouchPoints > 1
        : ua.includes("Mac") && navigator.maxTouchPoints > 1);

// Tablet threshold (portrait iPad = 768 CSS px)
const isTabletSized = Math.min(window.innerWidth, window.innerHeight) >= 768;

// iPad only
const isIPad = isAppleTouch && isTabletSized && !/iPhone/i.test(ua) && !isWebView;

// Always start from clean default
setDefaultViewport();

function updateViewportForIPad() {
    if (!vp) return;

    if (!isIPad) {
        // phones / webviews / desktops: keep default
        setDefaultViewport();
        return;
    }

    const wrap = document.querySelector(".wrap");
    if (!wrap) return;

    const layoutWidth = wrap.scrollWidth || wrap.offsetWidth;
    const vw = window.innerWidth;

    // Only shrink when layout is wider than viewport; never zoom-in
    if (layoutWidth > vw + 1) {
        let scale = vw / layoutWidth;
        // clamp: never above 1 (no zoom-in), allow down to 0.25
        scale = Math.max(0.25, Math.min(1, scale));

        // Set a narrow width only for iPad to allow out-zoom
        vp.setAttribute(
            "content",
            `width=${layoutWidth}, initial-scale=${scale}, minimum-scale=0.25, maximum-scale=5, user-scalable=yes, viewport-fit=cover`
        );
    } else {
        // Layout already fits — use default
        setDefaultViewport();
    }
}

// Run and keep it in sync
updateViewportForIPad();
window.addEventListener("resize", updateViewportForIPad, { passive: true });
window.addEventListener("orientationchange", updateViewportForIPad);
// iOS bfcache restore
window.addEventListener("pageshow", () => {
    setDefaultViewport();
    // tiny delay so layout metrics are correct before we recalc
    setTimeout(updateViewportForIPad, 0);
});
