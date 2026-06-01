// ==========================================
// 1. ГЛОБАЛЬНІ ЗМІННІ ТА DOM-ЕЛЕМЕНТИ
// ==========================================
const root = document.documentElement;
const bgColorPicker = document.getElementById('bgColorPicker');
const logoColorPicker = document.getElementById('logoColorPicker');
const shortcutsContainer = document.getElementById('shortcutsContainer');
const modalOverlay = document.getElementById('modalOverlay');
const nameInput = document.getElementById('shortcutName');
const urlInput = document.getElementById('shortcutUrl');

// Масив для зберігання ярликів (стан додатку)
let shortcuts = JSON.parse(localStorage.getItem('myShortcuts')) || [
    { name: 'Ютуб', url: 'https://youtube.com' } // Дефолтний ярлик
];

// ==========================================
// 2. ФУНКЦІЇ (ЛОГІКА ДОДАТКУ)
// ==========================================

// Завантаження збережених кольорів
function loadColors() {
    const savedBg = localStorage.getItem('bgColor') || '#35363a';
    const savedLogo = localStorage.getItem('logoColor') || '#ffffff';
    
    root.style.setProperty('--bg-color', savedBg);
    root.style.setProperty('--logo-color', savedLogo);
    
    bgColorPicker.value = savedBg;
    logoColorPicker.value = savedLogo;
}

// Відображення списку ярликів
function renderShortcuts() {
    // Шукаємо кнопку додавання, щоб потім повернути її в кінець
    const addBtn = document.querySelector('.add-btn');
    
    // Очищаємо контейнер
    shortcutsContainer.innerHTML = '';
    
    // Створюємо та додаємо кожен ярлик
    shortcuts.forEach(shortcut => {
        const a = document.createElement('a');
        a.href = shortcut.url;
        a.className = 'shortcut';
        
        // Беремо першу літеру для іконки
        const firstLetter = shortcut.name.charAt(0).toUpperCase();
        
        a.innerHTML = `
            <div class="shortcut-icon">${firstLetter}</div>
            <div class="shortcut-title">${shortcut.name}</div>
        `;
        shortcutsContainer.appendChild(a);
    });
    
    // Повертаємо кнопку "Додати" в кінець списку
    shortcutsContainer.appendChild(addBtn);
}

// Відкриття модального вікна
function openModal() {
    nameInput.value = '';
    urlInput.value = '';
    modalOverlay.style.display = 'flex';
    nameInput.focus();
}

// Закриття модального вікна
function closeModal() {
    modalOverlay.style.display = 'none';
}

// Збереження нового ярлика
function saveShortcut() {
    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (name && url) {
        // Додаємо http:// якщо користувач забув
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        shortcuts.push({ name, url });
        localStorage.setItem('myShortcuts', JSON.stringify(shortcuts));
        renderShortcuts();
        closeModal();
    } else {
        alert('Будь ласка, заповніть обидва поля!');
    }
}

// ==========================================
// 3. ОБРОБНИКИ ПОДІЙ (EVENT LISTENERS)
// ==========================================

// Зміна кольору фону
bgColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    root.style.setProperty('--bg-color', color);
    localStorage.setItem('bgColor', color);
});

// Зміна кольору логотипу
logoColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    root.style.setProperty('--logo-color', color);
    localStorage.setItem('logoColor', color);
});

// Закриття модалки при кліку на темний фон навколо неї
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// ==========================================
// 4. ІНІЦІАЛІЗАЦІЯ (ЗАПУСК ДОДАТКУ)
// ==========================================
loadColors();
renderShortcuts();