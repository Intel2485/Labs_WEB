import { setExpressionFromOCR } from './ui.js';
import { styles, applyStyles } from './styles.js';

export function openImageSelector() {
    const modal = document.createElement('div');
    applyStyles(modal, styles.choiceModal);

    const camBtn = document.createElement('button');
    camBtn.innerHTML = '<span>📸</span><span>Камера</span>';
    applyStyles(camBtn, styles.choiceBtn);
    camBtn.onclick = () => {
        document.body.removeChild(modal);
        startLiveCamera();
    };

    const galBtn = document.createElement('button');
    galBtn.innerHTML = '<span>🖼</span><span>Галерея</span>';
    applyStyles(galBtn, styles.choiceBtn);
    galBtn.onclick = () => {
        document.body.removeChild(modal);
        triggerFileInput();
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖ Скасувати';
    applyStyles(closeBtn, { position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#fff', border: 'none', fontSize: '1.2rem', cursor: 'pointer' });
    closeBtn.onclick = () => document.body.removeChild(modal);

    modal.append(camBtn, galBtn, closeBtn);
    document.body.appendChild(modal);
}

function triggerFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => showCropUI(event.target.result);
            reader.readAsDataURL(file);
        }
    };
    input.click();
}


async function startLiveCamera() {
    const overlay = document.createElement('div');
    applyStyles(overlay, styles.modalOverlay);

    const title = document.createElement('h3');
    title.textContent = 'Наведіть на приклад';
    title.style.color = 'white';

    const videoContainer = document.createElement('div');
    applyStyles(videoContainer, styles.videoContainer);

    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    applyStyles(video, styles.videoFeed);

    videoContainer.appendChild(video);

    const captureBtn = document.createElement('button');
    captureBtn.textContent = 'Зробити знімок';
    applyStyles(captureBtn, styles.cropButton);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Скасувати';
    applyStyles(closeBtn, { ...styles.cropButton, backgroundColor: '#ff5252', marginTop: '10px' });

    overlay.append(title, videoContainer, captureBtn, closeBtn);
    document.body.appendChild(overlay);

    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
    } catch (err) {
        document.body.removeChild(overlay);
        alert('Не вдалося отримати доступ до камери: ' + err.message);
        return;
    }

    const stopCamera = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
    };

    closeBtn.onclick = stopCamera;

    captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg');
        stopCamera();
        showCropUI(imageData);
    };
}

function showCropUI(imageSrc) {
    const overlay = document.createElement('div');
    applyStyles(overlay, styles.modalOverlay);

    const title = document.createElement('h3');
    title.textContent = 'Виділи приклад рамкою';
    title.style.color = 'white';
    
    const cropContainer = document.createElement('div');
    applyStyles(cropContainer, styles.cropContainer);

    const img = document.createElement('img');
    img.src = imageSrc;
    img.draggable = false;
    applyStyles(img, styles.cropImage);

    const cropBox = document.createElement('div');
    applyStyles(cropBox, styles.cropBox);

    cropContainer.appendChild(img);
    cropContainer.appendChild(cropBox);

    const cropBtn = document.createElement('button');
    cropBtn.textContent = 'Розпізнати';
    applyStyles(cropBtn, styles.cropButton);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Скасувати';
    applyStyles(closeBtn, { ...styles.cropButton, backgroundColor: '#ff5252', marginLeft: '10px' });

    const btnContainer = document.createElement('div');
    btnContainer.append(cropBtn, closeBtn);

    overlay.append(title, cropContainer, btnContainer);
    document.body.appendChild(overlay);

    let isDrawing = false;
    let startX, startY;
    let finalCoords = null;

    cropContainer.addEventListener('pointerdown', (e) => {
        isDrawing = true;
        const rect = img.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        applyStyles(cropBox, { 
            display: 'block', left: startX + 'px', top: startY + 'px', width: '0px', height: '0px' 
        });
    });

    cropContainer.addEventListener('pointermove', (e) => {
        if (!isDrawing) return;
        const rect = img.getBoundingClientRect();
        let currentX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        let currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);

        applyStyles(cropBox, { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' });
        finalCoords = { left, top, width, height, rect };
    });

    const stopDrawing = () => { isDrawing = false; };
    cropContainer.addEventListener('pointerup', stopDrawing);
    cropContainer.addEventListener('pointercancel', stopDrawing);

    closeBtn.onclick = () => document.body.removeChild(overlay);

    cropBtn.onclick = async () => {
        if (!finalCoords || finalCoords.width < 10) {
            alert('Будь ласка, виділи область з прикладом!');
            return;
        }

        const scaleX = img.naturalWidth / finalCoords.rect.width;
        const scaleY = img.naturalHeight / finalCoords.rect.height;

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = finalCoords.width * scaleX;
        cropCanvas.height = finalCoords.height * scaleY;
        const ctx = cropCanvas.getContext('2d');

        ctx.drawImage(img, finalCoords.left * scaleX, finalCoords.top * scaleY, cropCanvas.width, cropCanvas.height, 0, 0, cropCanvas.width, cropCanvas.height);
        
        const croppedImageBase64 = cropCanvas.toDataURL('image/jpeg');
        document.body.removeChild(overlay);
        setExpressionFromOCR('Обробка...');

        try {
            const result = await Tesseract.recognize(croppedImageBase64, 'eng');
            let text = result.data.text.toLowerCase();
            
            text = text.split('=')[0]; 
            text = text.replace(/[xх×*]/g, '*'); 
            text = text.replace(/[:]/g, '/');
            text = text.replace(/,/g, '.'); 
            text = text.replace(/\s+/g, '');
            text = text.replace(/[^0-9+\-*/().]/g, '');
            
            if (text.length === 0 || /^[\.\*\/+-]+$/.test(text)) {
                setExpressionFromOCR('Помилка читання');
            } else {
                setExpressionFromOCR(text);
            }
            
        } catch (error) {
            console.error(error);
            setExpressionFromOCR('Помилка');
        }
    };
}