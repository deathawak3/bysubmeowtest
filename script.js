document.addEventListener('DOMContentLoaded', () => {
    const pl2 = document.getElementById('pl2'); 
    const pl1 = document.getElementById('pl1'); 
    const col3 = document.querySelector('.wrap > .col:nth-child(3)'); 
    const isMobileQuery = window.matchMedia('(max-width: 1100px)');
    function handleMobileLayout(mediaQuery) {
        if (pl2 && pl1 && col3 && mediaQuery.matches) {
            pl1.after(pl2);
        } else if (pl2 && col3 && !mediaQuery.matches) {
            if (pl2.parentElement !== col3) {
                col3.prepend(pl2);
            }
        }
    }
    handleMobileLayout(isMobileQuery);
    isMobileQuery.addEventListener('change', handleMobileLayout);

    const copyButtons = document.querySelectorAll('.aim .copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const code = button.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                button.classList.add('copied');
                const originalText = button.querySelector('span').textContent;
                button.querySelector('span').textContent = 'скопировано!';
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.querySelector('span').textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Ошибка копирования: ', err);
            });
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        html.setAttribute('data-theme', currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '💡' : '🌙';
    });

    themeToggle.textContent = html.getAttribute('data-theme') === 'dark' ? '💡' : '🌙';


    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
    const galleryLinks = document.querySelectorAll('.gallery .ph');

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            if (lightboxImg) lightboxImg.src = '';
            document.body.style.overflow = '';
        }
    };

    galleryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (lightbox && lightboxImg) {
                lightboxImg.src = link.href;
                lightbox.classList.add('is-open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImg) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');

    if (splashVideo) {
        const isDark = html.getAttribute('data-theme') === 'dark';
        const lightSrc = splashVideo.getAttribute('data-light-src');

        if (!isDark && lightSrc) {
            const currentSource = splashVideo.querySelector('source');
            if (currentSource) {
                currentSource.src = lightSrc;
                splashVideo.load();
            }
        }

        const hideSplash = () => {
            if (splashScreen) {
                splashScreen.classList.add('is-done');
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 1000);
            }
        };

        splashVideo.addEventListener('ended', hideSplash);
        splashVideo.play().catch(() => {
            setTimeout(hideSplash, 2000);
        });

        setTimeout(hideSplash, 5000);
    } else if (splashScreen) {
        splashScreen.classList.add('is-done');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 1000);
    }
});