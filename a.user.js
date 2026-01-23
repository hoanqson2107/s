// ==UserScript==
// @name         Auto Reload Tab
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  none
// @match        https://studio.firebase.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const HARD_RELOAD_INTERVAL = 10 * 60 * 1000; // 10 phút
    const CHECK_ERROR_INTERVAL = 5 * 1000;      // 5 giây
    let isReloading = false;

    function hardReload(reason) {
        if (isReloading) return;
        isReloading = true;
        console.log('[Firebase] Hard reload:', reason);
        location.replace(location.href);
    }

    // 🔄 Hard reload định kỳ
    setInterval(() => {
        hardReload('scheduled');
    }, HARD_RELOAD_INTERVAL);

    // 💥 Phát hiện lỗi socket
    setInterval(() => {
        const text = document.body?.innerText || '';
        if (
            text.includes('ERR_SOCKET_NOT_CONNECTED') ||
            text.includes("This site can’t be reached")
        ) {
            hardReload('socket error');
        }
    }, CHECK_ERROR_INTERVAL);

})();
