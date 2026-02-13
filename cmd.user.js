// ==UserScript==
// @name         auto dán lệnh
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Auto chạy pm2 mỗi 30~60 phút (vô hạn)
// @author       you
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

'use strict';

/* ===== CONFIG ===== */

// delay giữa các vòng (30 ~ 60 phút)
const LOOP_DELAY_MIN = 30 * 60 * 1000; // 30 phút
const LOOP_DELAY_MAX = 60 * 60 * 1000; // 60 phút

/* ================= */

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
        console.warn('[xterm] terminal not found');
        return false;
    }
    paste(t, cmd);
    setTimeout(() => enter(t), 100);
    return true;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function mainLoop() {
    console.warn('[CMD] Start infinite loop (30~60 phút / vòng)');

    const CMD = 'pm2 kill && pm2 start app.js --name my-app && pm2 save && pm2 start bot.js';

    while (true) {
        console.warn('[CMD] Run pm2 command');
        runCommand(CMD);

        const delay = rand(LOOP_DELAY_MIN, LOOP_DELAY_MAX);
        console.warn(`[CMD] Sleep ${(delay / 60000).toFixed(1)} phút`);

        await sleep(delay);
    }
}

mainLoop();
