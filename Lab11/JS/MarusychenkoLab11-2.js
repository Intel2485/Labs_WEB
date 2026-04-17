document.addEventListener('DOMContentLoaded', () => {
    
    // Елементи перемикання брендів
    const intelBtn = document.getElementById('intel');
    const amdBtn = document.getElementById('amd');
    const intelModels = document.getElementById('intel_models');
    const amdModels = document.getElementById('amd_models');
    const cpuImg = document.getElementById('cpu_img');

    const nvidiaBtn = document.getElementById('nvidia');
    const radeonBtn = document.getElementById('radeon');
    const nvidiaModels = document.getElementById('nvidia_models');
    const radeonModels = document.getElementById('radeon_models');
    const gpuImg = document.getElementById('gpu_img');

    // Логіка перемикання CPU
    function toggleCpu() {
        if (intelBtn.checked) {
            intelModels.classList.remove('hidden');
            amdModels.classList.add('hidden');
            cpuImg.style.opacity = 0;
            setTimeout(() => { cpuImg.src = '../img/Intel.webp'; cpuImg.style.opacity = 1; }, 200);
        } else {
            amdModels.classList.remove('hidden');
            intelModels.classList.add('hidden');
            cpuImg.style.opacity = 0;
            setTimeout(() => { cpuImg.src = '../img/amd.webp'; cpuImg.style.opacity = 1; }, 200);
        }
    }
    intelBtn.addEventListener('change', toggleCpu);
    amdBtn.addEventListener('change', toggleCpu);

    // Логіка перемикання GPU
    function toggleGpu() {
        if (nvidiaBtn.checked) {
            nvidiaModels.classList.remove('hidden');
            radeonModels.classList.add('hidden');
            gpuImg.style.opacity = 0;
            setTimeout(() => { gpuImg.src = '../img/nvidia.png'; gpuImg.style.opacity = 1; }, 200);
        } else {
            radeonModels.classList.remove('hidden');
            nvidiaModels.classList.add('hidden');
            gpuImg.style.opacity = 0;
            setTimeout(() => { gpuImg.src = '../img/Radeon.png'; gpuImg.style.opacity = 1; }, 200);
        }
    }
    nvidiaBtn.addEventListener('change', toggleGpu);
    radeonBtn.addEventListener('change', toggleGpu);

    // --- ОНОВЛЕННЯ ЖИВОГО ЧЕКУ (SUMMARY) ---
    const form = document.getElementById('pcForm');
    const summaryList = document.getElementById('summary_list');
    const totalSumEl = document.getElementById('total_sum');

    function updateSummary() {
        summaryList.innerHTML = ''; // Очищаємо список
        let totalSum = 0;

        // Функція для додавання рядка в чек
        function addLineItem(name, price) {
            if (!name) return;
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span> <span>${price} ₴</span>`;
            summaryList.appendChild(li);
            totalSum += parseInt(price);
        }

        // Беремо вибраний CPU
        const selectedCpu = document.querySelector('input[name="cpu"]:checked');
        if (selectedCpu && !selectedCpu.closest('.hidden')) {
            addLineItem(selectedCpu.value, selectedCpu.dataset.price);
        }

        // Беремо вибраний GPU
        const selectedGpu = document.querySelector('input[name="gpu"]:checked');
        if (selectedGpu && !selectedGpu.closest('.hidden')) {
            addLineItem(selectedGpu.value, selectedGpu.dataset.price);
        }

        // Беремо Материнську плату
        const mb = document.getElementById('motherboard');
        const mbOption = mb.options[mb.selectedIndex];
        addLineItem('Материнська плата', mbOption.dataset.price);

        // Беремо ОЗП
        const ram = document.getElementById('ram');
        const ramOption = ram.options[ram.selectedIndex];
        addLineItem('ОЗП ' + ramOption.value.split(' ')[0], ramOption.dataset.price);

        // Беремо всі відмічені накопичувачі
        const storages = document.querySelectorAll('input[name="storage"]:checked');
        storages.forEach(st => {
            addLineItem(st.value, st.dataset.price);
        });

        // Оновлюємо загальну суму з пробілами тисяч
        totalSumEl.textContent = totalSum.toLocaleString('uk-UA');
    }

    // Вішаємо слухача на всю форму: будь-яка зміна оновлює чек
    form.addEventListener('change', updateSummary);
    
    // Ініціалізуємо чек при завантаженні
    updateSummary();

    // Обробник події очищення форми
    form.addEventListener('reset', () => {
        // Використовуємо setTimeout з нульовою затримкою. 
        // Це потрібно, щоб дати браузеру мить на фактичне відновлення 
        // стандартних значень HTML перед тим, як ми почнемо їх зчитувати.
        setTimeout(() => {
            toggleCpu();     // Відновлюємо відображення моделей і лого Intel
            toggleGpu();     // Відновлюємо відображення моделей і лого NVIDIA
            updateSummary(); // Перераховуємо чек та загальну суму
        }, 0);
    });
    
    // Перехоплення відправки форми
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = document.getElementById('client_name').value;
        const total = totalSumEl.textContent;
        alert(`Дякуємо, ${clientName}! Ваше замовлення на суму ${total} ₴ успішно сформовано. Дані передані на обробку.`);
    });
});