// ==UserScript==
// @name         auto dán lệnh
// @namespace    https://tampermonkey.net/
// @version      1.5
// @description  
// @author       you
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

'use strict';

/* ===== CONFIG ===== */

const DELAY_MIN = 30 * 60 * 1000; // 30 phút
const DELAY_MAX = 60 * 60 * 1000; // 60 phút

const STORAGE_KEY = 'NEXT_RUN_TIME';

/* ================== */

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
    console.warn('[CMD] Script loaded (persistent mode)');

    const CMD = 'pm2 kill && pm2 start app.js --name my-app && pm2 save && pm2 start bot.js';

    let nextRun = getNextRunTime();

    // lần đầu chưa có mốc → tạo mốc
    if (!nextRun) {
        console.warn('[CMD] No schedule found → create new one');
        nextRun = setNextRunTime();
    }

    while (true) {
        const now = Date.now();

        if (now >= nextRun) {
            console.warn('[CMD] Time reached → run pm2');
            runCommand(CMD);
            nextRun = setNextRunTime();
        }

        // check mỗi 5 giây (reload bao nhiêu lần cũng không ảnh hưởng)
        await sleep(5000);
    }
}

mainLoop();
