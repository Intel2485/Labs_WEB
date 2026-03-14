        // КНОПКА
const button = document.getElementById('soundButton');
const buttonSound = new Audio('../Songs/vBOY.mp3');
button.addEventListener('click', function() {
  buttonSound.play(); 
});
       // Звуки попадання
const crewVoices = [
  { file: '../Songs/bronja-ne-probita.mp3', chance: 15 },
  { file: '../Songs/probitie-2.mp3', chance: 40 },
  { file: '../Songs/probitie1.mp3',  chance: 35 },
  { file: '../Songs/rikoshet1.mp3',  chance: 10 }
];

      // Відсоткові рулетка
function getVoiceByChance() {
  const randomNum = Math.random() * 100; // Генеруємо випадкове число від 0 до 100
  let cumulativeChance = 0;

  for (let i = 0; i < crewVoices.length; i++) {
    cumulativeChance += crewVoices[i].chance; // Додаємо відсотки один до одного
    
    // Якщо випадкове число потрапило в межі цього відсоткаі
    if (randomNum <= cumulativeChance) {
      return crewVoices[i].file; 
    }
  }
}
        // Знаходимо всі картинки танків
const tankImages = document.querySelectorAll('.tank-img');

        // Чи заряджена гармата? 
let isGunLoaded = false;

tankImages.forEach(function(tank) {
  
        // Індивідуальна пам'ять танка
  let clickCount = 0;        
  let isDestroyed = false;   

        // Наведення
  tank.addEventListener('mouseenter', function() {
    
        // Якщо танк знищено або гармата заряджена — ігноруємо
    if (isDestroyed || isGunLoaded) {
      return; 
    }

        // Перше заряджання 
    const loadSound = new Audio('load.mp3'); 
    loadSound.play();
    isGunLoaded = true; 
  });


        // Постріл
  tank.addEventListener('click', function() {
    
       // Якщо танк знищено або гармата розряджена — стріляти не можна!
    if (isDestroyed || !isGunLoaded) {
      return; 
    }

        // Робимо постріл: гармата тепер розряджена
    isGunLoaded = false; 
    clickCount++; 

       // Звук пострілу
    const shotSound = new Audio('../Songs/vistrel.mp3');
    shotSound.play();

      // Перевіряємо, чи танк знищено
    if (clickCount === 6) {
      
      isDestroyed = true;
      
      setTimeout(function() {
        const destroySound = new Audio('../Songs/tank-unichtozhen.mp3');
        destroySound.play();
      }, 2000);
      
    } else {
      
      // Якщо танк ще живий екіпаж коментує влучання через 2 сек.
      setTimeout(function() {
      // Викликаємо нашу нову функцію, яка враховує відсотки
       const selectedFile = getVoiceByChance(); 
        // Створюємо і граємо обраний звук
       const voice = new Audio(selectedFile);
       voice.play();
      }, 2000);
      
      // Через 1 секунду після пострілу гармата заряджається сама
      setTimeout(function() {
        // Перевіряємо, чи вона ще не зарядилась
        if (!isGunLoaded) {
          const loadSound = new Audio('../Songs/perezariadkа.mp3');
          loadSound.play();
          isGunLoaded = true; // Гармата заряджена
        }
      }, 1000);
      
    }
  });

});