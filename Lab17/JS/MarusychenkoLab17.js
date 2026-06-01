let balance = 1000;
let currentBetTotal = 0;
let bankChips = { 500: 0, 100: 0, 50: 0, 25: 0, 10: 0, 5: 0 };
let placedBets = {};
let isSpinning = false;

const wheelOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const denominations = [500, 100, 50, 25, 10, 5];

// ==========================================
// 1. АНАЛОГОВИЙ ГОДИННИК ТА ПАСХАЛКА
// ==========================================
function updateClock() {
    const now = new Date();
    $('#sec-hand').css('transform', `translateX(-50%) rotate(${(now.getSeconds() / 60) * 360}deg)`);
    $('#min-hand').css('transform', `translateX(-50%) rotate(${((now.getMinutes() / 60) * 360) + ((now.getSeconds() / 60) * 6)}deg)`);
    $('#hour-hand').css('transform', `translateX(-50%) rotate(${((now.getHours() / 12) * 360) + ((now.getMinutes() / 60) * 30)}deg)`);
}
setInterval(updateClock, 1000); updateClock();

let clockClickCount = 0;
$('#analog-clock').on('click', function () {
    clockClickCount++;
    const now = new Date();
    const days = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'];
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    const dateStr = `${now.toLocaleTimeString('uk-UA')}, ${days[now.getDay()]} , ${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()} року`;

    if (clockClickCount >= (Math.floor(Math.random() * 3) + 3)) {
        if (balance <= 0) {
            alert(`Час: ${dateStr}\n\nЗлодюжка заліз до вас у кишеню, але побачив, що там порожньо, і зі сльозами пішов геть. 😂`);
        } else {
            const stolen = Math.floor(Math.random() * 100) + 25;
            let actualStolen = Math.min(balance, stolen);
            balance -= actualStolen;
            autoConvertBalanceToChips(balance);
            renderBankStacks();
            alert(`Час: ${dateStr}\n\nОБЕРЕЖНО! Хтось поцупив у вас $${actualStolen} з банку!\nНе відволікайтесь.`);
        }
        clockClickCount = 0;
    } else {
        alert(`Поточний час: ${dateStr}\n\nПорада: Краще стежте за столом.`);
    }
});

// ==========================================
// 2. РОЗУМНИЙ ФІЗИЧНИЙ БАНК ТА ОБМІН
// ==========================================
function autoConvertBalanceToChips(amount) {
    bankChips = { 500: 0, 100: 0, 50: 0, 25: 0, 10: 0, 5: 0 };
    let temp = amount;

    let starterPack = [100, 50, 25, 10, 5];
    starterPack.forEach(val => {
        if (temp >= val * 3) { bankChips[val] += 3; temp -= val * 3; }
    });

    denominations.forEach(val => {
        let count = Math.floor(temp / val);
        bankChips[val] += count;
        temp -= count * val;
    });
}

const spinSound = new Audio('../SOUND/roulette-wheel-throw-1.mp3');
spinSound.loop = true;

function renderBankStacks() {
    $('#balance-amount').text(balance);
    $('#current-bet-amount').text(currentBetTotal);

    denominations.forEach(value => {
        const tower = $(`#tower-${value}`);
        tower.empty();

        let count = bankChips[value] || 0;
        let visualCount = count > 8 ? 8 : count;

        for (let i = 0; i < visualCount; i++) {
            let chip = $(`<div class="chip chip-${value}" data-value="${value}">${value}</div>`);
            chip.css('bottom', `${i * 5}px`);
            tower.append(chip);
        }

        let topChip = tower.find('.chip').last();
        if (topChip.length) {
            topChip.draggable({
                helper: 'clone', appendTo: 'body', revert: 'invalid', cursorAt: { top: 28, left: 28 },
                start: function (e, ui) {
                    if (isSpinning) return false;
                    $(this).addClass('chip-dragging-original');
                    ui.helper.css({ 'transform': 'scale(0.9)', 'box-shadow': '0 10px 20px rgba(0,0,0,0.8)' });
                },
                stop: function () { $(this).removeClass('chip-dragging-original'); }
            });
        }
    });
}

function addWinToBank(amount) {
    let temp = amount;
    denominations.forEach(val => {
        let count = Math.floor(temp / val);
        bankChips[val] += count;
        temp -= count * val;
    });
}

