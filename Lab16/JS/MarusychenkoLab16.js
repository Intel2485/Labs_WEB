$(document).ready(function () {
    'use strict';

    // 1. РЕНДЕР КАРТОК
    Object.keys(GEMS_DATA).forEach(id => {
        if (!GEMS_DATA[id].isFusion) {
            $('#roster-grid').append(createCard(id));
        }
    });

    initDragAndDrop();

    function createCard(id) {
        const data = GEMS_DATA[id];
        const btnHtml = data.isFusion ? `<button class="unfuse-btn">Розформувати</button>` : '';
        return $(`
            <div class="gem-card" data-id="${id}" data-bases="${data.bases.join(',')}">
                <div class="gem-thumb" style="border-color:${data.color}; background-image:url('../IMG/${id}.png')"></div>
                <div class="gem-name">${data.name}</div>
                ${btnHtml}
            </div>
        `);
    }

    // 2. ІДЕАЛЬНИЙ DRAG & DROP
    function initDragAndDrop() {
        $('.gem-card:not(.ui-draggable)').draggable({
            helper: 'clone',
            appendTo: 'body',
            zIndex: 9999,
            revert: 'invalid',
            cursor: 'grabbing',
            cursorAt: { left: 55, top: 70 },
            start: function (event, ui) {
                $(this).css('opacity', '0.2');
                ui.helper.addClass('ui-draggable-clone-fix');
            },
            stop: function () {
                $(this).css('opacity', '1');
            }
        });
    }

    $('#fusion-temple').droppable({
        accept: '#roster-grid .gem-card',
        tolerance: 'pointer',
        drop: function (e, ui) { transferCard(ui.draggable, $('#stage-grid')); }
    });

    $('#roster-section').droppable({
        accept: '#stage-grid .gem-card',
        tolerance: 'pointer',
        drop: function (e, ui) { transferCard(ui.draggable, $('#roster-grid')); }
    });

    function transferCard($card, $target) {
        $card.hide().css({ position: '', top: '', left: '', opacity: '1' }).appendTo($target).fadeIn(300);
        $('#fuse-btn').prop('disabled', $('#stage-grid .gem-card').length < 2);
    }

    // 3. ЛОГІКА ЗЛИТТЯ
    $('#fuse-btn').click(function () {
        const $stageCards = $('#stage-grid .gem-card');
        const currentBases = $stageCards.map(function() { return $(this).attr('data-bases').split(','); }).get().flat();
        const fusionKey = [...new Set(currentBases)].sort().join(',');
        
        const resultId = Object.keys(GEMS_DATA).find(id => {
            return GEMS_DATA[id].isFusion && [...GEMS_DATA[id].bases].sort().join(',') === fusionKey;
        });

        $('body').css('pointer-events', 'none');

        if (resultId) {
            document.getElementById('sound-fusion')?.play().catch(()=>{});
            $stageCards.addClass('fusion-active');
            
            setTimeout(() => {
                $stageCards.remove();
                const $newFusion = createCard(resultId).hide();
                $('#stage-grid').append($newFusion);
                $newFusion.fadeIn(400);
                
                initDragAndDrop();
                $('#fuse-btn').prop('disabled', true);
                $('body').css('pointer-events', 'auto');
            }, 1000);
        } else {
            document.getElementById('sound-error')?.play().catch(()=>{});
            $stageCards.addClass('glitch-error');
            setTimeout(() => {
                $stageCards.removeClass('glitch-error');
                $('body').css('pointer-events', 'auto');
            }, 400);
        }
    });

    // 4. РОЗФОРМУВАННЯ
    $(document).on('click', '.unfuse-btn', function (e) {
        e.preventDefault();
        const $card = $(this).closest('.gem-card');
        const basesArray = ($card.attr('data-bases') || '').split(',');

        $card.fadeOut(300, () => {
            $card.remove();
            basesArray.forEach(baseId => {
                const $baseCard = createCard(baseId).hide();
                $('#roster-grid').append($baseCard);
                $baseCard.fadeIn(400);
            });
            initDragAndDrop();
            $('#fuse-btn').prop('disabled', $('#stage-grid .gem-card').length < 2);
        });
    });

    // Акуратна підказка для посилань (без ламання тексту)
    document.querySelectorAll('.archive-link').forEach(link => {
        const hoverHandler = function() {
            this.title = "Перейти до: " + this.href; // Створює лише системну підказку
            this.removeEventListener('mouseover', hoverHandler);
        };
        link.addEventListener('mouseover', hoverHandler);
    });

});