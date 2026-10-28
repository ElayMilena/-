/* =========================================================
   ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ + РОБОТ + ЧАСТИЦЫ + УСЛУГИ
   ========================================================= */

(function () {
    const robot = document.getElementById('robot');

    /* =========================================================
       ЧАСТИЦЫ ДЛЯ КНОПОК «МЕРОПРИЯТИЯ»
       ========================================================= */
    const particlesLayer = document.getElementById('particles-layer');

    const PARTICLE_SETS = {
        'panel-concerts': ['🎵', '🎼', '🎤'],
        'panel-rink':     ['⛸️', '❄️', '⛸️', '❄️'],
        'panel-hockey':   ['🏒', '⚪', '🥅'],
    };

    let particlesTimer = null;

    function launchParticles(panelId) {
        const set = PARTICLE_SETS[panelId];
        if (!set || !particlesLayer) return;

        clearInterval(particlesTimer);
        particlesLayer.innerHTML = '';

        let count = 0;
        particlesTimer = setInterval(() => {
            count++;
            if (count > 18) {
                clearInterval(particlesTimer);
                particlesTimer = null;
                setTimeout(() => {
                    particlesLayer.innerHTML = '';
                }, 2500);
                return;
            }
            spawnParticle(set[Math.floor(Math.random() * set.length)]);
        }, 160);
    }

    function spawnParticle(emoji) {
        if (!particlesLayer) return;

        const el = document.createElement('span');
        el.className = 'particle';
        el.textContent = emoji;

        el.style.left = (10 + Math.random() * 80) + 'vw';
        const size = 18 + Math.random() * 22;
        el.style.fontSize = size + 'px';
        const dur = 3.5 + Math.random() * 2.5;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = (Math.random() * 0.4) + 's';
        el.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');

        particlesLayer.appendChild(el);
        setTimeout(() => el.remove(), (dur + 0.5) * 1000);
    }

    /* =========================================================
       РОБОТ
       ========================================================= */
    function robotPeek(bothHands = false) {
        if (!robot) return;
        robot.classList.remove('is-spinning');
        robot.classList.add('is-peeking', 'is-waving');
        robot.classList.toggle('is-waving-both', bothHands);
    }

    function robotHide() {
        if (!robot) return;
        robot.classList.remove('is-peeking', 'is-waving', 'is-waving-both', 'is-spinning');
    }

    function robotSpinAndHide() {
        if (!robot) return;
        robot.classList.remove('is-peeking', 'is-waving', 'is-waving-both');
        robot.classList.add('is-spinning');

        setTimeout(() => {
            robot.classList.remove('is-spinning');
            robotHide();
        }, 1200);
    }

    /* =========================================================
       ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
       ========================================================= */
    function showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        const target = document.getElementById(screenId);
        if (!target) return;

        const isMain = screenId === 'main-screen';

        screens.forEach(s => s.classList.remove('active'));
        target.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (isMain) {
            setTimeout(() => robotPeek(false), 300);
            setTimeout(robotHide, 6300);
        } else {
            robotSpinAndHide();
        }
    }

    /* =========================================================
       ДЕЛЕГИРОВАНИЕ КЛИКОВ
       ========================================================= */
    document.addEventListener('click', (e) => {

        /* 1) Навигация между экранами */
        const navBtn = e.target.closest('[data-target]');
        if (navBtn) {
            showScreen(navBtn.dataset.target);
            return;
        }

        /* 2) Аккордеон «Мероприятия» + частицы */
        const toggle = e.target.closest('.acc-toggle');
        if (toggle) {
            const panel = document.getElementById(toggle.dataset.panel);
            if (!panel) return;
            const isOpen = panel.classList.contains('open');

            document.querySelectorAll('.acc-panel').forEach(p => p.classList.remove('open'));
            if (!isOpen) panel.classList.add('open');

            launchParticles(toggle.dataset.panel);

            if (robot) {
                robotPeek(false);
                setTimeout(robotHide, 3000);
            }
            return;
        }

        /* 3) Кнопка «Услуги» под объектом */
        const servToggle = e.target.closest('.services-toggle');
        if (servToggle) {
            const block = servToggle.closest('.object-block');
            if (!block) return;

            const panel = block.querySelector('.services-panel');
            if (!panel) return;

            const isOpen = panel.classList.contains('open');

            document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('open'));
            document.querySelectorAll('.services-toggle').forEach(b => {
                b.classList.remove('open');
                b.textContent = 'Услуги';
            });

            if (!isOpen) {
                panel.classList.add('open');
                servToggle.classList.add('open');
                servToggle.textContent = 'Скрыть услуги';
            }
            return;
        }

        /* 4) Табы внутри услуг Арены «Ерофей» */
        const tab = e.target.closest('.services-tab');
        if (tab) {
            const tabsWrap = tab.closest('.services-tabs');
            const parent = tab.closest('.services-panel');
            if (!tabsWrap || !parent) return;

            tabsWrap.querySelectorAll('.services-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            parent.querySelectorAll('.services-content').forEach(c => c.classList.remove('active'));
            const targetContent = parent.querySelector('#' + tab.dataset.tab);
            if (targetContent) targetContent.classList.add('active');
            return;
        }
    });

    /* =========================================================
       ПЛАВНЫЙ СКРОЛЛ К ЯКОРЯМ «СПОРТИВНАЯ ШКОЛА»
       ========================================================= */
    document.querySelectorAll('.anchor-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* =========================================================
       РОБОТ: КЛИК И КЛАВИАТУРА
       ========================================================= */
    if (robot) {
        robot.addEventListener('click', (e) => {
            e.stopPropagation();
            robot.classList.remove('is-spinning');
            robotPeek(true);
            setTimeout(robotHide, 3000);
        });

        robot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                robotPeek(true);
                setTimeout(robotHide, 3000);
            }
        });
    }

    /* =========================================================
       ПЕРВОЕ ПОЯВЛЕНИЕ РОБОТА НА ГЛАВНОЙ
       ========================================================= */
    window.addEventListener('load', () => {
        setTimeout(() => robotPeek(false), 600);
        setTimeout(robotHide, 6600);
    });

    window.showScreen = showScreen;
})();
