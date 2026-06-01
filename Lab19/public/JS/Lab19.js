// ========================= CONFIG =========================
const SLOTS_CONFIG = [
    { id: 'cam1', label: 'CAM 1', row: 'top' },
    { id: 'cam2', label: 'CAM 2', row: 'top' },
    { id: 'cam3', label: 'CAM 3', row: 'top' },
    { id: 'main', label: 'MAIN', row: 'bottom' },
    { id: 'stash', label: 'STASH', row: 'bottom' },
];

const WIN_SCORE = 50;
const INITIAL_SPARES = 20;
const BASE_DECAY = 0.016;
const TICK_MS = 380;

// Tool configs
const TOOLS = {
    flashlight: { id: 'flashlight', charge: 100, decayRate: 0.008, label: 'FLASHLIGHT' },
    shocker: { id: 'shocker', charge: 100, decayRate: 0.006, label: 'SHOCKER' },
};

// Animatronic alert durations (ms to react)
const ANIMA_TIMEOUT_MS = 9000;
const ANIMA_COOLDOWN = 18000;

const ATMO_MESSAGES = [
    'Перевір усі камери...',
    'Чуєш ті кроки у коридорі?',
    'Тримай панель під контролем.',
    'Вони не люблять темряву... або люблять?',
    'Не дай світлу згаснути.',
    'Генератор ледь тягне...',
    'Щось рухається в Коридорі C.',
    'Запобіжники не вічні.',
    'Рівень потужності критичний.',
    'Хтось вимкнув камеру 2?',
    'УВАГА: аномальна активність.',
    'Залишайся на посту.',
    'Сигналізація відключена. Чому?',
    'Зберігай спокій. Працюй швидко.',
    'Вони вже близько до серверної.',
    '...тихіше... чи не так?',
];

// Screamer emojis per animatronic
const SCREAMERS = {
    freddy: '🎩',
    bonnie: '🐰',
    foxy: '🦊',
};

// ========================= STATE =========================
let state = {};
let record = 0;

function initState() {
    state = {
        running: false,
        score: 0,
        spares: INITIAL_SPARES,
        elapsed: 0,
        slots: {},
        mainHealth: 100,
        timerInterval: null,
        tickInterval: null,
        atmoTimeout: null,
        flickerTimeout: null,
        tools: {
            flashlight: { charge: 100 },
            shocker: { charge: 100 },
        },
        animatronics: {
            freddy: { active: false, timer: null, cooldownTimer: null, onCooldown: false },
            bonnie: { active: false, timer: null, cooldownTimer: null, onCooldown: false },
            foxy: { active: false, timer: null, cooldownTimer: null, onCooldown: false },
        },
        bonnieLock: false,  // true while bonnie is active = replacing fuse = death
        lastReplacedWhileBonnie: false,
    };

    SLOTS_CONFIG.forEach(cfg => {
        state.slots[cfg.id] = {
            id: cfg.id,
            label: cfg.label,
            health: 100,
            status: 'ok',
            decayRate: BASE_DECAY + Math.random() * 0.013,
        };
    });
}

// ========================= GAUGE SVG =========================
function buildGaugeSVG(id) {
    return `
  <svg class="gauge-svg" viewBox="0 0 110 76" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gf-${id}" cx="50%" cy="100%" r="75%">
        <stop offset="0%" stop-color="#e8e0d0"/>
        <stop offset="55%" stop-color="#ccc4b4"/>
        <stop offset="100%" stop-color="#a8a090"/>
      </radialGradient>
    </defs>
    <path d="M6,74 A49,49 0 0,1 104,74" fill="#222018" stroke="#3a3530" stroke-width="3"/>
    <path d="M10,74 A45,45 0 0,1 100,74" fill="url(#gf-${id})"/>
    <g stroke="#5a5248" stroke-width="0.8" opacity="0.7">
      <line x1="55" y1="12" x2="55" y2="20" transform="rotate(-80 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="18" transform="rotate(-60 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="20" transform="rotate(-40 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="18" transform="rotate(-20 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="20" transform="rotate(0 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="18" transform="rotate(20 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="20" transform="rotate(40 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="18" transform="rotate(60 55 74)"/>
      <line x1="55" y1="12" x2="55" y2="20" transform="rotate(80 55 74)"/>
    </g>
    <text x="13" y="68" fill="#6a6050" font-size="7" font-family="Share Tech Mono">0</text>
    <text x="48" y="14" fill="#6a6050" font-size="7" font-family="Share Tech Mono">20</text>
    <text x="90" y="68" fill="#6a6050" font-size="7" font-family="Share Tech Mono">40</text>
    <text x="55" y="64" text-anchor="middle" fill="#7a7060" font-size="8" font-family="Share Tech Mono">V</text>
    <line id="needle-${id}" x1="55" y1="74" x2="55" y2="20"
      stroke="#cc1100" stroke-width="2" stroke-linecap="round"
      transform="rotate(-80 55 74)"
      style="transition:transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94)"/>
    <circle cx="55" cy="74" r="5" fill="#3a3530" stroke="#1a1810" stroke-width="1"/>
    <circle cx="55" cy="74" r="2" fill="#2a2820"/>
  </svg>`;
}

