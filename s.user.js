// ==UserScript==
// @name         Script Treo Website 
// @namespace    https://tampermonkey.net/
// @version      4.0
// @description  Giả lập hành động người dùng để tránh timeout
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    
    console.log('[FakeActivity] active');

    // random số trong khoảng
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
            top: rand(-50, 50),
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

    // 🔁 chạy vòng lặp an toàn
    setInterval(() => {
        fakeMouseMove();

        if (Math.random() > 0.6) fakeScroll();
        if (Math.random() > 0.8) fakeKey();

        
    }, rand(60000, 120000)); // 8–15 giây
})();
