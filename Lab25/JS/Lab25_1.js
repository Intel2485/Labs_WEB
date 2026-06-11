document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.draggable');

    // --- ІМІТАЦІЯ ЖИВОГО ТЕРМІНАЛУ ---
    const terminal = document.getElementById('terminalOutput');
    const logs = [
        "> Встановлення з'єднання з сервером VIKI...",
        "> З'єднання встановлено. Пінг: 12мс.",
        "> Запит досьє: Спунер, Дел. Авторизація...",
        "> Доступ підтверджено.",
        "> Аналіз систем охолодження NS-5... Норма.",
        "> Перевірка протоколів безпеки... Три закони активні.",
        "> ПОПЕРЕДЖЕННЯ: Виявлено аномалію в секторі 4."
    ];
    
    let logIndex = 0;
    
    function addLog() {
        if (logIndex < logs.length && terminal) {
            const line = document.createElement('p');
            line.className = 'terminal-line';
            line.innerText = logs[logIndex];
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight; // Автоскрол вниз
            logIndex++;
            setTimeout(addLog, Math.random() * 1500 + 500); // Випадкова затримка
        }
    }
    setTimeout(addLog, 1000);

    // --- ДИНАМІЧНА ТЕМПЕРАТУРА ---
    const tempDisplay = document.getElementById('cpuTemp');
    if(tempDisplay) {
        setInterval(() => {
            // Генеруємо випадкову температуру від 42 до 48
            const newTemp = Math.floor(Math.random() * (48 - 42 + 1)) + 42;
            tempDisplay.innerText = newTemp + '°C';
        }, 3000);
    }

    panels.forEach(panel => {
        let isDragging = false;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Початкова позиція встановлюється в CSS (top/left), тому offset дорівнює 0
        panel.style.transform = `translate3d(0px, 0px, 0)`;

        panel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        // Підтримка для сенсорних екранів
        panel.addEventListener('touchstart', dragStart, {passive: false});
        document.addEventListener('touchmove', dragMove, {passive: false});
        document.addEventListener('touchend', dragEnd);

        function dragStart(e) {
            // Щоб кнопки і зображення не запускали перетягування
            if(e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'img') {
                return; 
            }

            // Перевіряємо чи клік був саме по панелі або її дочірнім елементам
            if (!panel.contains(e.target)) return;

            const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

            // Запам'ятовуємо де саме схопили панель відносно її поточної позиції
            initialX = clientX - xOffset;
            initialY = clientY - yOffset;

            isDragging = true;
            panel.classList.add('dragging');
            
            // Переносимо активну панель на передній план
            panels.forEach(p => p.style.zIndex = 1);
            panel.style.zIndex = 100;
        }

        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

            xOffset = clientX - initialX;
            yOffset = clientY - initialY;

            panel.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        }

        function dragEnd() {
            // Просто завершуємо drag — xOffset/yOffset вже правильно збережені
            isDragging = false;
            panel.classList.remove('dragging');
        }
    });
});