// ========================= BUILD UI =========================
function buildPanel() {
    $('#top-slots').empty();
    $('#bottom-slots').empty();

    SLOTS_CONFIG.forEach(cfg => {
        const slot = state.slots[cfg.id];
        const $el = buildSlotElement(slot);
        if (cfg.row === 'top') $('#top-slots').append($el);
        else $('#bottom-slots').append($el);
    });

    setupDroppables();
    rebuildSpares();
    resetAnimatronicUI();
    updateToolGauges();
}

function buildSlotElement(slot) {
    return $(`
    <div class="fuse-slot" id="slot-wrap-${slot.id}">
      <div class="indicator-led ok" id="led-${slot.id}"></div>
      <div class="wire-top"></div>
      <div class="conductor"></div>
      <div class="gauge-wrap" id="gauge-wrap-${slot.id}"></div>
      <div class="fuse-socket" id="socket-${slot.id}">
        <div class="fuse-in-socket good" id="fuse-${slot.id}">16A</div>
      </div>
      <div class="slot-label-tag">${slot.label}</div>
      <div class="slot-health">
        <div class="slot-health-fill" id="hfill-${slot.id}" style="width:100%;background:var(--green-ok)"></div>
      </div>
    </div>
  `).each(function () {
        $(this).find(`#gauge-wrap-${slot.id}`).html(buildGaugeSVG(slot.id));
    });
}

function setupDroppables() {
    SLOTS_CONFIG.forEach(cfg => {
        $(`#socket-${cfg.id}`).droppable({
            accept: '.spare-fuse',
            tolerance: 'intersect',
            disabled: true,
            drop: function (event, ui) {
                if (state.spares <= 0) { addLog('Немає запасних!', 'fail'); return; }

                // BONNIE TRAP — replacing fuse while bonnie is active = death
                if (state.bonnieLock) {
                    ui.draggable.remove();
                    triggerScreamer('bonnie', 'Боні пожартував з тобою...');
                    return;
                }

                ui.draggable.remove();
                replaceFuse(cfg.id);
            }
        });
    });
}

function rebuildSpares() {
    $('#spare-fuses').empty();
    const visible = Math.min(state.spares, 12);
    for (let i = 0; i < visible; i++) spawnSpareFuse();
    $('#spare-count-val').text(state.spares);
}

function spawnSpareFuse() {
    const $f = $('<div class="spare-fuse">16A</div>').draggable({
        revert: 'invalid', helper: 'clone', zIndex: 9999,
        start: function () { $(this).css('opacity', 0.45); },
        stop: function () { $(this).css('opacity', 1); },
    });
    $('#spare-fuses').append($f);
}

// ========================= GAME LOOP =========================
function startGame() {
    state.running = true;

    state.timerInterval = setInterval(() => {
        if (!state.running) return;
        state.elapsed++;
        const m = String(Math.floor(state.elapsed / 60)).padStart(2, '0');
        const s = String(state.elapsed % 60).padStart(2, '0');
        $('#timer-val').text(`${m}:${s}`);
    }, 1000);

    state.tickInterval = setInterval(gameTick, TICK_MS);
    scheduleAtmo();
    scheduleFlicker();
    scheduleAnimatronic();
}

