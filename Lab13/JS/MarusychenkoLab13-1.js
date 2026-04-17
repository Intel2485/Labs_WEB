// База даних 8 персонажів (Шляхи до фото та аудіо)
const charactersData = {
    'gojo': { img: '../IMG/Satoru Gojo.jpg', quote: '«Крізь небеса і землю, лише я один гідний поваги.»', audio: '../sound/gomen-amanai.mp3' },
    'sukuna': { img: '../IMG/Ryōmen Sukuna.jpg', quote: '«Пишайся. Ти сильний.»', audio: '../sound/domain-expansion-sukuna.mp3' },
    'itadori': { img: '../IMG/Itadori Yūji.jpg', quote: '«Я не хочу шкодувати про те, як я жив!»', audio: '../sound/itadori-modulo-jujutsu-kaisen-modulo.mp3' },
    'nobara': { img: '../IMG/Kugisaki Nobara.jpg', quote: '«Я люблю себе, коли я гарна і коли сильна!»', audio: '../sound/kugisakinob_kab1a415.mp3' },
    'megumi': { img: '../IMG/Fushiguro Megumi.jpg', quote: '«Я допоможу тим, кого вважаю гідним.»', audio: '../sound/megumi-fushigoro-domain-expansion-made-with-Voicemod.mp3' },
    'maki': { img: '../IMG/Maki Zenin.jpg', quote: '«Я стану головою клану.»', audio: '../sound/maki_voice2.mp3' },
    'toge': { img: '../IMG/Inumaki Toge.jpg', quote: '«Лосось. Ікра.»', audio: '../sound/tuna-tuna.mp3' },
    'panda': { img: '../IMG/Panda.jpg', quote: '«Панда не ведмідь!»', audio: '' }
};

let currentAudio = null;

// ================= КАСТОМНИЙ КУРСОР =================
const cursor = document.getElementById('cursor');
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ================= ГЕНЕРАТОР ЧАСТИНКИ ДЛЯ ЗАГОЛОВКА =================
function createParticle() {
    const container = document.getElementById('titleContainer');
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Випадкова позиція по ширині заголовка
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '10px';
    
    // Випадковий розмір
    const size = Math.random() * 5 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Фіолетові або червоні іскри
    const isPurple = Math.random() > 0.5;
    particle.style.backgroundColor = isPurple ? '#c77dff' : '#ff4d4d';
    particle.style.boxShadow = `0 0 10px ${isPurple ? '#9d4edd' : '#ff0000'}`;
    
    container.appendChild(particle);
    
    // Видаляємо після анімації
    setTimeout(() => { particle.remove(); }, 1500);
}
// Створюємо нову іскру кожні 150 мілісекунд
setInterval(createParticle, 150);


// ================= ОСНОВНА ЛОГІКА =================
document.addEventListener("DOMContentLoaded", function() {
    const areas = document.querySelectorAll('area');
    const tooltip = document.getElementById('customTooltip');
    const ttName = document.getElementById('tt-name');
    const ttAbility = document.getElementById('tt-ability');
    const ttStatus = document.getElementById('tt-status');
    const ttDivider = document.querySelector('.tt-divider');

    areas.forEach(area => {
        
        // НАВЕДЕННЯ (Зміна плашки та КУРСОРУ)
        area.addEventListener('mouseenter', function() {
            const name = this.getAttribute('data-name');
            const ability = this.getAttribute('data-ability');
            const status = this.getAttribute('data-status');
            const color = this.getAttribute('data-color');

            ttName.textContent = name;
            ttAbility.textContent = ability;
            ttStatus.textContent = status;

            // Фарбуємо плашку
            ttName.style.color = color;
            ttName.style.textShadow = `0 0 10px ${color}`;
            ttDivider.style.background = color;
            tooltip.style.borderColor = color;
            tooltip.style.boxShadow = `0 10px 30px ${color}60`; 
            
            // ЗМІНА КОЛЬОРУ ЕНЕРГІЇ КУРСОРУ!
            cursorGlow.style.boxShadow = `0 0 20px 10px ${color}80`;
            cursor.style.backgroundColor = color;

            tooltip.classList.add('active');
        });

        area.addEventListener('mousemove', function(e) {
            tooltip.style.left = (e.pageX + 25) + 'px';
            tooltip.style.top = (e.pageY + 25) + 'px';
        });

        area.addEventListener('mouseleave', function() {
            tooltip.classList.remove('active');
            // Повертаємо базовий колір курсору
            cursorGlow.style.boxShadow = `0 0 20px 10px rgba(0, 212, 255, 0.4)`;
            cursor.style.backgroundColor = '#fff';
        });

        // КЛІК (Відкриття Модалки)
        area.addEventListener('click', function(e) {
            e.preventDefault();
            tooltip.classList.remove('active'); 

            const heroId = this.getAttribute('data-id');
            const color = this.getAttribute('data-color');
            const font = this.getAttribute('data-font'); // Беремо шрифт!
            const data = charactersData[heroId];
            
            if (!data) return;

            document.getElementById('modalHeroImg').src = data.img;
            
            const quoteEl = document.getElementById('modalQuote');
            quoteEl.innerText = data.quote;
            
            // Застосовуємо ІНДИВІДУАЛЬНИЙ стиль (шрифт + колір тіні)
            quoteEl.style.fontFamily = font;
            quoteEl.style.color = '#ffffff';
            quoteEl.style.textShadow = `3px 3px 5px #000, 0 0 25px ${color}, 0 0 40px ${color}`;

            // Перезапуск анімації
            quoteEl.classList.remove('reveal-quote');
            void quoteEl.offsetWidth; 
            quoteEl.classList.add('reveal-quote');

            if (currentAudio) currentAudio.pause();
            currentAudio = new Audio(data.audio);

            const modal = new bootstrap.Modal(document.getElementById('heroModal'));
            modal.show();
        });
    });

    // Зупинка звуку при закритті вікна клавішею Esc або кліком
    document.getElementById('heroModal').addEventListener('hidden.bs.modal', function () {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
    });
});

function playSound() {
    if (currentAudio) {
        currentAudio.currentTime = 0; 
        currentAudio.play().catch(e => console.log("Файл аудіо не знайдено"));
    }
}

// АДАПТИВНІСТЬ КАРТИ
function makeMapResponsive() {
    const image = document.getElementById('heroImage');
    const map = document.querySelector('map[name="jjkMap"]');
    if (!image || !map) return;
    
    const areas = map.getElementsByTagName('area');
    
    if (!image.dataset.originalWidth) {
        image.dataset.originalWidth = image.naturalWidth;
        for (let area of areas) { area.dataset.originalCoords = area.getAttribute('coords'); }
    }

    if(image.dataset.originalWidth > 0) {
        const ratio = image.offsetWidth / image.dataset.originalWidth;
        for (let area of areas) {
            if(area.dataset.originalCoords) {
                const coords = area.dataset.originalCoords.split(',');
                const scaledCoords = coords.map(c => Math.round(parseInt(c) * ratio));
                area.setAttribute('coords', scaledCoords.join(','));
            }
        }
    }
}

window.addEventListener('load', makeMapResponsive);
window.addEventListener('resize', makeMapResponsive);