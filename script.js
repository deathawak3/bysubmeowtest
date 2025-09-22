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
// --- iPad-only zoom-out & auto-fit ---
const ua = navigator.userAgent;

// Apple touch device (no deprecated props)
const isAppleTouch =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.userAgentData
        ? navigator.userAgentData.platform === "macOS" && navigator.maxTouchPoints > 1
        : ua.includes("Mac") && navigator.maxTouchPoints > 1);

// Tablet-ish size threshold (portrait width of iPad is 768 CSS px)
const isTabletSized = Math.min(window.screen.width, window.screen.height) >= 768;

// Final: treat as iPad/tablet only (not iPhone)
const isIPad = isAppleTouch && isTabletSized;

if (isIPad) {
    const vp = document.querySelector('meta[name="viewport"]');

    const updateViewportScale = () => {
        const wrap = document.querySelector(".wrap");
        if (!wrap || !vp) return;

        // Real layout width vs device viewport width
        const layoutWidth = wrap.scrollWidth || wrap.offsetWidth;
        const vw = window.innerWidth;

        // Only shrink if the layout is actually wider than the device
        if (layoutWidth > vw + 1) {
            let scale = vw / layoutWidth;
            scale = Math.min(1, Math.max(0.25, scale));

            vp.setAttribute(
                "content",
                `width=${layoutWidth}, initial-scale=${scale}, minimum-scale=0.25, maximum-scale=5, user-scalable=yes, viewport-fit=cover`
            );
        } else {
            // Layout fits already — keep normal scale on tablets too
            vp.setAttribute(
                "content",
                "width=device-width, initial-scale=1, user-scalable=yes, minimum-scale=0.25, maximum-scale=5, viewport-fit=cover"
            );
        }
    };

    updateViewportScale();
    window.addEventListener("resize", updateViewportScale, { passive: true });
    window.addEventListener("orientationchange", updateViewportScale);
}
