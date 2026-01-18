// ==UserScript==
// @name         Script Treo Website 
// @namespace    https://tampermonkey.net/
// @version      6.7
// @description  Giả lập hành động người dùng để tránh timeout
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('[AntiTimeout VIP] Running...');

    /* ===== utils ===== */
    const rand = (min, max) => Math.random() * (max - min) + min;

    /* ===== fake actions ===== */
    function fakeMouse() {
        const e = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: rand(10, window.innerWidth - 10),
            clientY: rand(10, window.innerHeight - 10)
        });
        document.dispatchEvent(e);
    }

    function fakeScroll() {
        window.scrollBy({
            top: rand(-40, 40),
            behavior: 'smooth'
        });
    }

    function fakeKey() {
        const e = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Shift'
        });
        document.dispatchEvent(e);
    }

    /* ===== audio keepalive (chống Chrome ngủ tab) ===== */
    let audioCtx;
    function audioPing() {
        try {
            audioCtx = audioCtx || new AudioContext();
            const osc = audioCtx.createOscillator();
            osc.frequency.value = 1;
            osc.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.01);
        } catch (_) {}
    }

    /* ===== main loop (KHÔNG dùng setInterval) ===== */
    function loop() {
        fakeMouse();

        if (Math.random() > 0.6) fakeScroll();
        if (Math.random() > 0.75) fakeKey();
        if (Math.random() > 0.85) audioPing();

        // random 2–5 phút (SIÊU NHẸ)
        const next = rand(120000, 300000);
        setTimeout(loop, next);
    }

    loop();

    /* ===== khi quay lại tab ===== */
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            fakeKey();
            audioPing();
        }
    });

})();
