/**
 * Переключение между экранами мини-приложения.
 * @param {string} screenId - id экрана, который нужно показать
 */
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Робот выглядывает при переходах между экранами
    if (window.peekAndWave) window.peekAndWave();
}

/* =========================================================
   РОБОТ
   ========================================================= */
(function initRobot() {
    let robot = null;
    let hideTimer = null;
    let cooldown = false;

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    /**
     * Показать робота
     * @param {boolean} bothHands - 
     */
    function peek(bothHands = false) {
        if (!robot) return;
        robot.classList.add('is-peeking');
        robot.classList.add('is-waving');
        robot.classList.toggle('is-waving-both', bothHands);
    }

    /**
     * Спрятать робота
     */
    function hide() {
        if (!robot) return;
        robot.classList.remove('is-peeking');
        robot.classList.remove('is-waving');
        robot.classList.remove('is-waving-both');
    }

    /**
     * Полный цикл: спрятался → выглянул → помахал → спрятался.
     * @param {boolean} bothHands
     */
    function peekAndWave(bothHands = false) {
        if (!robot) return;

        // Для клика по роботу игнорируем cooldown, чтобы всегда отзывался
        if (!bothHands && cooldown) return;
        if (bothHands) cooldown = false; // сбрасываем блокировку, чтобы клик сработал
        if (!bothHands) cooldown = true;

        hide();
        clearTimeout(hideTimer);

        hideTimer = setTimeout(() => {
            peek(bothHands);

            hideTimer = setTimeout(() => {
                hide();
                cooldown = false;
            }, 3000);
        }, 300);
    }

    ready(function () {
        robot = document.getElementById('robot');
        if (!robot) return;

        // Первое появление
        setTimeout(() => peek(false), 600);
        setTimeout(hide, 6600);

        // Машет при клике
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => peekAndWave(false));
        });

        // Клик по роботу, машет ДВУМЯ руками
        robot.addEventListener('click', (e) => {
            e.stopPropagation();
            peekAndWave(true);
        });

        // Поддержка клавиатуры (Enter/Space)
        robot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                peekAndWave(true);
            }
        });
    });

    window.peekAndWave = peekAndWave;
})();
