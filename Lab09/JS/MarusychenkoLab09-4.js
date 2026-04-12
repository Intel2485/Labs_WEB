function makeMapResponsive() {
    const image = document.getElementById('carsImage');
    const map = document.querySelector('map[name="carsMap"]');
    const areas = map.getElementsByTagName('area');
    
    // Зберігаємо оригінальні координати при першому завантаженні
    if (!image.dataset.originalWidth) {
        image.dataset.originalWidth = image.naturalWidth;
        for (let area of areas) {
            area.dataset.originalCoords = area.getAttribute('coords');
        }
    }

    const ratio = image.offsetWidth / image.dataset.originalWidth;

    for (let area of areas) {
        const coords = area.dataset.originalCoords.split(',');
        const scaledCoords = coords.map(c => Math.round(parseInt(c) * ratio));
        area.setAttribute('coords', scaledCoords.join(','));
    }
}

// Запускаємо при завантаженні та при кожній зміні розміру вікна
window.addEventListener('load', makeMapResponsive);
window.addEventListener('resize', makeMapResponsive);

document.addEventListener("DOMContentLoaded", function() {
    const areas = document.querySelectorAll('area');
    const tooltip = document.getElementById('customTooltip');
    const ttTitle = document.getElementById('tt-title');
    const ttDesc = document.getElementById('tt-desc');

    areas.forEach(area => {
        // Коли мишка заходить на область машини
        area.addEventListener('mouseenter', function(e) {
            // Беремо дані з атрибутів
            const name = this.getAttribute('data-name');
            const history = this.getAttribute('data-history');
            const color = this.getAttribute('data-color');

            // Заповнюємо підказку текстом
            ttTitle.textContent = name;
            ttDesc.textContent = history;

            // Стилізуємо підказку кольором машини!
            tooltip.style.borderLeftColor = color;
            ttTitle.style.color = color;

            // Показуємо підказку
            tooltip.classList.add('active');
        });

        // Рух мишки в межах області
        area.addEventListener('mousemove', function(e) {
            // Зсуваємо підказку трохи вбік і вниз від курсора, щоб не перекривати клік
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        });

        // Коли мишка йде з машини
        area.addEventListener('mouseleave', function() {
            tooltip.classList.remove('active');
        });
    });
});