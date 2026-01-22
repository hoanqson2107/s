// ==UserScript==
// @name         Auto Reload Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  none
// @match        https://studio.firebase.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const RELOAD_INTERVAL = 120 * 1000;
    setInterval(() => {
        location.reload();
    }, RELOAD_INTERVAL);
})();