$('#exchange-zone').droppable({
    accept: '.chip:not(.mini-chip)',
    hoverClass: 'ui-droppable-hover',
    drop: function (e, ui) {
        let val = ui.draggable.data('value');
        bankChips[val]--;
        if (val === 500) { bankChips[100] += 5; }
        else if (val === 100) { bankChips[50] += 2; }
        else if (val === 50) { bankChips[25] += 2; }
        else if (val === 25) { bankChips[10] += 2; bankChips[5] += 1; }
        else if (val === 10) { bankChips[5] += 2; }
        else { bankChips[val]++; alert("Цю фішку вже не розміняти!"); }
        renderBankStacks();
    }
});

// ==========================================
// 3. ГЕНЕРАЦІЯ РУЛЕТКИ ТА СТОЛУ
// ==========================================
const sectorAngle = 360 / 37;
wheelOrder.forEach((num, index) => {
    let color = (num === 0) ? '#008a1a' : (redNumbers.includes(num) ? '#cc0000' : '#1c1c1c');
    let sector = $(`<div class="wheel-sector">${num}</div>`).css({
        'background-color': color,
        'transform': `translateX(-50%) rotate(${index * sectorAngle}deg)`
    });
    $('#wheel').append(sector);
});

const tableNumbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
function buildBoard() {
    const board = $('#betting-board');
    board.append(`<div class="cell zero" data-bet="0">0</div>`);
    tableNumbers.forEach((num, index) => {
        let colorClass = redNumbers.includes(num) ? 'red' : 'black';
        board.append(`<div class="cell ${colorClass}" style="grid-row:${Math.floor(index / 12) + 1}; grid-column:${(index % 12) + 2};" data-bet="${num}">${num}</div>`);
    });
    for (let i = 3; i >= 1; i--) board.append(`<div class="cell col" style="grid-row:${4 - i}; grid-column:14;" data-bet="col${i}">2to1</div>`);
    board.append(`<div class="cell doz" style="grid-row:4; grid-column: 2 / span 4;" data-bet="doz1">1st 12</div>`);
    board.append(`<div class="cell doz" style="grid-row:4; grid-column: 6 / span 4;" data-bet="doz2">2nd 12</div>`);
    board.append(`<div class="cell doz" style="grid-row:4; grid-column: 10 / span 4;" data-bet="doz3">3rd 12</div>`);
    board.append(`<div class="cell out" style="grid-row:5; grid-column: 2 / span 2;" data-bet="low">1-18</div>`);
    board.append(`<div class="cell out" style="grid-row:5; grid-column: 4 / span 2;" data-bet="even">EVEN</div>`);
    board.append(`<div class="cell out red" style="grid-row:5; grid-column: 6 / span 2;" data-bet="red">RED</div>`);
    board.append(`<div class="cell out black" style="grid-row:5; grid-column: 8 / span 2;" data-bet="black">BLACK</div>`);
    board.append(`<div class="cell out" style="grid-row:5; grid-column: 10 / span 2;" data-bet="odd">ODD</div>`);
    board.append(`<div class="cell out" style="grid-row:5; grid-column: 12 / span 2;" data-bet="high">19-36</div>`);
}
buildBoard();

