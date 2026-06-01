'use strict';

// ============================================================================
// 1. ДАНІ (БАЗА ПЕРСОНАЖІВ)
// ============================================================================

const CHARACTERS_DATA = {
    "viktor1": {
        name: "Віктор I",
        prototype: "Віктор Ющенко",
        theme: "theme-orange",
        bio: "Попередній цар Казкової Русі. Великий поціновувач бджіл, старожитностей та трипільських глечиків. Часто згадує давні часи.",
        attributes: ["MED.jpg", "honey-jar.png"],
        quotes: ["Любі друзі!", "Ці руки нічого не крали", "Думайте по-українськи!"],
        images: ["viktor1.jpg"],
        audio: ["audio/viktor1_1.mp3", "audio/viktor1_2.mp3"]
    },
    "viktor2": {
        name: "Віктор II",
        prototype: "Віктор Янукович",
        theme: "theme-gold",
        bio: "Цар всія Русі (колишній). Полюбляє розкіш, полювання на кабанів та страусів. Завжди тримає при собі щось золоте.",
        attributes: ["gold-loaf.png", "toilet.png"],
        quotes: ["Астанавітєсь!", "Я живой, я легітімний", "Шлємм...", "Йолка"],
        images: ["viktor2.jpg"],
        audio: ["audio/viktor2_1.mp3", "audio/viktor2_2.mp3", "audio/viktor2_3.mp3"]
    },
    "azirov": {
        name: "Кіля Азіров",
        prototype: "Микола Азаров",
        theme: "theme-azirov",
        bio: "Голова боярського комітету. Видатний лінгвіст, творець 'азірівки'. Головний борець з 'папєрєдніками' та шанувальник капусти.",
        attributes: ["shovel.png"],
        quotes: ["Нєча скігліті!", "Кровосісі наступають", "Бімба в народі", "В краіні кріза"],
        images: ["az_1.jpg", "az_2.jpg"],
        audio: ["audio/azirov_1.mp3", "audio/azirov_2.mp3"]
    },
    "yulya": {
        name: "Юлія Прехитра",
        prototype: "Юлія Тимошенко",
        theme: "theme-white-red",
        bio: "Дівчина з чарівною косою. Довгий час сиділа у високій вежі під замком, але навіть звідти керувала половиною Русі. Постійно планує, як захопити трон.",
        attributes: ["braid.png", "wheelchair.png"],
        quotes: ["Всьо пропало!", "Любі мої!", "Я працюю!"],
        images: ["yulya_1.jpg", "yulya_2.jpg"],
        audio: ["audio/yulya_1.mp3", "audio/yulya_2.mp3"]
    },
    "gesha": {
        name: "Геша Харківський",
        prototype: "Геннадій Кернес",
        theme: "theme-green",
        bio: "Намісник славного міста Харкова. Керує своїм князівством дуже жорстко. Відомий своїм специфічним стилем спілкування та любов'ю до 'кнопкодавства'.",
        attributes: ["green-button.png"],
        quotes: ["Текст по-дебільному написаний", "Міша, всьо х*йня", "Я тебе помножу на нуль"],
        images: ["gesha_1.jpg"],
        audio: ["audio/gesha_1.mp3", "audio/gesha_2.mp3"]
    },
    "vitalya": {
        name: "Бугай Віталя",
        prototype: "Віталій Кличко",
        theme: "theme-red",
        bio: "Найсильніший богатир Русі, мер славного Києва-граду. Має пудові кулаки, але іноді його глибокі філософські думки просто не встигають за словами.",
        attributes: ["boxing-gloves.png"],
        quotes: ["А сьогодні в завтрашній день не всі можуть дивитися", "Щоб холодна вода стала гарячою, її треба підігріти", "У мене є два заступники... чотири з яких..."],
        images: ["vitalya_1.jpg"],
        audio: ["audio/vitalya_1.mp3", "audio/vitalya_2.mp3"]
    },
    "simonenin": {
        name: "Симоненін",
        prototype: "Петро Симоненко",
        theme: "theme-red",
        bio: "Головний червоний боярин. Спить і бачить, як повернути часи, коли серп і молот були дорожчі за царське золото. Не любить буржуїв.",
        attributes: ["hammer.png", "sickle.png"],
        quotes: ["Буржуї прокляті!", "Капіталізм — це зло!", "Завжди з народом!"],
        images: ["simon_1.jpg"],
        audio: ["audio/simon_1.mp3", "audio/simon_2.mp3"]
    },
    "senya": {
        name: "Сеня",
        prototype: "Арсеній Яценюк",
        theme: "theme-silver",
        bio: "Розумний та швидкий кролик-боярин у великих окулярах. Постійно рахує казну та будує велику 'стіну' на кордоні Русі.",
        attributes: ["glasses.png", "carrot.png", "brick-wall.png"],
        quotes: ["Куля в лоб, так куля в лоб!", "Я уряд камікадзе!", "Грошей немає!"],
        images: ["senya_1.jpg"],
        audio: ["audio/senya_1.mp3", "audio/senya_2.mp3"]
    },
    "shlyashko": {
        name: "Олег Шляшко",
        prototype: "Олег Ляшко",
        theme: "theme-purple",
        bio: "Радикальний лицар з вилами. Головний захисник корів і селян. Дуже гучний, експресивний і завжди готовий підняти всіх на вила.",
        attributes: ["pitchfork.png", "cow.png"],
        quotes: ["Скотиняки!", "Я вам покажу!", "Корову треба любити!"],
        images: ["shlyashko_1.jpg", "shlyashko_2.jpg"],
        audio: ["audio/shlyashko_1.mp3", "audio/shlyashko_2.mp3"]
    },
    "natasha": {
        name: "Баба Наташа",
        prototype: "Наталія Королевська",
        theme: "theme-pink",
        bio: "Власниця чарівного кота і великої 'мрії'. Постійно шукає спосіб рухати Русь вперед, але часто сама плутається куди саме йти.",
        attributes: ["cat.png"],
        quotes: ["У мене є мрія!", "Україно, вперед!", "Кіт підтримає!"],
        images: ["natasha_1.jpg", "natasha_2.jpg"],
        audio: ["audio/natasha_1.mp3", "audio/natasha_2.mp3"]
    },
    "tyagnebyk": {
        name: "Тягнебик",
        prototype: "Олег Тягнибок",
        theme: "theme-national",
        bio: "Суворий націоналістичний богатир. Гучно бореться з усіма 'не-руськими' елементами в Боярській Думі. Завжди тримає булаву напоготові.",
        attributes: ["mace.png", "flag.png"],
        quotes: ["Слава нації!", "Геть з Русі!", "Смерть ворогам!"],
        images: ["tyagnebyk_1.jpg"],
        audio: ["audio/tyagnebyk_1.mp3", "audio/tyagnebyk_2.mp3"]
    },
    "petya": {
        name: "Петя (Шоколадна Фабрика)",
        prototype: "Петро Порошенко",
        theme: "theme-chocolate",
        bio: "Шоколадний король Казкової Русі. Має чарівну фабрику солодощів. Роздає цукерки та постійно обіцяє, що скоро всі будуть жити по-новому.",
        attributes: ["candy.png", "chocolate-bar.png"],
        quotes: ["Жити по-новому!", "Армія, мова, віра!", "Я вам обіцяю!"],
        images: ["petya_1.jpg"],
        audio: ["audio/petya_1.mp3", "audio/petya_2.mp3"]
    },
    "slavik": {
        name: "Шустрий Славік",
        prototype: "Савік Шустер",
        theme: "theme-silver",
        bio: "Головний літописець-шоумен. Влаштовує великі словесні битви на майдані кожної п'ятниці. Обожнює міряти 'рейтинги' та дивитися на графіки.",
        attributes: ["microphone.png", "thermometer-rating.png"],
        quotes: ["Свобода слова!", "Подивіться на графіки!", "Зробіть тихіше!"],
        images: ["slavik_1.jpg", "slavik_2.jpg"],
        audio: ["audio/slavik_1.mp3", "audio/slavik_2.mp3"]
    },
    "komarovich": {
        name: "Знахар Комарович",
        prototype: "Євген Комаровський",
        theme: "theme-medic",
        bio: "Головний цілитель Русі. Лікує всі хвороби свіжим повітрям, подорожником і правильним провітрюванням палат. Знає відповіді на всі медичні питання.",
        attributes: ["thermometer.png", "first-aid-kit.png"],
        quotes: ["Головне — провітрювати!", "Більше пити води!", "Не кутайте дітей!"],
        images: ["komarovich_1.jpg"],
        audio: ["audio/komar_1.mp3", "audio/komar_2.mp3"]
    },
    "lucyk": {
        name: "Луцик",
        prototype: "Юрій Луценко",
        theme: "theme-law",
        bio: "Боярин-правдоруб і головний стражник (коли не у в'язниці). Любить гучні промови, гострі слівця і часто опиняється в епіцентрі всіх скандалів.",
        attributes: ["glassess.png", "chains.png", "mug.png"],
        quotes: ["Закон один для всіх!", "Я не здамся без бою!", "Бандитам — тюрми!"],
        images: ["lucyk_1.jpg", "lucyk_2.jpg"],
        audio: ["audio/lucyk_1.mp3", "audio/lucyk_2.mp3"]
    },
    "tsarykov": {
        name: "Цариков",
        prototype: "Олег Царьов",
        theme: "theme-dark-red",
        bio: "Боярин, який дуже погано вчився в сільській школі. Не знає, коли почалася Друга світова війна, і постійно потрапляє в максимально абсурдні ситуації.",
        attributes: ["question-mark.png", "book-crossed.png"],
        quotes: ["Што?", "Волинська різня", "Я не пойняв"],
        images: ["tsarykov_1.jpg"],
        audio: ["audio/tsarykov_1.mp3", "audio/tsarykov_2.mp3"]
    }
};

