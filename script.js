// Копирование кода
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const code = btn.dataset.code || '';
            try {
                await navigator.clipboard.writeText(code);
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 1200);
            } catch { alert('Ошибка копирования'); }
        });
    });
});

// Переключение темы
document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const apply = t => {
        root.setAttribute('data-theme', t);
        btn.textContent = t === 'dark' ? '☀️' : '🌙';
    };
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved ?? (prefersDark ? 'dark' : 'light'));

    btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        localStorage.setItem('theme', next);
    });
});

// Лайтбокс
document.addEventListener("DOMContentLoaded", () => {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const img = lb.querySelector('.lightbox__img');
    const closeBtn = lb.querySelector('.lightbox__close');

    const open = (src, alt = '') => {
        img.src = src; img.alt = alt;
        lb.classList.add('is-open');
    };
    const close = () => lb.classList.remove('is-open');

    document.addEventListener('click', e => {
        const link = e.target.closest('.gallery .ph');
        if (link) { e.preventDefault(); open(link.href, link.querySelector('img')?.alt); }
    });
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
});

