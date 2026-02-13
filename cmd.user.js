// ==UserScript==
// @name         auto dán lệnh
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  none
// @author       none
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

'use strict';

/* ===== CONFIG ===== */

const DELAY_MIN = 30 * 60 * 1000; // 30 phút
const DELAY_MAX = 60 * 60 * 1000; // 60 phút

const STORAGE_KEY = 'AUTO_PM2_SCHEDULE_V1';

/* ================== */

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function terminal() {
    return document.querySelector('textarea.xterm-helper-textarea');
}

/* ===== KEYBOARD ===== */

function pressCtrlBacktick() {
    document.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: '`',
            code: 'Backquote',
            keyCode: 192,
            which: 192,
            ctrlKey: true,
            bubbles: true
        })
    );

    document.dispatchEvent(
        new KeyboardEvent('keyup', {
            key: '`',
            code: 'Backquote',
            keyCode: 192,
            which: 192,
            ctrlKey: true,
            bubbles: true
        })
    );
}

/* ==================== */

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
    // 1️⃣ mở / focus terminal
    pressCtrlBacktick();

    // 2️⃣ đợi terminal focus
    setTimeout(() => {
        const t = terminal();
        if (!t) {
            console.warn('[xterm] terminal not found');
            return;
        }

        // 3️⃣ dán lệnh + enter
        paste(t, cmd);
        setTimeout(() => enter(t), 100);
    }, 300);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function getNextRunTime() {
    return Number(localStorage.getItem(STORAGE_KEY) || 0);
}

function setNextRunTime() {
    const next = Date.now() + rand(DELAY_MIN, DELAY_MAX);
    localStorage.setItem(STORAGE_KEY, String(next));
    console.warn(`[CMD] Next run at ${new Date(next).toLocaleTimeString()}`);
    return next;
}

async function mainLoop() {
    console.warn('[CMD] Script loaded (persistent + ctrl+`)');

    const CMD = 'pm2 kill && pm2 start app.js --name my-app && pm2 save && pm2 start bot.js';

    let nextRun = getNextRunTime();

    if (!nextRun) {
        console.warn('[CMD] No schedule found → create new one');
        nextRun = setNextRunTime();
    }

    while (true) {
        if (Date.now() >= nextRun) {
            console.warn('[CMD] Time reached → run pm2');
            runCommand(CMD);
            nextRun = setNextRunTime();
        }

        // check liên tục nhưng nhẹ
        await sleep(5000);
    }
}

mainLoop();
