const dict = {
    ua: {
        langQ: "Виберіть мову 'ua' або 'en'?",
        langErr: "Неправильний ввід!\nБудь ласка, введіть 'ua' або 'en'.",
        dayQ: "Введіть номер дня тижня (від 1 до 7)?",
        dayErr: "Неправильний ввід!\nВведіть число від 1 до 7.",
        resLabel: "Результат:",
        days: ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"]
    },
    en: {
        langQ: "Select language 'ua' or 'en'?",
        langErr: "Invalid input!\nPlease enter 'ua' or 'en'.",
        dayQ: "Enter the day number of the week (from 1 to 7)?",
        dayErr: "Invalid input!\nEnter a number from 1 to 7.",
        resLabel: "Result:",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    }
};

function uiPrompt(message, isAlert = false) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customModal');
        const textEl = document.getElementById('modalText');
        const inputEl = document.getElementById('modalInput');
        const submitBtn = document.getElementById('modalSubmit');

        textEl.innerText = message;
        modal.classList.remove('hidden');

        if (isAlert) {
            inputEl.style.display = 'none';
            submitBtn.innerText = 'Зрозуміло';
            submitBtn.style.background = '#ff4757';
        } else {
            inputEl.style.display = 'block';
            inputEl.value = '';
            inputEl.focus();
            submitBtn.innerText = 'Підтвердити';
            submitBtn.style.background = '#2ed573';
        }

        const handleSubmit = () => {
            const val = inputEl.value.trim();
            modal.classList.add('hidden');
            submitBtn.removeEventListener('click', handleSubmit);
            resolve(isAlert ? null : val);
        };

        submitBtn.addEventListener('click', handleSubmit);
        inputEl.onkeypress = (e) => { if (e.key === 'Enter') handleSubmit(); };
    });
}

async function startCalendarApp() {
    let selectedLang = "";
    
    while (true) {
        let input = await uiPrompt(dict.ua.langQ + "\n\n" + dict.en.langQ);
        if (input !== null) {
            let norm = input.toLowerCase();
            if (norm === "ua" || norm === "en") {
                selectedLang = norm;
                break;
            }
        }
        await uiPrompt(dict.ua.langErr + "\n\n" + dict.en.langErr, true);
    }

    const currentDict = dict[selectedLang];
    let selectedDay = 0;

    while (true) {
        let input = await uiPrompt(currentDict.dayQ);
        if (input !== null) {
            let dayNum = parseInt(input, 10);
            if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 7) {
                selectedDay = dayNum;
                break;
            }
        }
        await uiPrompt(currentDict.dayErr, true);
    }

    const finalDay = currentDict.days[selectedDay - 1];
    document.getElementById('resultLabel').innerText = currentDict.resLabel;
    document.getElementById('resultValue').innerText = finalDay;
    
    document.getElementById('calMonth').innerText = selectedLang.toUpperCase();
    document.getElementById('calYear').innerText = `DAY ${selectedDay}`;
}

document.getElementById('startBtn').addEventListener('click', startCalendarApp);