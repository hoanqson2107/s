// ==UserScript==
// @name         Script Treo Website 
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  Giả lập hành động người dùng để tránh timeout
// @match        https://studio.firebase.google.com/*
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    function fakeOnce() {
        const r = Math.random();

        if (r < 0.6) {
            // mousemove cực nhẹ
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: rand(5, 40),
                    clientY: rand(5, 40),
                    bubbles: true
                })
            );
        } else {
            // scroll rất nhỏ
            window.scrollBy(0, rand(-2, 2));
        }
    }

    function loop() {
        fakeOnce();
        setTimeout(loop, rand(60000, 120000)); // 60–120 giây
    }

    loop();
})();
