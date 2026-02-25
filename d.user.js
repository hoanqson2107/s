// ==UserScript==
// @name         Treo Site + Fake Activity + Auto Reload + PM2 Loop
// @namespace    https://tampermonkey.net/
// @version      36
// @description  Fake activity luôn chạy, reset 10 lần, phút 9 chạy pm2, phút 10 reload, lặp vô hạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /************** CONFIG **************/
    const RELOAD_INTERVAL = 36 * 60 * 1000; // 10 phút
    const MAX_RELOAD = 25;
    const PM2_DELAY = 5 * 60 * 1000; // phút thứ 9

    const PM2_CMD =
        'pm2 kill && pm2 start app.js --name my-app && pm2 save && pm2 start bot.js';

    /************** STATE **************/
    let reloadCount = Number(localStorage.getItem('tm_reload_count') || 0);
    let pm2ExecutedThisCycle =
        localStorage.getItem('tm_pm2_cycle') === '1';

    console.log('[TM] Reload count:', reloadCount);
    console.log('[TM] PM2 executed cycle:', pm2ExecutedThisCycle);

    /************** UTILS **************/
    const rand = (min, max) => Math.random() * (max - min) + min;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    /************** FAKE ACTIVITY (ALWAYS) **************/
    function fakeActivityLoop() {
        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: rand(0, innerWidth),
                clientY: rand(0, innerHeight)
            })
        );

        if (Math.random() > 0.6) {
            window.scrollBy({ top: rand(-80, 80), behavior: 'smooth' });
        }

        if (Math.random() > 0.85) {
            document.dispatchEvent(
                new KeyboardEvent('keydown', {
                    bubbles: true,
                    key: 'Shift'
                })
            );
        }

        setTimeout(fakeActivityLoop, rand(60000, 120000));
    }

    fakeActivityLoop();
    console.log('[TM] Fake activity running');

    /************** XTERM **************/
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
        if (!t) return console.warn('[xterm] terminal not found');
        paste(t, cmd);
        setTimeout(() => enter(t), 100);
    }

    /************** PM2 AT MINUTE 9 **************/
    if (reloadCount === MAX_RELOAD && !pm2ExecutedThisCycle) {
        console.warn('[TM] Waiting minute 9 to run PM2');

        setTimeout(() => {
            console.warn('[TM] Running PM2 command');
            runCommand(PM2_CMD);
            localStorage.setItem('tm_pm2_cycle', '1');
        }, PM2_DELAY);
    }

    /************** AUTO RELOAD **************/
    setInterval(() => {
        reloadCount++;

        if (reloadCount > MAX_RELOAD) {
            // reset chu kỳ
            reloadCount = 1;
            localStorage.removeItem('tm_pm2_cycle');
        }

        localStorage.setItem('tm_reload_count', reloadCount);
        console.log(`[TM] Reload ${reloadCount}/${MAX_RELOAD}`);

        location.reload();
    }, RELOAD_INTERVAL);

})();