// ============================================================================
// 2. ГЛОБАЛЬНІ ЗМІННІ (DOM ЕЛЕМЕНТИ)
// ============================================================================

const DOM = {
    views: {
        home: document.getElementById('home-view'),
        character: document.getElementById('character-view')
    },
    containers: {
        grid: document.getElementById('grid-container'),
        attributes: document.getElementById('char-attributes'),
        quotes: document.getElementById('char-quotes'),
        carousel: document.getElementById('carousel-track')
    },
    character: {
        name: document.getElementById('char-name'),
        bio: document.getElementById('char-bio'),
        image: document.getElementById('char-img'),
        prototype: document.querySelector('#char-prototype-info span'),
        photoWrapper: document.querySelector('.main-photo-wrapper')
    },
    buttons: {
        back: document.getElementById('back-btn')
    },
    audioPlayer: document.getElementById('char-audio')
};

let currentCharacterAudioList = [];

// ============================================================================
// 3. ФУНКЦІЇ (ЛОГІКА ПРОГРАМИ)
// ============================================================================

function renderGrid() {
    const fragment = document.createDocumentFragment();

    for (const key in CHARACTERS_DATA) {
        const char = CHARACTERS_DATA[key];
        const card = document.createElement('div');
        
        card.className = `char-card ${char.theme}`;
        card.dataset.characterId = key; 
        
        card.innerHTML = `
            <img src="../img/${char.images[0]}" alt="${char.name}">
            <div style="padding:10px"><h3>${char.name}</h3></div>
        `;
        
        fragment.appendChild(card);
    }

    DOM.containers.grid.appendChild(fragment);
}

