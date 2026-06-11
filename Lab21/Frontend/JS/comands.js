document.getElementById('calcBtn').addEventListener('click', async () => {
    const numInput = document.getElementById('numberInput').value;
    const resultDiv = document.getElementById('result');

    if (numInput === '') {
        resultDiv.textContent = 'Введіть число перед натисканням!';
        resultDiv.style.color = '#ff5252';
        return;
    }

    resultDiv.textContent = 'Завантаження...';
    resultDiv.style.color = '#fff';

    try {
        const response = await fetch(`/api/square?number=${numInput}`);
        const data = await response.json();

        if (response.ok) {
            resultDiv.textContent = data.message;
            resultDiv.style.color = '#4caf50';

            resultDiv.style.opacity = '1';
        } else {
            resultDiv.textContent = 'Помилка: ' + data.error;
            resultDiv.style.color = '#ff5252';
            resultDiv.style.opacity = '1';
        }
    } catch (error) {
        resultDiv.textContent = 'Сервер недоступний';
        resultDiv.style.color = '#ff5252';
        resultDiv.style.opacity = '1';
    }
});