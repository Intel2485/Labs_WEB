$(document).ready(function() {
    // --- ЗМІННІ ГРАВЦЯ ---
    let player = { x: 0, z: 0, rotY: 0 };
    const speed = 15;
    const rotSpeed = 3;
    let keys = {};
    let fuses = 0;
    let isFlashlightOn = true;

    // --- ШТУЧНИЙ ІНТЕЛЕКТ ФРЕДДІ ---
    let freddyState = 0; 
    let freddyPatience = 0; 

    setInterval(() => {
        // Якщо відкрита лаба чи щиток - Фредді чекає, даємо гравцю пограти
        if (!$('#fuse-box-minigame').hasClass('hidden') || !$('#main-power-panel').hasClass('hidden')) return;

        if (freddyState === 0 && Math.random() > 0.8) {
            freddyState = 1; 
        } 
        else if (freddyState === 1 && Math.random() > 0.5) {
            freddyState = 2; 
            $('#freddy').addClass('at-door');
        }
        else if (freddyState === 2) {
            freddyPatience++;
            if (freddyPatience > 5) { // 5 секунд на реакцію
                $('#jumpscare-screen').removeClass('hidden');
                setTimeout(() => { alert("ВИ ПОМЕРЛИ."); location.reload(); }, 1500);
            }
        }
    }, 1000); 

    // Відлякування Фредді ліхтариком (Спрощено і працює ідеально!)
    setInterval(() => {
        if (isFlashlightOn && freddyState === 2) {
            // Фредді відразу лякається світла
            freddyState = 0;
            freddyPatience = 0;
            $('#freddy').removeClass('at-door');
            
            // Пишемо гравцю, що він молодець
            $('#flashlight-status').text('Ліхтарик: УВІМК (ФРЕДДІ ВТІК!)').css('color', '#0ff');
            setTimeout(() => {
                if(isFlashlightOn) $('#flashlight-status').text('Ліхтарик: УВІМК').css('color', '#0f0');
            }, 2000);
        }
    }, 200); 

    // --- КЕРУВАННЯ ТА ФІЗИКА ---
    $(document).keydown(e => keys[e.code] = true);
    $(document).keyup(e => keys[e.code] = false);

    function updatePhysics() {
        if (keys['KeyQ'] || keys['ArrowLeft']) player.rotY -= rotSpeed;
        if (keys['KeyE'] || keys['ArrowRight']) player.rotY += rotSpeed;

        let rad = player.rotY * (Math.PI / 180);
        
        if (keys['KeyW'] || keys['ArrowUp']) { player.x += Math.sin(rad) * speed; player.z += Math.cos(rad) * speed; }
        if (keys['KeyS'] || keys['ArrowDown']) { player.x -= Math.sin(rad) * speed; player.z -= Math.cos(rad) * speed; }
        if (keys['KeyA']) { player.x += Math.cos(rad) * speed; player.z -= Math.sin(rad) * speed; }
        if (keys['KeyD']) { player.x -= Math.cos(rad) * speed; player.z += Math.sin(rad) * speed; }

        player.x = Math.max(-850, Math.min(850, player.x));
        player.z = Math.max(-850, Math.min(850, player.z));

        $('#world').css('transform', `translateZ(600px) rotateY(${-player.rotY}deg) translateX(${-player.x}px) translateZ(${-player.z}px)`);
        requestAnimationFrame(updatePhysics);
    }
    updatePhysics();

    // --- ЛІХТАРИК ---
    $(document).mousemove(function(e) {
        if (!isFlashlightOn) return;
        let x = (e.clientX / window.innerWidth) * 100;
        let y = (e.clientY / window.innerHeight) * 100;
        $('#flashlight-overlay').css('background', `radial-gradient(circle 25vw at ${x}% ${y}%, transparent 0%, rgba(0,0,0,0.85) 80%)`);
    });

    $(document).keydown(function(e) {
        if (e.code === 'Space') {
            isFlashlightOn = !isFlashlightOn;
            if (!isFlashlightOn) {
                $('#flashlight-overlay').addClass('flashlight-off');
                $('#flashlight-status').text('Ліхтарик: ВИМК').css('color', 'red');
            } else {
                $('#flashlight-overlay').removeClass('flashlight-off');
                $('#flashlight-status').text('Ліхтарик: УВІМК').css('color', '#0f0');
            }
        }
    });

    // --- СИСТЕМА ШАФОК ---
    const cabinetPositions = [
        {x: -700, z: -300}, {x: 700, z: -300}, {x: -700, z: 300}, 
        {x: 700, z: 300}, {x: -300, z: 700}, {x: 300, z: 700}
    ];

    cabinetPositions.forEach((pos, index) => {
        let cab = $(`<div class="cabinet" id="cab-${index}">ШАФКА</div>`);
        // Y = 150px щоб стояли на підлозі
        cab.css('transform', `translateX(${pos.x}px) translateZ(${pos.z}px) translateY(150px)`);
        $('#cabinets-container').append(cab);
    });

    function spawnFuses() {
        $('.cabinet').removeClass('has-fuse');
        let randomCabs = [];
        while(randomCabs.length < 2) {
            let r = Math.floor(Math.random() * cabinetPositions.length);
            if(randomCabs.indexOf(r) === -1) randomCabs.push(r);
        }
        randomCabs.forEach(id => $(`#cab-${id}`).addClass('has-fuse'));
    }
    spawnFuses();

    $(document).on('click', '.cabinet', function() {
        if ($(this).hasClass('has-fuse')) {
            alert("Ви знайшли запобіжник!");
            fuses++;
            $('#fuses-count').text(`Запобіжники: ${fuses}`);
            $(this).removeClass('has-fuse'); 
        } else {
            alert("Тут порожньо...");
        }
    });

    // --- ПАНЕЛЬ СИСТЕМ ТА МІНІ-ГРА ---
    let systems = {
        main: { health: 100, category: 'office' },
        cam1: { health: 100, category: 'animal' }, // Тварини (API підтримує animal)
        cam2: { health: 100, category: 'insect' }, // Комахи
        cam3: { health: 100, category: 'fish' },   // Риби
        flash: { health: 100, category: 'flashlight' }
    };
    let systemToFix = null;
    let currentCategory = 'animal'; 

    setInterval(() => {
        Object.keys(systems).forEach(key => {
            let sys = systems[key];
            if (sys.health > 0) sys.health -= Math.floor(Math.random() * 5); 
            
            let light = $(`.meter[data-sys="${key}"] .status-light`);
            light.removeClass('green yellow red dead');
            if (sys.health > 70) light.addClass('green');
            else if (sys.health > 30) light.addClass('yellow');
            else if (sys.health > 0) light.addClass('red');
            else light.addClass('dead');
        });
    }, 2000);

    $(document).on('click', '#fuse-box', function() {
        $('#main-power-panel').removeClass('hidden');
        isFlashlightOn = false; $('#flashlight-overlay').addClass('flashlight-off');
    });

    $('.close-btn').click(function() {
        $('#main-power-panel').addClass('hidden');
        $('#fuse-box-minigame').addClass('hidden');
    });

    $('.meter').click(function() {
        let sysKey = $(this).data('sys');
        if (systems[sysKey].health <= 0) { 
            if (fuses > 0) {
                systemToFix = sysKey;
                currentCategory = systems[sysKey].category; 
                $('#main-power-panel').addClass('hidden');
                $('#fuse-box-minigame').removeClass('hidden'); 
                generateMinigame();
            } else {
                alert("У вас немає запобіжників! Шукайте в шафках.");
            }
        } else {
            alert(`Система працює стабільно (${systems[sysKey].health}%).`);
        }
    });

    function generateMinigame() {
        const grid = $('#grid-5x5');
        grid.empty();
        let pool = [];
        
        while(pool.length < 25) {
            let r = Math.floor(Math.random() * 100) + 1;
            if(pool.indexOf(r) === -1) pool.push(r);
        }

        pool.forEach(id => {
            // API автоматично тягне фотографії тварин/комах/риб з інтернету!
            let imgUrl = `https://loremflickr.com/100/100/${currentCategory}?lock=${id}`;
            grid.append(`
                <div class="grid-cell droppable-cell" data-id="${id}">
                    <img src="${imgUrl}" draggable="false">
                </div>
            `);
        });

        const targetId = pool[Math.floor(Math.random() * pool.length)];
        let targetImgUrl = `https://loremflickr.com/100/100/${currentCategory}?lock=${targetId}`;
        
        $('#current-target').html(`
            <div id="draggable-fuse" data-id="${targetId}">
                <img src="${targetImgUrl}" draggable="false">
            </div>
        `);

        $('#draggable-fuse').draggable({ revert: "invalid", containment: ".minigame-layout", zIndex: 1000 });

        $('.droppable-cell').droppable({
            accept: "#draggable-fuse",
            drop: function(event, ui) {
                if (ui.draggable.data('id') === $(this).data('id')) {
                    fuses--; 
                    $('#fuses-count').text(`Запобіжники: ${fuses}`);
                    $('#fuse-box-minigame').addClass('hidden');
                    
                    if(systemToFix) systems[systemToFix].health = 100; // Система полагоджена!
                    alert("ЖИВЛЕННЯ ВІДНОВЛЕНО! Система стабілізована.");
                } else {
                    alert("ПОМИЛКА: Невірний контакт!");
                }
            }
        });
    }
});