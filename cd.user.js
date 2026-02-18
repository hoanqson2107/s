// ==UserScript==
// @name         Auto PM2 Random Interval
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Chỉ chạy PM2 mỗi 30~60 phút (random)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /*************** CONFIG (SỬA Ở ĐÂY) ***************/
    const MIN_MINUTES = 30;   // phút nhỏ nhất
    const MAX_MINUTES = 36;   // phút lớn nhất

    const PM2_CMD =
        'pm2 kill && pm2 start app.js --name my-app && pm2 save && pm2 start bot.js';
    /***************************************************/

    const randMinutes = () =>
        Math.floor(Math.random() * (MAX_MINUTES - MIN_MINUTES + 1)) + MIN_MINUTES;

    function terminal() {
        return document.querySelector('textarea.xterm-helper-textarea');
    }

    function paste(el, text) {
        el.focus();
        const data = new DataTransfer();
        data.setData('text/plain', text);
        el.dispatchEvent(
            new ClipboardEvent('paste', {
                clipboardData: data,
                bubbles: true
            })
        );
    }

    function enter(el) {
        el.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            })
        );
    }

    function runCommand(cmd) {
        const t = terminal();
        if (!t) {
            console.warn('[PM2] Terminal not found');
            return;
        }

        paste(t, cmd);
        setTimeout(() => enter(t), 100);
    }

    function scheduleNext() {
        const minutes = randMinutes();
        const delay = minutes * 60 * 1000;

        console.log(`[PM2] Next run in ${minutes} minutes`);

        setTimeout(() => {
            console.log('[PM2] Running command...');
            runCommand(PM2_CMD);
            scheduleNext(); // lặp vô hạn
        }, delay);
    }

    console.log('[PM2] Auto PM2 started');
    scheduleNext();

})();
