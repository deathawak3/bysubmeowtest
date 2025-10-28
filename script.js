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

    // НОВЫЙ КОД: Логика анимации MP4 при загрузке
    const splashScreen = document.getElementById("splash-screen");
    const splashVideo = document.getElementById("splash-video");

    if (splashScreen && splashVideo) {
        // Функция для скрытия оверлея
        const hideSplashScreen = () => {
            splashScreen.classList.add("is-done");
        };

        // Главная логика: запускаем видео и скрываем экран по окончании
        const playVideoAndHide = () => {
            // Попытка запуска видео
            const playPromise = splashVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Видео запустилось успешно
                    // Добавляем обработчик на конец видео
                    splashVideo.addEventListener("ended", hideSplashScreen);
                }).catch(e => {
                    // Если автозапуск не удался (мобильный браузер заблокировал), 
                    // немедленно скрываем экран, чтобы не блокировать контент.
                    console.error("Autoplay failed:", e);
                    hideSplashScreen();
                });
            } else {
                // Fallback для старых браузеров
                splashVideo.addEventListener("ended", hideSplashScreen);
            }
        }

        // Запускаем воспроизведение после того, как все медиа-данные загружены
        splashVideo.onloadeddata = playVideoAndHide;

        // Страховка: Скрыть экран через 5 секунд, если что-то пошло не так (очень медленная сеть, ошибка)
        setTimeout(() => {
            if (!splashScreen.classList.contains("is-done")) {
                hideSplashScreen();
            }
        }, 5000);
    }
});