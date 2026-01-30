// ==UserScript==
// @name         Script Treo Website
// @namespace    https://tampermonkey.net/
// @version      4.1
// @description  Giả lập hành động người dùng để tránh timeout + auto F5 mỗi 30 phút
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('[FakeActivity] active');

    const rand = (min, max) => Math.random() * (max - min) + min;

    // 🖱 giả lập di chuyển chuột
    function fakeMouseMove() {
        const event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: rand(0, window.innerWidth),
            clientY: rand(0, window.innerHeight)
        });
        document.dispatchEvent(event);
    }

    // 📜 scroll nhẹ
    function fakeScroll() {
        window.scrollBy({
            top: rand(-80, 80),
            behavior: 'smooth'
        });
    }

    // ⌨️ key vô hại
    function fakeKey() {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Shift'
        });
        document.dispatchEvent(event);
    }

    // 🔁 vòng lặp hoạt động ngẫu nhiên thật
    function activityLoop() {
        fakeMouseMove();

        if (Math.random() > 0.6) fakeScroll();
        if (Math.random() > 0.85) fakeKey();

        const nextDelay = rand(60000, 120000); // 60–120s
        setTimeout(activityLoop, nextDelay);
    }

    activityLoop();

    // 🔄 Auto reload mỗi 30 phút
    setInterval(() => {
        console.log('[FakeActivity] Reload page (30m)');
        location.reload();
    }, 30 * 60 * 1000);

})();
