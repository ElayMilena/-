(function () {
    const robot = document.getElementById('robot');

    /* ЧАСТИЦЫ ДЛЯ КНОПОК «МЕРОПРИЯТИЯ» */
    const particlesLayer = document.getElementById('particles-layer');

    const PARTICLE_SETS = {
        'panel-concerts': ['🎵', '🎤'],
        'panel-rink':     ['⛸️', '❄️'],
        'panel-hockey':   ['🏑', '⚪', '🥅'],
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

    /* РОБОТ */
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

    /* ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ */
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

    /* ГОРИЗОНТАЛЬНЫЕ ГАЛЕРЕИ (фото мероприятий + команды) */
    function scrollGallery(gallery, direction) {
        const track = gallery.querySelector('.event-gallery-track');
        if (!track) return;
        const firstImg = track.querySelector('.event-gallery-img');
        const step = firstImg ? firstImg.offsetWidth + 10 : track.clientWidth * 0.8;
        track.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    function updateGalleryArrows(gallery) {
        const track = gallery.querySelector('.event-gallery-track');
        if (!track) return;
        const prev = gallery.querySelector('.gallery-arrow--prev');
        const next = gallery.querySelector('.gallery-arrow--next');
        if (!prev || !next) return;

        const atStart = track.scrollLeft <= 2;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

        prev.classList.toggle('is-disabled', atStart);
        next.classList.toggle('is-disabled', atEnd);
    }

    function initGalleries() {
        document.querySelectorAll('[data-gallery]').forEach(gallery => {
            const track = gallery.querySelector('.event-gallery-track');
            if (!track) return;

            track.addEventListener('scroll', () => updateGalleryArrows(gallery), { passive: true });
            window.addEventListener('resize', () => updateGalleryArrows(gallery));

            const prev = gallery.querySelector('.gallery-arrow--prev');
            const next = gallery.querySelector('.gallery-arrow--next');

            if (prev) prev.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollGallery(gallery, -1);
            });
            if (next) next.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollGallery(gallery, 1);
            });

            updateGalleryArrows(gallery);
        });
    }

    /* ДЕЛЕГИРОВАНИЕ КЛИКОВ */
    document.addEventListener('click', (e) => {

        const navBtn = e.target.closest('[data-target]');
        if (navBtn) {
            showScreen(navBtn.dataset.target);
            return;
        }

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

        const sportTab = e.target.closest('.sport-tab');
        if (sportTab) {
            const screen = sportTab.closest('#school-screen');
            if (!screen) return;

            screen.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('active'));
            sportTab.classList.add('active');

            screen.querySelectorAll('.sport-panel').forEach(p => p.classList.remove('active'));
            const targetPanel = screen.querySelector('#sport-' + sportTab.dataset.sport);
            if (targetPanel) {
                targetPanel.classList.add('active');
                // Пересчитываем стрелки у галереи команд после показа панели
                targetPanel.querySelectorAll('[data-gallery]').forEach(updateGalleryArrows);
            }
            return;
        }
    });

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


    window.addEventListener('load', () => {
        setTimeout(() => robotPeek(false), 600);
        setTimeout(robotHide, 6600);
        initGalleries();
    });

    window.showScreen = showScreen;
})();
