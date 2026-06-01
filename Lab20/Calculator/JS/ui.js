import { styles, applyStyles } from './styles.js';
import { handleAction, calculatePredict, historyList } from './calculator.js';
import { openImageSelector } from './ocr.js';

let inputField, predictLine, historyContainer, container, scientificPad, sciToggleBtn;

export function setExpressionFromOCR(text) {
    if (inputField) {
        inputField.value = text;
        inputField.focus();
        updateUI();
    }
}

export function updateUI() {
    predictLine.textContent = calculatePredict(inputField.value);

    const len = inputField.value.length;
    if (len > 18) inputField.style.fontSize = '1.8rem';
    else if (len > 12) inputField.style.fontSize = '2.5rem';
    else inputField.style.fontSize = '3.5rem';

    historyContainer.innerHTML = '';

    const histHeader = document.createElement('div');
    applyStyles(histHeader, { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' });

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Очистити';
    applyStyles(clearBtn, { background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: '1.2rem' });
    clearBtn.onclick = () => { historyList.length = 0; updateUI(); };

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✖';
    applyStyles(closeBtn, { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' });
    closeBtn.onclick = () => { document.getElementById('hist-btn').click(); };

    histHeader.append(clearBtn, closeBtn);
    historyContainer.appendChild(histHeader);

    if (historyList.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'Історія порожня';
        applyStyles(emptyMsg, { color: '#555', textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' });
        historyContainer.appendChild(emptyMsg);
    } else {
        historyList.forEach(item => {
            const div = document.createElement('div');
            applyStyles(div, styles.historyItem);
            const expDiv = document.createElement('div');
            expDiv.textContent = item.exp;
            applyStyles(expDiv, styles.historyExp);
            const resDiv = document.createElement('div');
            resDiv.textContent = '= ' + item.res;
            applyStyles(resDiv, styles.historyRes);
            div.append(expDiv, resDiv);

            div.onclick = () => {
                inputField.value = item.exp;
                inputField.focus();
                updateUI();
                document.getElementById('hist-btn').click();
            };
            historyContainer.appendChild(div);
        });
    }
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

export function buildUI() {

    const styleTag = document.createElement('style');
    styleTag.textContent = `
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
    `;
    document.head.appendChild(styleTag);

    const app = document.getElementById('app');
    container = document.createElement('div');
    applyStyles(container, styles.container);

    const displayArea = document.createElement('div');
    applyStyles(displayArea, styles.displayArea);

    inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.inputMode = 'none';
    applyStyles(inputField, styles.inputField);

    inputField.addEventListener('input', (e) => {

        inputField.value = inputField.value.replace(/[^0-9\+\-\*\/×÷\(\)\%\^\.,πe√a-z]/gi, '');
        updateUI();
    });


    inputField.addEventListener('keydown', (e) => {
        const key = e.key;


        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(key) || e.ctrlKey || e.metaKey) {
            return;
        }

        e.preventDefault();


        const keyMap = {
            '*': '×',
            '/': '÷',
            '.': ',',
            'Enter': '=',
            'Backspace': '⌫',
            'Delete': 'C',
            'Escape': 'C'
        };


        let action = keyMap[key] || key;


        if (/^[0-9\+\-\(\)\%\^,]$/.test(action) || ['×', '÷', '=', '⌫', 'C'].includes(action)) {
            handleAction(action, inputField, updateUI);
        }
    });

    predictLine = document.createElement('div');
    applyStyles(predictLine, styles.predictDisplay);
    displayArea.append(inputField, predictLine);

    const toolbar = document.createElement('div');
    applyStyles(toolbar, styles.toolbar);

    const toolsLeft = document.createElement('div');
    toolsLeft.style.display = 'flex'; toolsLeft.style.gap = '15px';

    const historyBtn = document.createElement('button');
    historyBtn.id = 'hist-btn';
    historyBtn.innerHTML = '🕒';
    applyStyles(historyBtn, styles.toolbarBtn);

    const converterBtn = document.createElement('button');
    converterBtn.innerHTML = '📏';
    applyStyles(converterBtn, styles.toolbarBtn);

    sciToggleBtn = document.createElement('button');
    sciToggleBtn.innerHTML = '⚗️';
    applyStyles(sciToggleBtn, styles.toolbarBtn);

    const cameraBtn = document.createElement('button');
    cameraBtn.innerHTML = '📷';
    applyStyles(cameraBtn, styles.toolbarBtn);
    cameraBtn.addEventListener('click', openImageSelector);

    toolsLeft.append(historyBtn, converterBtn, sciToggleBtn, cameraBtn);

    const backspaceBtn = document.createElement('button');
    backspaceBtn.innerHTML = '⌫';
    applyStyles(backspaceBtn, { ...styles.toolbarBtn, color: '#4caf50' });
    backspaceBtn.onclick = () => handleAction('⌫', inputField, updateUI);

    toolbar.append(toolsLeft, backspaceBtn);

    historyContainer = document.createElement('div');
    applyStyles(historyContainer, styles.historyPanel);

    const keypadWrapper = document.createElement('div');
    applyStyles(keypadWrapper, styles.keypadWrapper);

    const scientificWrapper = document.createElement('div');
    applyStyles(scientificWrapper, styles.scientificWrapper);

    const scientificPad = document.createElement('div');
    applyStyles(scientificPad, styles.scientificPad);
    scientificWrapper.appendChild(scientificPad);

    const standardPad = document.createElement('div');
    applyStyles(standardPad, styles.standardPad);

    let isHistoryOpen = false;
    historyBtn.onclick = () => {
        isHistoryOpen = !isHistoryOpen;
        if (isHistoryOpen) {
            historyContainer.style.display = 'flex';
            setTimeout(() => historyContainer.style.opacity = '1', 10);
        } else {
            historyContainer.style.opacity = '0';
            setTimeout(() => historyContainer.style.display = 'none', 200);
        }
        historyBtn.style.color = isHistoryOpen ? '#4caf50' : '#888888';
    };

    let isSciOpen = false;

    const setScientificPad = (show) => {
        isSciOpen = show;
        const isMobile = window.innerWidth <= 600;

        if (show) {
            if (isMobile) {
                scientificWrapper.style.width = '100%';
                scientificWrapper.style.maxHeight = '300px';
                scientificWrapper.style.marginRight = '0px';
                scientificWrapper.style.marginBottom = '15px';
                scientificPad.style.width = '100%';
                scientificPad.style.gridTemplateColumns = 'repeat(5, 1fr)';
                container.style.maxWidth = '400px';
            } else {
                scientificWrapper.style.width = '240px';
                scientificWrapper.style.maxHeight = '1000px';
                scientificWrapper.style.marginRight = '15px';
                scientificWrapper.style.marginBottom = '0px';
                scientificPad.style.width = '240px';
                scientificPad.style.gridTemplateColumns = 'repeat(3, 1fr)';
                container.style.maxWidth = '700px';
            }
            scientificWrapper.style.opacity = '1';
            sciToggleBtn.style.color = '#4caf50';
        } else {
            scientificWrapper.style.width = '0px';
            scientificWrapper.style.maxHeight = '0px';
            scientificWrapper.style.marginRight = '0px';
            scientificWrapper.style.marginBottom = '0px';
            scientificWrapper.style.opacity = '0';
            container.style.maxWidth = '400px';
            sciToggleBtn.style.color = '#888888';
        }
    };

    sciToggleBtn.onclick = () => {
        setScientificPad(!isSciOpen);
    };

    window.addEventListener('resize', () => {
        const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth < 900;

        if (isLandscape && !isSciOpen) {
            setScientificPad(true);
        } else if (isSciOpen) {
            setScientificPad(true);
        }
    });
    const createBtn = (text, type, pad) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        applyStyles(btn, styles.button);
        if (type === 'action') applyStyles(btn, styles.actionButton);
        if (type === 'clear') applyStyles(btn, styles.clearButton);
        if (type === 'equals') applyStyles(btn, styles.equalsButton);

        btn.onclick = () => handleAction(text, inputField, updateUI);
        pad.appendChild(btn);
    };

    ['sin', 'cos', 'tan', 'ln', 'log', '√', 'π', 'e', '^', '|x|', '1/x', 'x²', 'x³', 'eˣ', '10ˣ'].forEach(val => createBtn(val, 'action', scientificPad));

    const stdBtns = [
        { t: 'C', type: 'clear' }, { t: '()', type: 'action' }, { t: '%', type: 'action' }, { t: '÷', type: 'action' },
        { t: '7', type: 'num' }, { t: '8', type: 'num' }, { t: '9', type: 'num' }, { t: '×', type: 'action' },
        { t: '4', type: 'num' }, { t: '5', type: 'num' }, { t: '6', type: 'num' }, { t: '-', type: 'action' },
        { t: '1', type: 'num' }, { t: '2', type: 'num' }, { t: '3', type: 'num' }, { t: '+', type: 'action' },
        { t: '+/-', type: 'action' }, { t: '0', type: 'num' }, { t: ',', type: 'num' }, { t: '=', type: 'equals' }
    ];
    stdBtns.forEach(b => createBtn(b.t, b.type, standardPad));

    keypadWrapper.append(scientificWrapper, standardPad);

    const converterContainer = document.createElement('div');
    applyStyles(converterContainer, styles.converterPanel);

    const convHeader = document.createElement('div');
    applyStyles(convHeader, styles.convHeader);

    const convBackBtn = document.createElement('button');
    convBackBtn.innerHTML = '←';
    applyStyles(convBackBtn, styles.convBackBtn);

    const convTitle = document.createElement('select');
    applyStyles(convTitle, { ...styles.convSelect, fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', color: '#fff', marginBottom: '0' });
    convTitle.innerHTML = '<option value="length">📏 Довжина</option><option value="weight">⚖️ Вага</option>';
    convHeader.append(convBackBtn, convTitle);

    const rates = {
        length: { 'Метри (m)': 1, 'Кілометри (km)': 1000, 'Сантиметри (cm)': 0.01, 'Міліметри (mm)': 0.001, 'Дюйми (in)': 0.0254, 'Фути (ft)': 0.3048 },
        weight: { 'Кілограми (kg)': 1, 'Грами (g)': 0.001, 'Тонни (t)': 1000, 'Фунти (lb)': 0.453592, 'Унції (oz)': 0.0283495 }
    };

    const createConvBlock = () => {
        const block = document.createElement('div');
        applyStyles(block, styles.convBlock);
        const sel = document.createElement('select');
        applyStyles(sel, styles.convSelect);
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.inputMode = 'decimal';
        inp.placeholder = '0';
        applyStyles(inp, styles.convInput);
        block.append(sel, inp);
        return { block, sel, inp };
    };

    const fromBlock = createConvBlock();
    const toBlock = createConvBlock();

    const updateSelects = () => {
        const type = convTitle.value;
        const options = Object.keys(rates[type]).map(k => `<option value="${k}">${k}</option>`).join('');
        fromBlock.sel.innerHTML = options;
        toBlock.sel.innerHTML = options;
        toBlock.sel.selectedIndex = 1;
        fromBlock.inp.value = '';
        toBlock.inp.value = '';
    };

    const calcConv = (sourceInp, sourceSel, targetInp, targetSel) => {
        const val = parseFloat(sourceInp.value);
        if (isNaN(val)) { targetInp.value = ''; return; }
        const type = convTitle.value;
        const baseVal = val * rates[type][sourceSel.value];
        const res = baseVal / rates[type][targetSel.value];
        targetInp.value = parseFloat(res.toFixed(6));
    };


    convTitle.onchange = updateSelects;
    fromBlock.sel.onchange = () => calcConv(fromBlock.inp, fromBlock.sel, toBlock.inp, toBlock.sel);
    toBlock.sel.onchange = () => calcConv(fromBlock.inp, fromBlock.sel, toBlock.inp, toBlock.sel);
    fromBlock.inp.oninput = () => calcConv(fromBlock.inp, fromBlock.sel, toBlock.inp, toBlock.sel);
    toBlock.inp.oninput = () => calcConv(toBlock.inp, toBlock.sel, fromBlock.inp, fromBlock.sel);

    updateSelects();
    converterContainer.append(convHeader, fromBlock.block, toBlock.block);


    converterBtn.onclick = () => {
        converterContainer.style.display = 'flex';
        converterBtn.style.color = '#4caf50';
    };


    convBackBtn.onclick = () => {
        converterContainer.style.display = 'none';
        converterBtn.style.color = '#888888';
    };


    container.append(displayArea, toolbar, keypadWrapper, historyContainer, converterContainer);
    app.appendChild(container);

    setTimeout(() => inputField.focus(), 100);
}