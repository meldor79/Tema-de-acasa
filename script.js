// script.js - Random Fox Generator

const foxImg = document.getElementById('fox-img');
const btnNew = document.getElementById('btn-new');
const errorMsg = document.getElementById('error-msg');

const imgIdEl = document.getElementById('img-id');
const imgUrlEl = document.getElementById('img-url');
const loadTimeEl = document.getElementById('load-time');
const displaySizeEl = document.getElementById('display-size');
const historyContainer = document.getElementById('history');
const btnClear = document.getElementById('btn-clear');

const API_URL = 'https://randomfox.ca/floof/';
const MAX_HISTORY = 8;
let historyList = [];

function saveHistory() {
    try {
        localStorage.setItem('foxHistory', JSON.stringify(historyList));
    } catch (e) {
        console.warn('Nu s-a putut salva istoricul:', e);
    }
}

function loadHistory() {
    try {
        const raw = localStorage.getItem('foxHistory');
        if (raw) historyList = JSON.parse(raw);
    } catch (e) {
        console.warn('Nu s-a putut citi istoricul:', e);
        historyList = [];
    }
}

function renderHistory() {
    if (!historyContainer) return;
    historyContainer.innerHTML = '';
    historyList.forEach(url => {
        const t = document.createElement('img');
        t.src = url;
        t.alt = 'Vulpe miniatură';
        t.className = 'thumb';
        t.addEventListener('click', () => setMainImage(url, true));
        historyContainer.appendChild(t);
    });
}

function addToHistory(url) {
    historyList = historyList.filter(u => u !== url);
    historyList.unshift(url);
    if (historyList.length > MAX_HISTORY) historyList.pop();
    saveHistory();
    renderHistory();
}

function clearHistory() {
    historyList = [];
    saveHistory();
    renderHistory();
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Imaginea nu s-a putut încărca'));
        img.src = url;
    });
}

async function setMainImage(url, fromHistory = false) {
    try {
        hideError();
        if (foxImg) foxImg.classList.add('loading-shimmer');

        const loaded = await loadImage(url);

        if (foxImg) foxImg.src = url;
        if (foxImg) foxImg.classList.remove('loading-shimmer');

        if (imgIdEl) {
            try {
                const parsed = new URL(url);
                imgIdEl.textContent = parsed.pathname.split('/').pop() || url;
            } catch (e) {
                imgIdEl.textContent = url;
            }
        }

        if (imgUrlEl) {
            imgUrlEl.href = url;
            imgUrlEl.textContent = url;
        }

        if (loadTimeEl) loadTimeEl.textContent = new Date().toLocaleString();

        // Measure displayed size after layout
        requestAnimationFrame(() => {
            if (displaySizeEl && foxImg) {
                displaySizeEl.textContent = `${foxImg.clientWidth}×${foxImg.clientHeight} px`;
            }
        });

        if (!fromHistory) addToHistory(url);
    } catch (err) {
        console.error(err);
        showError(err.message || String(err));
        if (foxImg) foxImg.src = 'https://placehold.co/600x400?text=Eroare+la+încărcare';
        if (foxImg) foxImg.classList.remove('loading-shimmer');
    }
}

async function getRandomFox() {
    try {
        hideError();
        if (foxImg) {
            foxImg.classList.add('loading-shimmer');
            foxImg.src = 'https://placehold.co/600x400?text=Se+încarcă+vulpea...';
        }

        // Clear existing history so after generation only the new image remains
        clearHistory();

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Eroare HTTP: ${response.status}`);
        const data = await response.json();
        if (!data.image) throw new Error('Răspuns invalid de la API');

        await setMainImage(data.image, false);
    } catch (err) {
        console.error('Eroare la încărcarea vulpii:', err);
        showError(err.message || String(err));
        if (foxImg) foxImg.src = 'https://placehold.co/600x400?text=Eroare+la+încărcare';
        if (foxImg) foxImg.classList.remove('loading-shimmer');
    }
}

function showError(message) {
    const errorText = document.getElementById('error-text');
    if (errorText) errorText.textContent = `Eroare: ${message}`;
    if (errorMsg) errorMsg.style.display = 'block';
}

function hideError() {
    if (errorMsg) errorMsg.style.display = 'none';
}

function init() {
    loadHistory();
    renderHistory();

    if (btnNew) btnNew.addEventListener('click', () => getRandomFox());
    if (btnClear) btnClear.addEventListener('click', () => clearHistory());

    if (foxImg) {
        foxImg.addEventListener('click', () => {
            if (imgUrlEl && imgUrlEl.href) window.open(imgUrlEl.href, '_blank');
        });
    }

    getRandomFox();
}

document.addEventListener('DOMContentLoaded', init);