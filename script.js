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

    // НОВЫЙ КОД: ФИНАЛЬНАЯ ЛОГИКА АНИМАЦИИ MP4
    const splashScreen = document.getElementById("splash-screen");
    const splashVideo = document.getElementById("splash-video");

    if (splashScreen && splashVideo) {
        const hideSplashScreen = () => {
            splashScreen.classList.add("is-done");
        };

        // Флаг для отслеживания запуска видео
        let videoAttempted = false;

        const playVideoAndHide = () => {
            if (videoAttempted) return;
            videoAttempted = true;

            const playPromise = splashVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // УСПЕХ: Видео запустилось. Скрываем только после окончания.
                    splashVideo.addEventListener("ended", hideSplashScreen);
                }).catch(e => {
                    // НЕУДАЧА: Автозапуск заблокирован. Немедленно скрываем.
                    console.error("Autoplay failed:", e);
                    hideSplashScreen();
                });
            }
        }

        // 1. Запускаем видео, как только браузер загрузит достаточно данных (самый распространенный метод)
        splashVideo.onloadeddata = playVideoAndHide;

        // 2. Дополнительный триггер на метаданные (помогает на iOS)
        splashVideo.addEventListener("loadedmetadata", playVideoAndHide);

        // 3. Страховка: Если видео не запустилось или не загрузилось в течение 5 секунд, 
        // немедленно скрываем экран.
        setTimeout(() => {
            if (!splashScreen.classList.contains("is-done")) {
                hideSplashScreen();
            }
        }, 5000);

        // 4. Дополнительная попытка запуска сразу после готовности DOM.
        setTimeout(playVideoAndHide, 100);
    }
});