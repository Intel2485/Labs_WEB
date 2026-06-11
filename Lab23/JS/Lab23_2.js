class PowerPlant {
    constructor(id, name, baseGen, price, maxDurability, maxPop) {
        this.id = id; this.name = name; this.level = 1;
        this.baseGen = baseGen;
        this.generation = baseGen; this.price = price;
        this.durability = maxDurability; this.maxDurability = maxDurability;
        this.maxPop = maxPop;
        this.isBroken = false;
    }
}

const SHOP_CATALOG = [
    { id: "solar_1", name: "Сонячна Панель", gen: 5, price: 800, dur: 45, maxPop: 2, req: null },
    { id: "wind_1", name: "Вітряк", gen: 15, price: 3000, dur: 60, maxPop: 5, req: { type: 'day', val: 5, desc: "Прожити 5 днів" } },
    { id: "biogas_1", name: "Біогазова Ст.", gen: 25, price: 7500, dur: 70, maxPop: 10, req: { type: 'houses', val: 30, desc: "Місто на 30+ будинків" } },
    { id: "geo_1", name: "Геотермальна Ст.", gen: 45, price: 18000, dur: 90, maxPop: 18, req: { type: 'money', val: 15000, desc: "Накопичити $15,000" } },
    { id: "waste_1", name: "Сміттєспалювальна", gen: 70, price: 35000, dur: 85, maxPop: 25, req: { type: 'gen', val: 100, desc: "Генерація 100+ МВт" } },
    { id: "gas_1", name: "Газова ТЕЦ", gen: 110, price: 75000, dur: 100, maxPop: 45, req: { type: 'bank', val: 1500, desc: "Енергобанк 1500+ МВт" } },
    { id: "hydro_1", name: "ГЕС", gen: 200, price: 180000, dur: 200, maxPop: 80, req: { type: 'houses', val: 100, desc: "Місто на 100+ будинків" } },
    { id: "solar_tower", name: "Сонячна Вежа", gen: 350, price: 400000, dur: 120, maxPop: 150, req: { type: 'money', val: 200000, desc: "Накопичити $200,000" } },
    { id: "nuclear_mini", name: "Міні-АЕС (SMR)", gen: 600, price: 900000, dur: 300, maxPop: 250, req: { type: 'gen', val: 600, desc: "Генерація 600+ МВт" } },
    { id: "nuclear_full", name: "Сучасна АЕС", gen: 1500, price: 2500000, dur: 500, maxPop: 600, req: { type: 'bank', val: 15000, desc: "Енергобанк 15,000 МВт" } }
];

class CitySimulator {
    constructor() {
        this.day = 1;
        this.money = 2500;
        this.storedEnergy = 0;

        this.baseCitySize = 20;
        this.houses = 20;

        this.blackoutDays = 0;
        this.marketCap = 0;

        this.masteredTechs = new Set(["coal_1", "solar_1"]);
        this.unlockedTechs = new Set(["solar_1"]);

        this.sellPrice = 80;
        this.buyPrice = 300;
        this.eventMsg = "Звичайний день";
        this.consumptionModifier = 1.0;

        this.maxSlots = 15;
        this.slots = new Array(this.maxSlots).fill(null);
        this.slots[0] = new PowerPlant("coal_1", "Стара Вугільна ТЕЦ", 25, 0, 30, 10);

        this.generateDailyEvent();
        this.checkUnlocks();
    }

    get maxCapacity() {
        let cap = Math.floor(this.baseCitySize);
        for (let s of this.slots) { if (s && !s.isBroken) cap += s.maxPop; }
        return cap;
    }

    get currentConsumption() {
        return Math.max(1, Math.round(this.houses * this.consumptionModifier));
    }

    generateDailyEvent() {
        let roll = Math.random() * 100;
        if (roll < 5) {
            this.eventMsg = "🎄 Новий Рік! Гірлянди всюди!";
            this.consumptionModifier = 1.35;
        } else if (roll < 10) {
            this.eventMsg = "🏖️ Сезон відпусток. Місто порожнє.";
            this.consumptionModifier = 0.5;
        } else if (roll < 20) {
            this.eventMsg = "❄️ Аномальні морози. Усі гріються!";
            this.consumptionModifier = 1.25;
        } else if (roll < 30) {
            this.eventMsg = "🔥 Пекельна спека. Кондиціонери!";
            this.consumptionModifier = 1.15;
        } else {
            this.eventMsg = "Звичайний день";
            this.consumptionModifier = 0.9 + (Math.random() * 0.2);
        }

        this.buyPrice = Math.max(150, Math.floor(400 - (this.houses * 0.3)));
        let baseSell = Math.max(30, Math.floor(120 - (this.houses * 0.1)));
        if (this.consumptionModifier > 1.1) baseSell = Math.floor(baseSell * 1.5);
        this.sellPrice = baseSell;

        this.marketCap = Math.max(5, Math.floor(this.houses * (0.5 + Math.random())));
        if (this.consumptionModifier > 1.1) this.marketCap = Math.floor(this.marketCap * 1.5);
    }