function gameTick() {
    if (!state.running) return;

    // Decay fuse slots
    SLOTS_CONFIG.forEach(cfg => {
        const slot = state.slots[cfg.id];
        if (slot.status === 'blown') return;

        const timeFactor = 1 + state.elapsed * 0.0025;
        slot.health -= slot.decayRate * timeFactor * 100 * (TICK_MS / 1000);
        slot.health = Math.max(0, slot.health);
        const prev = slot.status;

        if (slot.health <= 0) {
            slot.status = 'blown'; slot.health = 0;
            addLog(`${slot.label}: ПЕРЕГОРІВ! ⚡`, 'fail');
            triggerBlownEffect(cfg.id);
        } else if (slot.health <= 30) {
            slot.status = 'warn';
            if (prev === 'ok') addLog(`${slot.label}: КРИТИЧНИЙ`, 'warn');
        } else {
            slot.status = 'ok';
        }
        updateSlotUI(slot);
    });

    // Decay tools
    decayTool('flashlight');
    decayTool('shocker');

    // Main health = avg
    const avg = SLOTS_CONFIG.reduce((s, c) => s + state.slots[c.id].health, 0) / SLOTS_CONFIG.length;
    state.mainHealth = avg;
    updateMainGauge(avg);

    // Lose check: all fuses blown
    if (SLOTS_CONFIG.every(c => state.slots[c.id].status === 'blown')) {
        triggerGameOver('Всі запобіжники перегоріли.<br>Живлення відключено.<br><span style="color:#ff4422">Вони вже в коридорах.</span>');
        return;
    }

    if (state.score >= WIN_SCORE) gameWin();
}

// ========================= TOOLS =========================
function decayTool(toolId) {
    const t = state.tools[toolId];
    const timeFactor = 1 + state.elapsed * 0.001;
    t.charge -= TOOLS[toolId].decayRate * timeFactor * 100 * (TICK_MS / 1000);
    t.charge = Math.max(0, t.charge);

    // If flashlight dead and freddy active => death
    if (toolId === 'flashlight' && t.charge <= 0 && state.animatronics.freddy.active) {
        triggerScreamer('freddy', 'Ліхтарик розрядився.<br>Фредді зайшов у темряву...');
        return;
    }
    // If shocker dead and foxy active => death
    if (toolId === 'shocker' && t.charge <= 0 && state.animatronics.foxy.active) {
        triggerScreamer('foxy', 'Шокер розряджений.<br>Фоксі вже тут...');
        return;
    }

    updateToolGauges();
}

function updateToolGauges() {
    // Flashlight
    const fl = state.tools.flashlight.charge;
    const flAngle = -80 + (fl / 100) * 160;
    $('#needle-flashlight').attr('transform', `rotate(${flAngle} 55 74)`);
    let flColor = 'var(--yellow-warn)';
    if (fl > 60) flColor = '#aaee00';
    if (fl < 25) flColor = 'var(--red-fail)';
    $('#fill-flashlight').css({ width: fl + '%', background: flColor });

    // Shocker
    const sh = state.tools.shocker.charge;
    const shAngle = -80 + (sh / 100) * 160;
    $('#needle-shocker').attr('transform', `rotate(${shAngle} 55 74)`);
    let shColor = '#4466ff';
    if (sh < 40) shColor = '#aa44ff';
    if (sh < 20) shColor = 'var(--red-fail)';
    $('#fill-shocker').css({ width: sh + '%', background: shColor });
}

// ========================= SLOT UI =========================
function updateSlotUI(slot) {
    const h = slot.health;
    let barColor = 'var(--green-ok)';
    if (h < 55) barColor = 'var(--yellow-warn)';
    if (h < 25) barColor = 'var(--red-fail)';
    $(`#hfill-${slot.id}`).css({ width: h + '%', background: barColor });

    const $led = $(`#led-${slot.id}`);
    $led.removeClass('ok warn fail');
    if (slot.status === 'ok') $led.addClass('ok');
    else if (slot.status === 'warn') $led.addClass('warn');
    else $led.addClass('fail');

    const angle = -80 + (h / 100) * 160;
    $(`#needle-${slot.id}`).attr('transform', `rotate(${angle} 55 74)`);

    const $fuse = $(`#fuse-${slot.id}`);
    $fuse.removeClass('good worn blown');
    if (slot.status === 'ok') $fuse.addClass('good').text('16A');
    else if (slot.status === 'warn') $fuse.addClass('worn').text('16A');
    else $fuse.addClass('blown').text('');

    $(`#socket-${slot.id}`).droppable('option', 'disabled', slot.status === 'ok');
}

