// ==UserScript==
// @name         Treo Website 
// @namespace    https://tampermonkey.net/
// @version      7.0
// @description  none
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    console.log('[HE THONG] Bat dau');

    /* ========================
       CAU HINH
    ======================== */

    const soLanReloadToiDa = 10;
    const thoiGianReloadMin = 60 * 60 * 1000;
    const thoiGianReloadMax = 67 * 60 * 1000;
    const thoiGianChoSauReload = 30 * 60 * 1000;

    const thoiGianChoTerminalToiDa = 30 * 1000; // 30s
    const thoiGianCheckTerminal = 1000; // check moi 1s

    const lenhPM2 =
        'pm2 kill && pm2 start app.js --name my-app && pm2 save && pm2 start bot.js';

    /* ======================== */

    const rand = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    let soLanReload = Number(localStorage.getItem('dem_reload') || 0);

    /* ========================
       TERMINAL
    ======================== */

    function timTerminal() {
        return document.querySelector('textarea.xterm-helper-textarea');
    }

    async function choTerminalXuatHien() {
        const batDau = Date.now();

        while (Date.now() - batDau < thoiGianChoTerminalToiDa) {
            const t = timTerminal();
            if (t) return t;
            await sleep(thoiGianCheckTerminal);
        }

        return null;
    }

    function bamCtrlBacktick() {
        document.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: '`',
                code: 'Backquote',
                keyCode: 192,
                ctrlKey: true,
                bubbles: true
            })
        );
    }

    function danLenh(el, text) {
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

    function bamEnter(el) {
        el.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true
            })
        );
    }

    /* ========================
       CHAY PM2
    ======================== */

    async function chayPM2() {

        console.log('[PM2] Doi 5 phut cho web on dinh...');
        await sleep(thoiGianChoSauReload);

        console.log('[PM2] Dang cho terminal (toi da 30s)...');
        const terminal = await choTerminalXuatHien();

        if (!terminal) {
            console.log('[PM2] Khong tim thay terminal → reload lai');
            location.reload();
            return;
        }

        console.log('[PM2] Terminal OK → dang chay lenh');

        bamCtrlBacktick();
        await sleep(500);

        danLenh(terminal, lenhPM2);
        await sleep(200);
        bamEnter(terminal);

        console.log('[PM2] Hoan tat → reset chu ky');
    }

    /* ========================
       CHU KY RELOAD
    ======================== */

    async function xuLyChuKy() {

        if (soLanReload >= soLanReloadToiDa) {

            localStorage.setItem('dem_reload', '0');
            await chayPM2();
            return;
        }

        soLanReload++;
        localStorage.setItem('dem_reload', String(soLanReload));

        const delay = rand(thoiGianReloadMin, thoiGianReloadMax);

        console.log(
            `[RELOAD] Lan ${soLanReload}/10 → reload sau ${(delay / 60000).toFixed(1)} phut`
        );

        setTimeout(() => {
            location.reload();
        }, delay);
    }

    xuLyChuKy();

})();
