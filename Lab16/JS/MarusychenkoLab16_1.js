document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // Завдання 1.1: Три рисунки
    // Подія: onclick -> alert src
    // ==========================================
    const images = document.querySelectorAll('.task-img');
    
    images.forEach(img => {
        img.onclick = function() {
            alert('Джерело зображення (src): \n' + this.src);
        };
    });


    // ==========================================
    // Завдання 1.2, 1.3, 1.4: Три посилання
    // Подія: mouseover -> title, дописування href, removeEventListener
    // ==========================================
    const links = document.querySelectorAll('.task-link');
    
    links.forEach(link => {
        const hoverHandler = function() {
            // Завдання 1.2 (виведення в title)
            this.title = "Додано title: " + this.href;
            
            // Завдання 1.3 (дописування href у текст)
            this.textContent = `${this.textContent} (${this.href})`;
            
            // Завдання 1.4 (відв'язування події)
            this.removeEventListener('mouseover', hoverHandler);
        };
        
        link.addEventListener('mouseover', hoverHandler);
    });


    // ==========================================
    // Завдання 1.5: Текстове поле (Blur)
    // Подія: blur -> вивід тексту в абзац #demo
    // ==========================================
    const blurInput = document.querySelector('.task-input-blur');
    const demoText = document.getElementById('demo');
    
    if (blurInput && demoText) {
        blurInput.addEventListener('blur', function() {
            demoText.textContent = "Ви ввели: " + this.value;
        });
    }


    // ==========================================
    // Завдання 1.6: Текстове поле (Click)
    // Подія: click -> alert один раз
    // ==========================================
    const clickInput = document.querySelector('.task-input-click');
    
    if (clickInput) {
        const clickHandler = function() {
            alert("Подія click спрацювала!");
            this.removeEventListener('click', clickHandler);
        };
        
        clickInput.addEventListener('click', clickHandler);
    }


    // ==========================================
    // Завдання 1.8: Текстове поле (Валідація)
    // Подія: blur -> перевірка data-length
    // ==========================================
    const valInput = document.querySelector('.task-input-val');
    
    if (valInput) {
        valInput.addEventListener('blur', function() {
            const reqLength = parseInt(this.getAttribute('data-length'), 10);
            
            if (this.value.length === reqLength) {
                this.style.borderColor = '#2ecc71'; // Правильно - зелений
            } else {
                this.style.borderColor = '#e74c3c'; // Неправильно - червоний
            }
        });
    }


    // ==========================================
    // Завдання 1.7: Три параграфи з числами
    // Подія: click -> піднесення до квадрату
    // ==========================================
    const numberParagraphs = document.querySelectorAll('.task-number');
    
    numberParagraphs.forEach(p => {
        p.addEventListener('click', function() {
            let num = parseFloat(this.textContent);
            
            if (!isNaN(num)) {
                this.textContent = num * num;
            }
        });
    });


    // ==========================================
    // Завдання 2.1: Три елементи div
    // Подія: чергування кольору через removeEventListener
    // ==========================================
    const colorNodes = document.querySelectorAll('.task-node');
    
    colorNodes.forEach(node => {
        const paintPink = function() {
            this.style.backgroundColor = '#ff8cb2'; 
            this.removeEventListener('click', paintPink);
            this.addEventListener('click', paintBlue);
        };
        
        const paintBlue = function() {
            this.style.backgroundColor = '#74b9ff'; 
            this.removeEventListener('click', paintBlue);
            this.addEventListener('click', paintPink);
        };
        
        node.addEventListener('click', paintPink);
    });

});