function updateMainGauge(health) {
    const angle = -80 + (health / 100) * 160;
    $('#main-needle-svg').attr('transform', `rotate(${angle} 80 108)`);
    let c = 'var(--green-ok)';
    if (health < 55) c = 'var(--yellow-warn)';
    if (health < 25) c = 'var(--red-fail)';
    $('#main-health-fill').css({ width: health + '%', background: c });
}

function triggerBlownEffect(slotId) {
    $(`#slot-wrap-${slotId}`).addClass('shake');
    setTimeout(() => $(`#slot-wrap-${slotId}`).removeClass('shake'), 400);
    $('#flicker-light').css('background', 'rgba(255,40,0,0.08)');
    setTimeout(() => $('#flicker-light').css('background', 'rgba(0,0,0,0)'), 200);
}

// ========================= REPLACE FUSE =========================
function replaceFuse(slotId) {
    const slot = state.slots[slotId];
    slot.health = 100;
    slot.status = 'ok';
    slot.decayRate = BASE_DECAY + Math.random() * 0.018;

    state.spares--;
    state.score++;

    updateSlotUI(slot);
    rebuildSpares();
    $('#score-val').text(String(state.score).padStart(2, '0'));
    addLog(`${slot.label}: замінено ✓`, 'ok');

    $(`#socket-${slotId}`).addClass('replace-glow');
    setTimeout(() => $(`#socket-${slotId}`).removeClass('replace-glow'), 750);
    $(`#socket-${slotId}`).droppable('option', 'disabled', true);

    // FOXY passive: using drag while cams damaged = all cams drop a bit
    if (state.animatronics.foxy.onCooldown) {
        ['cam1', 'cam2', 'cam3'].forEach(id => {
            state.slots[id].health = Math.max(0, state.slots[id].health - 12);
        });
        addLog('FOXY: Камери просіли!', 'warn');
    }

    // Resupply
    if (state.score > 0 && state.score % 8 === 0 && state.spares < 30) {
        const bonus = 3 + Math.floor(Math.random() * 4);
        state.spares += bonus;
        rebuildSpares();
        addLog(`Доставка: +${bonus} запобіжників`, 'ok');
    }
}

// ========================= ANIMATRONICS =========================
function scheduleAnimatronic() {
    if (!state.running) return;
    const delay = 12000 + Math.random() * 16000;
    state.anima_schedTimer = setTimeout(() => {
        if (!state.running) return;
        triggerRandomAnimatronic();
        scheduleAnimatronic();
    }, delay);
}

function triggerRandomAnimatronic() {
    // Pick one that is not active and not on cooldown
    const candidates = ['freddy', 'bonnie', 'foxy'].filter(a =>
        !state.animatronics[a].active && !state.animatronics[a].onCooldown
    );
    if (candidates.length === 0) return;

    const name = candidates[Math.floor(Math.random() * candidates.length)];
    activateAnimatronic(name);
}

function activateAnimatronic(name) {
    const a = state.animatronics[name];
    a.active = true;

    // Show active state in UI
    $(`#cell-${name}`).addClass(`cell-active-${name}`);
    $(`#status-${name}`).text('ACTIVE').css('color', '#ff4422');

    if (name === 'freddy') {
        $(`#btn-freddy`).prop('disabled', false);
        addLog('FREDDY: очі світяться! 🔦 Посвіти!', 'warn');
        // Timeout: if not reacted -> screamer
        a.timer = setTimeout(() => {
            if (!state.running || !a.active) return;
            triggerScreamer('freddy', 'Ліхтарик... де ліхтарик?<br>Фредді вже поряд.');
        }, ANIMA_TIMEOUT_MS);
    }

    if (name === 'bonnie') {
        state.bonnieLock = true;
        $(`#bonnie-warning`).show();
        addLog('BONNIE: НЕ МІНЯЙ ЗАПОБІЖНИКИ!', 'warn');
        // Bonnie deactivates on its own after timeout (if you survived)
        a.timer = setTimeout(() => {
            if (!state.running) return;
            deactivateAnimatronic('bonnie', true);
        }, ANIMA_TIMEOUT_MS);
    }

    if (name === 'foxy') {
        $(`#btn-foxy`).prop('disabled', false);
        addLog('FOXY: біжить! ⚡ Стріляй шокером!', 'warn');
        a.timer = setTimeout(() => {
            if (!state.running || !a.active) return;
            triggerScreamer('foxy', 'Шокер не встиг...<br>Фоксі занадто швидкий.');
        }, ANIMA_TIMEOUT_MS);
    }
}

