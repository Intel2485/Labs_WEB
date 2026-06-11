let selectedTask = 1;
const totalTasks = 11;

const output = document.getElementById('output');
const taskLabel = document.getElementById('current-task');
const knobNum = document.getElementById('knobNum');
const userInput = document.getElementById('userInput');
const noiseLayer = document.getElementById('noiseLayer');
const knob = document.getElementById('knob');
const execBtn = document.getElementById('execBtn');

const hints = {
    1: "Введіть 1 число (секунди)", 2: "Введіть 2 числа (сторона, кути)",
    3: "Введіть 1 число", 4: "Введіть 3 числа",
    5: "Введіть 3 числа (n, x, y)", 6: "Введіть розмір масиву",
    7: "Введіть 'run' для матриці", 8: "Напр: 10, 5, +",
    9: "Введіть 1 число", 10: "Елементи через кому", 11: "Елементи через кому"
};

const ledRing = document.getElementById('ledRing');
const totalArc = 240;
const startAngle = -120
const angleStep = totalArc / (totalTasks - 1);
const leds = [];

for (let i = 0; i < totalTasks; i++) {
    let led = document.createElement('div');
    led.className = 'led';
    
    let radius = 65; 
    let currentAngle = startAngle + (i * angleStep);
    let trigAngle = (currentAngle - 90) * (Math.PI / 180); 
    
    let x = Math.cos(trigAngle) * radius;
    let y = Math.sin(trigAngle) * radius;
    
    led.style.transform = `translate(${x}px, ${y}px)`;
    ledRing.appendChild(led);
    leds.push(led);
}

function printLog(text) {
    output.innerHTML += `<div>${text}</div>`;
    output.scrollTop = output.scrollHeight;
}


knob.addEventListener('click', () => {
    selectedTask = selectedTask >= totalTasks ? 1 : selectedTask + 1;
    updateUI();
});

function updateUI() {
    let taskStr = selectedTask.toString().padStart(2, '0');
    knobNum.innerText = taskStr;
    taskLabel.innerText = `MODULE ${taskStr}`;
    userInput.disabled = false;
    userInput.placeholder = hints[selectedTask];
    userInput.value = "";
    userInput.focus();
    printLog(`> Завантажено модуль [Завдання ${selectedTask}]. Очікування вводу...`);

    let currentRotation = startAngle + ((selectedTask - 1) * angleStep);
    knob.style.transform = `rotate(${currentRotation}deg)`;
    
    leds.forEach((led, index) => {
        led.classList.toggle('active', index === selectedTask - 1);
    });
}

function suggestAlternative(argsCount) {
    if (argsCount === 1) return "Спробуйте модулі 1, 3, 6, 9.";
    if (argsCount === 2) return "Спробуйте модуль 2.";
    return "Перевірте аргументи.";
}

function executeTask() {
    let rawData = userInput.value.trim();
    if (rawData === "" && selectedTask !== 7) {
        printLog("<span style='color:#ff5555'>> SYS_ERR: Відсутні дані.</span>");
        return;
    }

    let args = rawData.split(',').map(item => item.trim());
    printLog(`> EXECUTING MOD_${selectedTask} [${args}]...`);
    
    noiseLayer.classList.add('active');
    userInput.disabled = true;

    setTimeout(() => {
        noiseLayer.classList.remove('active');
        userInput.disabled = false;
        userInput.value = "";
        userInput.focus();

        try {
            switch (selectedTask) {
                case 1:
                    if (args.length !== 1 || isNaN(args[0])) throw new Error(suggestAlternative(args.length));
                    printLog(`> Результат: ${Number(args[0]) % 60} сек.`);
                    break;
                case 2:
                    if (args.length !== 2 || args.some(isNaN)) throw new Error(suggestAlternative(args.length));
                    printLog(`> Периметр: ${Number(args[0]) * Number(args[1])}`);
                    break;
                case 3:
                    if (args.length !== 1 || isNaN(args[0])) throw new Error(suggestAlternative(args.length));
                    for (let i = 1; i <= Number(args[0]); i++) {
                        let res = (i % 15 === 0) ? "fizzbuzz" : (i % 3 === 0) ? "fizz" : (i % 5 === 0) ? "buzz" : i;
                        printLog(`> ${res}`);
                    }
                    break;
                case 4:
                    if (args.length !== 3 || args.some(isNaN)) throw new Error(suggestAlternative(args.length));
                    let avg = (Number(args[0]) + Number(args[1]) + Number(args[2])) / 3;
                    printLog(`> Середнє: ${avg.toFixed(2)}`);
                    break;
                case 5:
                    if (args.length !== 3 || args.some(isNaN)) throw new Error(suggestAlternative(args.length));
                    let n = Number(args[0]), x = Number(args[1]), y = Number(args[2]);
                    printLog(`> Статус: ${(n % x === 0 && n % y === 0) ? "TRUE" : "FALSE"}`);
                    break;
                case 6:
                    if (args.length !== 1 || isNaN(args[0])) throw new Error(suggestAlternative(args.length));
                    let arr = Array.from({length: Number(args[0])}, () => Math.floor(Math.random() * 100));
                    
                    let sum = arr.reduce((a, b) => a + b, 0);
                    let avgArr = (sum / arr.length).toFixed(2);
                    let odds = arr.filter(n => n % 2 !== 0);
                    
                    printLog(`> Масив: [${arr.join(', ')}]<br>> Max: ${Math.max(...arr)} | Min: ${Math.min(...arr)}<br>> Сума: ${sum} | Середнє: ${avgArr}<br>> Непарні: [${odds.join(', ')}]`);
                    break;
                case 7:
                    printLog("> Матриця 5x5:");
                    for(let i=0; i<5; i++) {
                        let row = Array.from({length: 5}, () => Math.floor(Math.random() * 21) - 10);
                        if (row[i] < 0) row[i] = 0; else if (row[i] > 0) row[i] = 1;
                        printLog(`> [ ${row.join(', ')} ]`);
                    }
                    break;
                case 8:
                    if (args.length !== 3) throw new Error("Формат: 10, 5, +");
                    let a = Number(args[0]), b = Number(args[1]), op = args[2];
                    let calc = (op === '+') ? a+b : (op === '-') ? a-b : (op === '*') ? a*b : (op === '/' && b !== 0) ? a/b : "ERR";
                    printLog(`> Результат: ${calc}`);
                    break;
                case 9:
                    if (args.length !== 1 || isNaN(args[0])) throw new Error(suggestAlternative(args.length));
                    let num = Number(args[0]);
                    let isPrime = num > 1;
                    for (let i = 2; i <= Math.sqrt(num); i++) if (num % i === 0) isPrime = false;
                    printLog(`> Знак: ${num > 0 ? "+" : (num < 0 ? "-" : "0")}<br>> Просте: ${isPrime}<br>> Ділиться на: [${[2,3,5,6,9].filter(d => num % d === 0)}]`);
                    break;
                case 10:
                    let revSq = args.map(x => {
                        let parsed = Number(x);
                        return (!isNaN(parsed) && x !== '') ? parsed * parsed : x;
                    }).reverse();
                    printLog(`> Вивід: [${revSq.join(', ')}]`);
                    break;
                case 11:
                    let cleanArgs = args.filter(item => item !== "");
                    printLog(`> Унікальні: [${[...new Set(cleanArgs)].join(', ')}]`);
                    break;
            }
        } catch (err) {
            printLog(`<span style='color:#ff5555'>> SYS_ERR: ${err.message}</span>`);
        }
    }, 600);
}

execBtn.addEventListener('click', executeTask);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") executeTask(); });

updateUI();