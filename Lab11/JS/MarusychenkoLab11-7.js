document.addEventListener('DOMContentLoaded', () => {
    // Логіка для чекбоксів з єдиним вибором ( occupation )
    const occupationChecks = document.querySelectorAll('input[name="job"]');

    occupationChecks.forEach(check => {
        check.addEventListener('change', function() {
            if (this.checked) {
                // Якщо цей чекбокс вибрано, знімаємо виділення з усіх інших
                occupationChecks.forEach(other => {
                    if (other !== this) other.checked = false;
                });
            }
        });
    });

    // Ефект для кнопки скидання
    const resetBtn = document.querySelector('.btn-steam-gray');
    resetBtn.addEventListener('click', () => {
        console.log("Дані очищено.");
    });
});