function showCharacter(characterId) {
    const char = CHARACTERS_DATA[characterId];
    if (!char) return;

    currentCharacterAudioList = char.audio;

    DOM.character.name.textContent = char.name;
    DOM.character.name.className = char.theme;
    DOM.character.bio.textContent = char.bio;
    DOM.character.bio.className = char.theme;
    DOM.character.prototype.textContent = char.prototype;
    
    DOM.character.image.src = `../img/${char.images[0]}`;

    DOM.containers.attributes.innerHTML = char.attributes.map(attr => `
        <div class="attr-item"><img src="../img/attrs/${attr}" alt="Атрибут"></div>
    `).join('');

    DOM.containers.quotes.innerHTML = char.quotes.map(quote => `<li>"${quote}"</li>`).join('');

    DOM.containers.carousel.innerHTML = char.images.map((img, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `<img src="../img/${img}" class="${activeClass}" data-src="../img/${img}" alt="Образ ${index + 1}">`;
    }).join('');

    DOM.views.home.classList.add('hidden');
    DOM.views.character.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeMainPhoto(clickedImgEl) {
    const newSrc = clickedImgEl.dataset.src;
    if (!newSrc) return;

    DOM.character.image.src = newSrc;

    const allCarouselImages = DOM.containers.carousel.querySelectorAll('img');
    allCarouselImages.forEach(img => img.classList.remove('active'));
    clickedImgEl.classList.add('active');
}

function playRandomAudio() {
    if (!currentCharacterAudioList || currentCharacterAudioList.length === 0) return;

    DOM.audioPlayer.pause();
    DOM.audioPlayer.currentTime = 0;

    const randomIndex = Math.floor(Math.random() * currentCharacterAudioList.length);
    const selectedAudioSrc = currentCharacterAudioList[randomIndex];

    DOM.audioPlayer.src = selectedAudioSrc;
    DOM.audioPlayer.play().catch(err => console.warn("Аудіо не запущено автоматично:", err));
}

function goBackToHome() {
    DOM.audioPlayer.pause();
    DOM.audioPlayer.currentTime = 0;

    DOM.views.character.classList.add('hidden');
    DOM.views.home.classList.remove('hidden');
}

// ============================================================================
// 4. ІНІЦІАЛІЗАЦІЯ ТА ОБРОБНИКИ ПОДІЙ (INIT)
// ============================================================================

function init() {
    renderGrid();

    DOM.containers.grid.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.char-card');
        if (clickedCard) {
            const characterId = clickedCard.dataset.characterId;
            showCharacter(characterId);
        }
    });

    DOM.containers.carousel.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            changeMainPhoto(event.target);
        }
    });

    DOM.character.photoWrapper.addEventListener('click', playRandomAudio);

    DOM.buttons.back.addEventListener('click', goBackToHome);
}

document.addEventListener('DOMContentLoaded', init);