function deactivateAnimatronic(name, survived) {
    const a = state.animatronics[name];
    clearTimeout(a.timer);
    a.active = false;

    $(`#cell-${name}`).removeClass(`cell-active-${name}`);
    $(`#status-${name}`).text(survived ? 'RETREATED' : 'DORMANT').css('color', survived ? '#39ff14' : '#3a3020');

    if (name === 'freddy') $(`#btn-freddy`).prop('disabled', true);
    if (name === 'foxy') $(`#btn-foxy`).prop('disabled', true);
    if (name === 'bonnie') {
        state.bonnieLock = false;
        $(`#bonnie-warning`).hide();
    }

    if (survived) addLog(`${name.toUpperCase()}: відступив`, 'ok');

    // Cooldown
    a.onCooldown = true;
    a.cooldownTimer = setTimeout(() => {
        a.onCooldown = false;
        $(`#status-${name}`).text('DORMANT').css('color', '#3a3020');
    }, ANIMA_COOLDOWN);
}

// Flashlight button
function useFlashlight() {
    const a = state.animatronics.freddy;
    if (!a.active) return;

    if (state.tools.flashlight.charge < 10) {
        addLog('Ліхтарик майже розряджений!', 'fail');
        return;
    }

    // Use charge
    state.tools.flashlight.charge = Math.max(0, state.tools.flashlight.charge - 18);

    // Flashlight also drains flashlight fuse slot (cam1 slightly)
    state.slots['cam1'].health = Math.max(0, state.slots['cam1'].health - 8);
    updateSlotUI(state.slots['cam1']);
    addLog('FREDDY: відігнав ліхтариком ✓', 'ok');

    deactivateAnimatronic('freddy', true);
    updateToolGauges();
}

// Shocker button
function useShocker() {
    const a = state.animatronics.foxy;
    if (!a.active) return;

    if (state.tools.shocker.charge < 10) {
        addLog('Шокер розряджений!', 'fail');
        triggerScreamer('foxy', 'Шокер порожній.<br>Фоксі не зупинити.');
        return;
    }

    state.tools.shocker.charge = Math.max(0, state.tools.shocker.charge - 22);

    // Foxy: all cams drop
    ['cam1', 'cam2', 'cam3'].forEach(id => {
        state.slots[id].health = Math.max(0, state.slots[id].health - 10);
        updateSlotUI(state.slots[id]);
    });
    addLog('FOXY: зупинений шокером ⚡', 'ok');
    addLog('CAM: камери просіли від шоку', 'warn');

    deactivateAnimatronic('foxy', true);
    updateToolGauges();
}

// ========================= SCREAMER =========================
function triggerScreamer(who, reason) {
    if (!state.running) return;
    stopAll();

    // Flash red
    $('#flicker-light').css('background', 'rgba(255,0,0,0.3)');

    const face = SCREAMERS[who] || '👁';
    $('#screamer-face').text(face);
    $('#screamer-overlay').addClass('active');

    // Play screamer for 1.8s then show gameover
    setTimeout(() => {
        $('#screamer-overlay').removeClass('active');
        $('#flicker-light').css('background', 'rgba(0,0,0,0)');
        triggerGameOver(reason || 'Аніматронік дістався тебе.');
    }, 1800);
}

// ========================= GAME OVER / WIN =========================
function triggerGameOver(reason) {
    stopAll();
    if (state.score > record) {
        record = state.score;
        updateRecordDisplay();
    }
    $('#final-score').text(state.score);
    $('#gameover-reason').html(reason);
    $('#gameover-record').text(record > 0 ? record : '—');
    $('#gameover-overlay').addClass('active');
}

function gameWin() {
    stopAll();
    if (state.score > record) {
        record = state.score;
        updateRecordDisplay();
    }
    $('#win-score').text(state.score);
    $('#win-record').text(record > 0 ? record : '—');
    $('#win-overlay').addClass('active');
}

function updateRecordDisplay() {
    const r = record > 0 ? record : '—';
    $('#record-val').text(r);
    $('#menu-record').text(r);
}

