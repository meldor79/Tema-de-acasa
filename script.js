// script.js - Random Fox Generator

// Elementele din DOM
const foxImg = document.getElementById('fox-img');
const btnNew = document.getElementById('btn-new');
const errorMsg = document.getElementById('error-msg');

// URL-ul API-ului pentru vulpi
const API_URL = 'https://randomfox.ca/floof/';

/**
 * Funcția principală care obține o imagine random cu o vulpe de la API
 * Folosește async/await pentru a gestiona cererea HTTP
 */
async function getRandomFox() {
    try {
        // Log: Începutul încărcării
        console.log("Se încarcă o vulpe nouă...");
        
        // Ascunde mesajele de eroare anterioare
        errorMsg.style.display = 'none';
        
        // Afișează un placeholder de încărcare
        foxImg.src = "https://placehold.co/600x400?text=Se+încarcă+vulpea...";
        foxImg.classList.add('loading-shimmer');
        
        // Face cererea HTTP către API folosind async/await
        const response = await fetch(API_URL);
        
        // Verifică dacă răspunsul este OK
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status} - ${response.statusText}`);
        }
        
        // Parsează datele JSON primite
        const data = await response.json();
        
        // Log: URL-ul imaginii primite
        console.log("Imagine primită: " + data.image);
        
        // Așteaptă încărcarea completă a imaginii
        await loadImage(data.image);
        
        // Setează imaginea în DOM și ascunde placeholder-ul de încărcare
        foxImg.src = data.image;
        foxImg.classList.remove('loading-shimmer');
        
    } catch (err) {
        // Log: Eroare detaliată
        console.error("Eroare la încărcarea vulpii: " + err.message);
        
        // Afișează mesajul de eroare în UI
        showError(err.message);
        
        // Șterge imaginea veche și pune placeholder
        foxImg.src = "https://placehold.co/600x400?text=Eroare+la+încărcare";
        foxImg.classList.remove('loading-shimmer');
    }
}

/**
 * Funcție helper care așteaptă încărcarea completă a unei imagini
 * @param {string} url - URL-ul imaginii de încărcat
 */
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Imaginea nu s-a putut încărca'));
        img.src = url;
    });
}

/**
 * Funcție care afișează un mesaj de eroare în interfața utilizatorului
 * @param {string} message - Mesajul de eroare de afișat
 */
function showError(message) {
    // Selectează elementul pentru textul de eroare și setează mesajul
    const errorText = document.getElementById('error-text');
    errorText.textContent = `Eroare: ${message}`;
    
    // Afișează containerul de eroare
    errorMsg.style.display = 'block';
}

/**
 * Funcție care ascunde mesajul de eroare
 */
function hideError() {
    errorMsg.style.display = 'none';
}

/**
 * Adaugă event listener pentru butonul de generare vulpe
 * La click, apelează funcția getRandomFox
 */
btnNew.addEventListener('click', () => {
    // Ascunde mesajele de eroare anterioare la fiecare click nou
    hideError();
    
    // Generează o vulpe nouă
    getRandomFox();
});

/**
 * Inițializează aplicația
 * Apelează getRandomFox la încărcarea paginii pentru o vulpe inițială
 */
function init() {
    // Generează o vulpe la încărcarea paginii
    getRandomFox();
    
    // Log: Aplicația a fost inițializată
    console.log("Aplicația Random Fox Generator a fost inițializată");
}

// Rulează inițializarea când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', init);