    checkUnlocks() {
        let gen = this.slots.reduce((sum, s) => sum + (s && !s.isBroken ? s.generation : 0), 0);
        SHOP_CATALOG.forEach(item => {
            if (this.unlockedTechs.has(item.id)) return;

            let isMet = false;
            if (!item.req) isMet = true;
            else {
                switch (item.req.type) {
                    case 'day': if (this.day >= item.req.val) isMet = true; break;
                    case 'houses': if (this.houses >= item.req.val) isMet = true; break;
                    case 'money': if (this.money >= item.req.val) isMet = true; break;
                    case 'gen': if (gen >= item.req.val) isMet = true; break;
                    case 'bank': if (this.storedEnergy >= item.req.val) isMet = true; break;
                }
            }
            if (isMet) {
                this.unlockedTechs.add(item.id);
                console.log(`🔓 РОЗБЛОКОВАНО: ${item.name}!`);
            }
        });
    }

    renderBoard() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        let counts = {};
        this.slots.forEach(s => { if (s && !s.isBroken) counts[s.id] = (counts[s.id] || 0) + 1; });

        for (let i = 0; i < this.maxSlots; i++) {
            const slotData = this.slots[i];
            const slotDiv = document.createElement('div');

            if (slotData) {
                slotDiv.className = `slot occupied ${slotData.isBroken ? 'broken-slot' : ''}`;
                if (slotData.isBroken) {
                    slotDiv.innerHTML = `
                        <h4>${slotData.name} <span style="color:#ef4444">(ЗЛАМАНО)</span></h4>
                        <div class="slot-stats">
                            <p>⚡ Ген: <span class="text-red">0 МВт</span></p>
                            <p>🔧 Потребує ремонту!</p>
                        </div>
                        <div class="slot-actions">
                            <button class="slot-btn" style="background:#eab308; color:#000;" onclick="game.repairSlot(${i})">Ремонт ($${Math.floor(slotData.price * 0.3) || 200})</button>
                            <button class="slot-btn btn-del" onclick="game.demolishSlot(${i})">Знести</button>
                        </div>
                    `;
                } else {
                    let mergeBtn = '';
                    if (counts[slotData.id] >= 3) {
                        mergeBtn = `<button class="slot-btn" style="background:#a855f7; color:#fff;" onclick="game.mergeSlot(${i})" title="Злити 3 такі станції">Злити (3)</button>`;
                    }
                    let upgCost = slotData.level === 1 ? Math.floor(slotData.price * 0.25) : Math.floor(slotData.price * 0.60);
                    let upgBtn = slotData.level < 3
                        ? `<button class="slot-btn btn-upg" onclick="game.upgradeSlot(${i})">Up $${upgCost}</button>`
                        : `<button class="slot-btn" disabled style="background:#475569;">MAX</button>`;

                    slotDiv.innerHTML = `
                        <h4>${slotData.name} <span style="color:#eab308">(Lv.${slotData.level})</span></h4>
                        <div class="slot-stats">
                            <p>⚡ Ген: <span class="text-green">${slotData.generation} МВт</span></p>
                            <p>🔧 Стан: ${slotData.durability}/${slotData.maxDurability}</p>
                        </div>
                        <div class="slot-actions" style="flex-wrap: wrap;">
                            ${upgBtn}
                            ${mergeBtn}
                            <button class="slot-btn btn-del" onclick="game.demolishSlot(${i})">Знести</button>
                        </div>
                    `;
                }
            } else {
                slotDiv.className = `slot empty`;
                slotDiv.innerHTML = `<span class="slot-title">Вільна ділянка</span>`;
            }
            board.appendChild(slotDiv);
        }
    }

    renderShop() {
        const shopContainer = document.getElementById('shop-container');
        shopContainer.innerHTML = '';
        SHOP_CATALOG.forEach(item => {
            const isLocked = !this.unlockedTechs.has(item.id);
            const card = document.createElement('div');
            card.className = `shop-card ${isLocked ? 'locked' : ''}`;

            let btnHtml = isLocked
                ? `<button class="btn-buy" disabled>🔒 ${item.req.desc}</button>`
                : `<button class="btn-buy" onclick="game.buyStation('${item.id}')">Купити $${item.price}</button>`;

            card.innerHTML = `
                <h4>${item.name}</h4>
                <p>⚡ Ген: ${item.gen} МВт | 🏠 Ліміт: +${item.maxPop}</p>
                <p>🔧 Міцність: ${item.dur} дн.</p>
                ${btnHtml}
            `;
            shopContainer.appendChild(card);
        });
    }

    upgradeSlot(index) {
        let slot = this.slots[index];
        if (!slot || slot.isBroken || slot.level >= 3) return;
        let cost = slot.level === 1 ? Math.floor(slot.price * 0.25) : Math.floor(slot.price * 0.60);
        let genBoost = Math.ceil(slot.baseGen * 0.40);

        if (this.money >= cost) {
            this.money -= cost;
            slot.level++;
            slot.generation += genBoost;
            slot.durability = slot.maxDurability;
            this.checkUnlocks();
            this.updateUI();
            this.renderBoard();
        } else { alert(`Недостатньо грошей! Потрібно $${cost}`); }
    }

    mergeSlot(index) {
        let slot = this.slots[index];
        if (!slot) return;
        let currentIndex = SHOP_CATALOG.findIndex(item => item.id === slot.id);
        if (currentIndex === -1 || currentIndex === SHOP_CATALOG.length - 1) return;

        let nextTier = SHOP_CATALOG[currentIndex + 1];
        if (!this.masteredTechs.has(nextTier.id)) {
            alert(`Ви ще не засвоїли технологію "${nextTier.name}"! Купіть її в магазині хоча б 1 раз.`);
            return;
        }

        if (confirm(`Злити 3x "${slot.name}" у 1x "${nextTier.name}"?\nУвага: всі попередні апгрейди скинуться!`)) {
            let removed = 0;
            for (let i = 0; i < this.maxSlots; i++) {
                if (this.slots[i] && this.slots[i].id === slot.id && !this.slots[i].isBroken && removed < 3) {
                    this.slots[i] = null;
                    removed++;
                }
            }
            this.slots[index] = new PowerPlant(nextTier.id, nextTier.name, nextTier.gen, nextTier.price, nextTier.dur, nextTier.maxPop);
            this.checkUnlocks();
            this.updateUI();
            this.renderBoard();
        }
    }

    buyStation(stationId) {
        const item = SHOP_CATALOG.find(s => s.id === stationId);
        if (!item || !this.unlockedTechs.has(item.id)) return;
        const emptyIndex = this.slots.findIndex(s => s === null);
        if (emptyIndex === -1) { alert("Немає вільних ділянок!"); return; }

        if (this.money >= item.price) {
            this.money -= item.price;
            this.masteredTechs.add(item.id);
            this.slots[emptyIndex] = new PowerPlant(item.id, item.name, item.gen, item.price, item.dur, item.maxPop);
            this.checkUnlocks();
            this.updateUI();
            this.renderBoard();
        } else { alert(`Недостатньо коштів! Потрібно $${item.price}`); }
    }

    sellEnergy() {
        if (this.storedEnergy <= 0) { alert("Енергобанк порожній!"); return; }
        if (this.marketCap <= 0) { alert("Ринок перенасичений! Сусіди більше не купують."); return; }

        let maxCanSell = Math.min(this.storedEnergy, this.marketCap);
        let amount = prompt(`На складі: ${this.storedEnergy} МВт.\nБіржа готова купити: до ${this.marketCap} МВт.\nСкільки продати? (Ціна: $${this.sellPrice})`);
        amount = parseInt(amount);

        if (isNaN(amount) || amount <= 0) return;
        if (amount > maxCanSell) {
            alert(`Ви не можете продати більше ${maxCanSell} МВт сьогодні!`);
            amount = maxCanSell;
        }

        let profit = amount * this.sellPrice;
        this.storedEnergy -= amount;
        this.marketCap -= amount;
        this.money += profit;
        this.checkUnlocks();
        this.updateUI();
    }

    repairSlot(index) {
        let slot = this.slots[index];
        let cost = Math.floor(slot.price * 0.3) || 200;
        if (this.money >= cost) {
            this.money -= cost;
            slot.durability = slot.maxDurability;
            slot.isBroken = false;
            this.checkUnlocks();
            this.updateUI();
            this.renderBoard();
        } else { alert(`Недостатньо грошей! Потрібно $${cost}`); }
    }

    demolishSlot(index) {
        if (confirm("Знести цю станцію?")) {
            this.slots[index] = null;
            this.updateUI();
            this.renderBoard();
        }
    }

    async nextTurn() {
        const btn = document.getElementById('btn-next-turn');
        btn.disabled = true;

        let totalGeneration = 0;
        let brokenStations = [];

        this.baseCitySize += Math.max(1, this.baseCitySize * 0.02);

        if (this.houses < this.maxCapacity) {
            let freeSpace = this.maxCapacity - this.houses;
            let growth = Math.max(1, Math.ceil(freeSpace * 0.15));
            this.houses = Math.min(this.maxCapacity, this.houses + growth);
        } else if (this.houses > this.maxCapacity) {
            let overcrowding = this.houses - this.maxCapacity;
            let exodus = Math.max(1, Math.ceil(overcrowding * 0.15));
            this.houses -= exodus;
        }

        for (let i = 0; i < this.maxSlots; i++) {
            if (this.slots[i] && !this.slots[i].isBroken) {
                totalGeneration += this.slots[i].generation;
                this.slots[i].durability--;

                if (this.slots[i].durability <= 0) {
                    this.slots[i].isBroken = true;
                    brokenStations.push(this.slots[i].name);
                }
            }
        }

        let consumption = this.currentConsumption;
        let dailyBalance = totalGeneration - consumption;
        let financeMsg = "";

        if (dailyBalance > 0) {
            this.storedEnergy += dailyBalance;
            this.blackoutDays = 0;
            financeMsg = `<span class="text-green">Енергію збережено: +${dailyBalance} МВт</span>`;
        } else if (dailyBalance < 0) {
            let deficit = Math.abs(dailyBalance);
            if (this.storedEnergy >= deficit) {
                this.storedEnergy -= deficit;
                this.blackoutDays = 0;
                financeMsg = `<span class="text-blue">Дефіцит покрито зі складу: -${deficit} МВт</span>`;
            } else {
                let unpowered = deficit - this.storedEnergy;
                this.storedEnergy = 0;
                this.blackoutDays++;
                financeMsg = `<span class="text-red">БЛЕКАУТ! Місто без світла (День ${this.blackoutDays}/3)</span>`;
            }
        } else {
            this.blackoutDays = 0;
            financeMsg = `<span class="text-blue">Ідеальний баланс (0 МВт)</span>`;
        }

        await this.showNightAnimation(this.day, dailyBalance, financeMsg, brokenStations);

        this.day++;
        this.generateDailyEvent();

        if (this.blackoutDays > 3) {
            alert("💀 БУНТ У МІСТІ! Ви залишили людей без світла на 3 дні. Мера скинуто!");
            location.reload(); return;
        }

        this.checkUnlocks();
        this.updateUI();
        this.renderBoard();
        this.renderShop();
        btn.disabled = false;
    }

    showNightAnimation(currentDay, balance, financeMsg, broken) {
        return new Promise(resolve => {
            const overlay = document.getElementById('night-overlay');
            const title = document.getElementById('night-title');
            const balText = document.getElementById('night-balance');
            const finText = document.getElementById('night-finance');

            title.innerText = `Ніч ${currentDay}-го дня...`;
            let balColor = balance >= 0 ? "text-green" : "text-red";
            balText.innerHTML = `Денний баланс: <span class="${balColor}">${balance > 0 ? '+' : ''}${balance} МВт</span>`;
            let brokenMsg = broken.length > 0 ? `<br><span style="color:#ef4444;">🚨 ЗЛАМАЛАСЯ СТАНЦІЯ: ${broken.join(', ')}</span>` : '';
            finText.innerHTML = `${financeMsg} ${brokenMsg}`;

            overlay.classList.remove('hidden');
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(resolve, 800);
            }, 2500);
        });
    }

    updateUI() {
        document.getElementById('ui-day').innerText = this.day;
        document.getElementById('ui-event').innerText = this.eventMsg;
        document.getElementById('ui-money').innerText = Math.floor(this.money);
        document.getElementById('ui-houses').innerText = `${this.houses} / ${this.maxCapacity}`;

        let gen = this.slots.reduce((sum, s) => sum + (s && !s.isBroken ? s.generation : 0), 0);
        let cons = this.currentConsumption;
        let net = gen - cons;

        document.getElementById('ui-grid-stats').innerHTML = `Ген: <span class="text-green">${gen}</span> | Спож: <span class="text-red">${cons}</span>`;
        let storedEl = document.getElementById('ui-stored');
        storedEl.innerHTML = `${this.storedEnergy} МВт <span style="font-size:12px; color:${net >= 0 ? '#22c55e' : '#ef4444'}">(${net > 0 ? '+' : ''}${net}/день)</span>`;

        // Відображення лімітів ринку
        document.getElementById('market-cap').innerText = `${this.marketCap} МВт`;
        document.getElementById('market-sell').innerText = `$${this.sellPrice} / 1 МВт`;
        document.getElementById('market-buy').innerText = `$${this.buyPrice} / 1 МВт`;

        const blackoutWarning = document.getElementById('blackout-warning');
        if (this.blackoutDays > 0) {
            blackoutWarning.style.display = 'flex';
            document.getElementById('ui-blackout').innerText = `${this.blackoutDays}/3`;
        } else { blackoutWarning.style.display = 'none'; }
    }
}

const game = new CitySimulator();
game.renderBoard();
game.renderShop();
game.updateUI();

document.getElementById('btn-next-turn').addEventListener('click', () => game.nextTurn());