// ==========================================
// 4. СТАВКИ ТА ПЕРЕМІЩЕННЯ ФІШОК
// ==========================================
$('.cell').droppable({
    accept: '.chip, .mini-chip',
    hoverClass: 'ui-droppable-hover',
    drop: function (e, ui) {
        let cell = $(this);
        let betType = cell.data('bet');

        
        if (ui.draggable.hasClass('mini-chip')) {
            let oldBetType = ui.draggable.data('bet-type');
            let val = ui.draggable.data('value');

            placedBets[oldBetType] -= val;
            if (!placedBets[betType]) placedBets[betType] = 0;
            placedBets[betType] += val;

            ui.draggable.data('bet-type', betType);
            let offsetX = Math.random() * 20 - 10;
            let offsetY = Math.random() * 20 - 10;
            ui.draggable.css({ top: `calc(50% + ${offsetY}px)`, left: `calc(50% + ${offsetX}px)` });
            cell.append(ui.draggable);
        }
        
        else {
            let val = ui.draggable.data('value');
            if (bankChips[val] > 0) {
                bankChips[val]--;
                balance -= val;
                currentBetTotal += val;
                if (!placedBets[betType]) placedBets[betType] = 0;
                placedBets[betType] += val;

                let miniChip = $(`<div class="mini-chip chip-${val}" data-value="${val}" data-bet-type="${betType}">${val}</div>`);
                let offsetX = Math.random() * 20 - 10;
                let offsetY = Math.random() * 20 - 10;
                miniChip.css({ top: `calc(50% + ${offsetY}px)`, left: `calc(50% + ${offsetX}px)`, transform: 'translate(-50%, -50%)' });

                
                miniChip.draggable({
                    revert: 'invalid',
                    zIndex: 10000,
                    appendTo: 'body',
                    helper: 'clone',
                    cursorAt: { top: 17, left: 17 },
                    start: function (e, ui) {
                        if (isSpinning) return false;
                        $(this).addClass('chip-dragging-original');
                        ui.helper.css({ 'transform': 'none' });
                    },
                    stop: function () { $(this).removeClass('chip-dragging-original'); }
                });

                cell.append(miniChip);
                renderBankStacks();
            }
        }
    }
});

$('#chips-vault').droppable({
    accept: '.mini-chip',
    hoverClass: 'ui-droppable-hover',
    drop: function (e, ui) {
        let val = ui.draggable.data('value');
        let betType = ui.draggable.data('bet-type');

        placedBets[betType] -= val;
        balance += val;
        currentBetTotal -= val;
        bankChips[val]++;

        ui.draggable.remove();
        renderBankStacks();
    }
});

// ==========================================
// 5. ІДЕАЛЬНА ФІЗИКА КУЛЬКИ
// ==========================================
let currentWheelRot = 0;

$('#spin-wheel-btn').on('click', function () {
    if (currentBetTotal === 0) { alert("Будь ласка, зробіть ставку на столі!"); return; }
    spinSound.currentTime = 0;
    spinSound.play();

    isSpinning = true; $(this).prop('disabled', true); $('#ball').show();

    const winningNumber = Math.floor(Math.random() * 37);
    const winIndex = wheelOrder.indexOf(winningNumber);

    let startTime = performance.now();
    let duration = 6000;

    let wStart = currentWheelRot;
    let wEnd = currentWheelRot + (360 * 4) + Math.floor(Math.random() * 360);
    let bStart = 0;
    let bEnd = -(360 * 6) + (wEnd + (winIndex * sectorAngle));

    function animatePhysics(time) {
        let elapsed = time - startTime;
        let progress = Math.min(elapsed / duration, 1);
        let ease = 1 - Math.pow(1 - progress, 3);

        let wCurrent = wStart + (wEnd - wStart) * ease;
        let bCurrent = bStart + (bEnd - bStart) * ease;

        $('#wheel').css('transform', `rotate(${wCurrent}deg)`);

        let radius = 200;
        if (progress > 0.6) {
            let dropProg = (progress - 0.6) / 0.4;
            radius = 200 - (60 * dropProg);
            if (dropProg < 0.9) {
                radius += Math.abs(Math.sin(dropProg * Math.PI * 10)) * 15 * (1 - dropProg);
            }
        }

        let rad = (bCurrent * Math.PI) / 180;
        let x = Math.sin(rad) * radius;
        let y = -Math.cos(rad) * radius;
        $('#ball').css('transform', `translate(-50%, -50%) translate(${x}px, ${y}px)`);

        if (progress < 1) {
            requestAnimationFrame(animatePhysics);
        } else {
            currentWheelRot = wCurrent % 360;
            setTimeout(() => { resolveBets(winningNumber); }, 500);
        }

    }
    requestAnimationFrame(animatePhysics);
});

