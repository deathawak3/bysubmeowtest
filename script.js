document.addEventListener("DOMContentLoaded", () => {
    // --- 1. ЛОГИКА КОПИРОВАНИЯ КОДА (CROSSHAIR) ---
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

    // --- 2. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ---
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

    // --- 3. ЛОГИКА LIGHTBOX (ОТКРЫТИЯ КАРТИНОК) ---
    const lb = document.getElementById("lightbox");
    if (lb) {
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
            open(link.href, img.alt);
        });

        lbClose.addEventListener("click", close);
        lb.addEventListener("click", (e) => {
            if (e.target === lb) close();
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === "Escape") close();
        });
    }

    // --- 4. ЛОГИКА АНИМАЦИИ MP4 С ПОДДЕРЖКОЙ ТЕМЫ (ИСПРАВЛЕНО) ---
    const splashScreen = document.getElementById("splash-screen");
    const splashVideo = document.getElementById("splash-video");

    if (splashScreen && splashVideo) {
        // --- Выбор видео в зависимости от темы ---
        const currentTheme = root.getAttribute("data-theme") || "dark";
        const lightSrc = splashVideo.dataset.lightSrc;

        // Если тема светлая, меняем источник
        if (currentTheme === "light" && lightSrc) {
            const oldSource = splashVideo.querySelector('source');
            if (oldSource) oldSource.remove();

            const newSource = document.createElement('source');
            newSource.src = lightSrc;
            newSource.type = "video/mp4";
            splashVideo.appendChild(newSource);

            splashVideo.load();
        }
        // ----------------------------------------

        const hideSplashScreen = () => {
            splashScreen.classList.add("is-done");
        };

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

        // 1. Запуск видео при готовности данных
        splashVideo.onloadeddata = playVideoAndHide;
        splashVideo.addEventListener("loadedmetadata", playVideoAndHide);

        // 2. Страховка: Если видео не запустилось или не загрузилось в течение 5 секунд
        setTimeout(() => {
            if (!splashScreen.classList.contains("is-done")) {
                hideSplashScreen();
            }
        }, 5000);

        // 3. Дополнительная попытка запуска сразу
        setTimeout(playVideoAndHide, 100);
    }
});