document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const btn = document.querySelector('.mono-btn');
    const select = document.getElementById('productSelect');
    
    // Скрипт для вибору кількох елементів без клавіші Ctrl
    select.onmousedown = function(e) {
        e.preventDefault(); // Скасовуємо стандартну поведінку браузера

        const scroll = this.scrollTop; // Зберігаємо позицію прокрутки
        e.target.selected = !e.target.selected; // Перемикаємо стан елемента
        
        setTimeout(() => {
            this.scrollTop = scroll; // Повертаємо прокрутку назад
        }, 0);

        // Викликаємо оновлення (якщо у нас є функція підрахунку суми)
        const event = new Event('change', { bubbles: true });
        this.dispatchEvent(event);
    };

    // Функція для налаштування лічильника (щоб не писати код двічі)
    function setupCounter(inputId, counterId) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        if (!input || !counter) return;

        const maxLength = input.getAttribute('maxlength');

        input.addEventListener('input', () => {
            const currentLength = input.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;

            if (currentLength >= maxLength) {
                counter.classList.add('limit-reached');
                counter.textContent = `Максимум: ${maxLength}!`;
            } else {
                counter.classList.remove('limit-reached');
            }
        });
    }

    // Запускаємо лічильники для обох полів
    setupCounter('bank_account', 'char_counter_bank');
    setupCounter('user_id_input', 'char_counter_user');

    form.addEventListener('submit', () => {
        btn.textContent = 'Обробка...';
        btn.style.opacity = '0.7';
    });
});