// ==========================================
// 6. ПРАВИЛЬНА МАТЕМАТИКА ВИГРАШІВ
// ==========================================
function resolveBets(winningNumber) {

    spinSound.pause();

    let winAmount = 0;
    let winningColor = (winningNumber === 0) ? 'green' : (redNumbers.includes(winningNumber) ? 'red' : 'black');

    for (let bet in placedBets) {
        let amt = placedBets[bet];
        if (amt <= 0) continue;

        if (bet == winningNumber) winAmount += amt * 36;
        else if (bet === 'red' && winningColor === 'red') winAmount += amt * 2;
        else if (bet === 'black' && winningColor === 'black') winAmount += amt * 2;
        else if (bet === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) winAmount += amt * 2;
        else if (bet === 'odd' && winningNumber !== 0 && winningNumber % 2 !== 0) winAmount += amt * 2;
        else if (bet === 'low' && winningNumber >= 1 && winningNumber <= 18) winAmount += amt * 2;
        else if (bet === 'high' && winningNumber >= 19 && winningNumber <= 36) winAmount += amt * 2;
        else if (bet === 'doz1' && winningNumber >= 1 && winningNumber <= 12) winAmount += amt * 3;
        else if (bet === 'doz2' && winningNumber >= 13 && winningNumber <= 24) winAmount += amt * 3;
        else if (bet === 'doz3' && winningNumber >= 25 && winningNumber <= 36) winAmount += amt * 3;
        else if (bet === 'col1' && winningNumber !== 0 && winningNumber % 3 === 1) winAmount += amt * 3;
        else if (bet === 'col2' && winningNumber !== 0 && winningNumber % 3 === 2) winAmount += amt * 3;
        else if (bet === 'col3' && winningNumber !== 0 && winningNumber % 3 === 0) winAmount += amt * 3;
    }

    if (winAmount > 0) {
        balance += winAmount;
        addWinToBank(winAmount);

        triggerWinAnimation(winAmount, function () {
            showCustomModal("БІНГО!", `На рулетці випало: <strong>${winningNumber} (${winningColor})</strong>.<br>Виграш: <span style="color:#2ecc71;">$${winAmount}</span>`);
        });

    } else {
        showCustomModal("Програш", `Випало: <strong>${winningNumber} (${winningColor})</strong>.<br>Ваші фішки забирає дилер.`);
    }

    currentBetTotal = 0; placedBets = {};
    $('.mini-chip').remove();
    $('#spin-wheel-btn').prop('disabled', false);
    isSpinning = false;
    renderBankStacks();
}

function triggerWinAnimation(winAmount, callback) {
    let gifSrc = "";
    let winText = "";

    if (winAmount >= 1 && winAmount <= 100) {
        gifSrc = "../IMG/оценивание-кот-смотрит-в-камеру.gif";
        winText = "ХОРОШИЙ СТАРТ!";
    } else if (winAmount >= 101 && winAmount <= 250) {
        gifSrc = "../IMG/066afe9b1a5f91c5a53f2ee9727db846.gif";
        winText = "ЧУДОВИЙ ВИГРАШ!";
    } else if (winAmount >= 251 && winAmount <= 500) {
        gifSrc = "../IMG/1712938956-533290-mellstroy-1.gif";
        winText = "СУПЕР ВИГРАШ!";
    } else if (winAmount >= 501 && winAmount <= 1000) {
        gifSrc = "../IMG/cd2f34ae6f5975f49a779c8e5a34f82a.gif";
        winText = "МЕГА ВИГРАШ!";
    } else if (winAmount >= 1001 && winAmount <= 2500) {
        gifSrc = "../IMG/32.gif";
        winText = "ЕПІЧНИЙ ВИГРАШ!";
    } else if (winAmount >= 2501) {
        gifSrc = "../IMG/Gates-of-Olympus.gif";
        winText = "ДЖЕКПОТ!!!";
    }

    $('#win-animation-gif').attr('src', gifSrc);
    $('#win-animation-text').text(winText + ' +$' + winAmount);

    $('#win-animation-overlay').css('display', 'flex').hide().fadeIn(400);

    setTimeout(() => {
        $('#win-animation-overlay').fadeOut(500, function () {
            $('#win-animation-gif').attr('src', '');
            if (callback) callback();
        });
    }, 3500);
}

function showCustomModal(title, text) {
    $('#modal-title').html(title); $('#modal-text').html(text);
    $('#custom-modal').fadeIn();
}
$('#modal-ok-btn').on('click', function () { $('#custom-modal').fadeOut(); });

autoConvertBalanceToChips(balance);
renderBankStacks();