// ========================= RESET ANIMATRONIC UI =========================
function resetAnimatronicUI() {
    ['freddy', 'bonnie', 'foxy'].forEach(name => {
        $(`#cell-${name}`).removeClass(`cell-active-${name}`);
        $(`#status-${name}`).text('DORMANT').css('color', '#3a3020');
    });
    $(`#btn-freddy`).prop('disabled', true);
    $(`#btn-foxy`).prop('disabled', true);
    $(`#bonnie-warning`).hide();
    $('body').removeClass('bonnie-danger');
}

// ========================= LOG =========================
function addLog(msg, type) {
    const now = new Date();
    const t = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    $('#log-entries').prepend(`<div class="log-entry ${type || ''}">[${t}] ${msg}</div>`);
    const all = $('#log-entries .log-entry');
    if (all.length > 22) all.last().remove();
}

// ========================= ATMOSPHERE =========================
function scheduleAtmo() {
    const delay = 7000 + Math.random() * 12000;
    state.atmoTimeout = setTimeout(() => {
        if (!state.running) return;
        typeAtmo(ATMO_MESSAGES[Math.floor(Math.random() * ATMO_MESSAGES.length)]);
        scheduleAtmo();
    }, delay);
}

function typeAtmo(text) {
    const $b = $('#atmo-text'); $b.text(''); let i = 0;
    const t = setInterval(() => { $b.text(text.slice(0, ++i)); if (i >= text.length) clearInterval(t); }, 45);
}

// ========================= AMBIENT FLICKER =========================
function scheduleFlicker() {
    const delay = 5000 + Math.random() * 15000;
    state.flickerTimeout = setTimeout(() => {
        if (!state.running) return;
        doFlicker();
        scheduleFlicker();
    }, delay);
}

function doFlicker() {
    const seq = [60, 120, 60, 200, 80, 140];
    let t = 0;
    seq.forEach((dur, i) => {
        setTimeout(() => {
            const on = i % 2 === 0;
            $('#flicker-light').css('background', on
                ? `rgba(255,180,30,${0.04 + Math.random() * 0.04})`
                : 'rgba(0,0,0,0.0)');
        }, t);
        t += dur;
    });
    setTimeout(() => $('#flicker-light').css('background', 'rgba(0,0,0,0.0)'), t + 100);
}

// ========================= NOISE =========================
function initNoise() {
    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    function drawNoise() {
        const w = canvas.width, h = canvas.height, img = ctx.createImageData(w, h), d = img.data;
        for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
        ctx.putImageData(img, 0, 0);
        requestAnimationFrame(drawNoise);
    }
    drawNoise();
}

// ========================= STOP ALL =========================
function stopAll() {
    state.running = false;
    clearInterval(state.timerInterval);
    clearInterval(state.tickInterval);
    clearTimeout(state.atmoTimeout);
    clearTimeout(state.flickerTimeout);
    clearTimeout(state.anima_schedTimer);
    ['freddy', 'bonnie', 'foxy'].forEach(name => {
        clearTimeout(state.animatronics[name].timer);
        clearTimeout(state.animatronics[name].cooldownTimer);
    });
}

// ========================= BOOT =========================
function bootGame() {
    $('#menu-screen').hide();
    $('#game-screen').show();
    initState();
    buildPanel();
    updateRecordDisplay();
    addLog('Система запущена', 'ok');
    addLog('Аніматроніки активні...', 'warn');
    typeAtmo('Система аварійного живлення — АКТИВНА...');
    startGame();
}

function restartGame() {
    $('.overlay').removeClass('active');
    $('#flicker-light').css('background', 'rgba(0,0,0,0.0)');
    // Clear all animatronic timers
    ['freddy', 'bonnie', 'foxy'].forEach(name => {
        clearTimeout(state.animatronics?.[name]?.timer);
        clearTimeout(state.animatronics?.[name]?.cooldownTimer);
    });
    initState();
    buildPanel();
    updateRecordDisplay();
    addLog('--- ПЕРЕЗАПУСК ---', 'warn');
    addLog('Ланцюги перевірено', 'ok');
    typeAtmo('Перезапуск системи...');
    startGame();
}

// ========================= ENTRY =========================
$(function () {
    initNoise();
    updateRecordDisplay();

    $('#start-btn').on('click', bootGame);
    $('#restart-btn, #win-restart-btn').on('click', restartGame);
    $('#btn-freddy').on('click', useFlashlight);
    $('#btn-foxy').on('click', useShocker);
});