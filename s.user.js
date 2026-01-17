// ==UserScript==
// @name         Fake Human Activity (Safe)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Giả lập hành động người dùng để tránh timeout / mất key
// @match        https://studio.firebase.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('[SCRIPT] active');
    const rand = (min, max) => Math.random() * (max - min) + min;

    function fakeMouseMove() {
        const event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: rand(0, window.innerWidth),
            clientY: rand(0, window.innerHeight)
        });
        document.dispatchEvent(event);
    }

    function fakeScroll() {
        window.scrollBy({
            top: rand(-50, 50),
            behavior: 'smooth'
        });
    }

    function fakeKey() {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Shift'
        });
        document.dispatchEvent(event);
    }

    setInterval(() => {
        fakeMouseMove();

        if (Math.random() > 0.6) fakeScroll();
        if (Math.random() > 0.8) fakeKey();

    }, rand(60000, 120000)); 
})();
