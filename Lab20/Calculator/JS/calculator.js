export let historyList = [];

function getSafeExpression(exp) {
    let safe = exp.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.');
    
    safe = safe.replace(/(\d)\(/g, '$1*(');
    safe = safe.replace(/\)\(/g, ')*(');
    safe = safe.replace(/\)(\d)/g, ')*$1');

    safe = safe.replace(/(\d)(π|e)/g, '$1*$2');
    safe = safe.replace(/(π|e)(\d)/g, '$1*$2');
    safe = safe.replace(/(π|e)\(/g, '$1*(');
    safe = safe.replace(/\)(π|e)/g, ')*$1');

    safe = safe.replace(/%/g, '/100');
    safe = safe.replace(/\b0+(\d)/g, '$1');

    safe = safe.replace(/sin\(/g, 'Math.sin(');
    safe = safe.replace(/cos\(/g, 'Math.cos(');
    safe = safe.replace(/tan\(/g, 'Math.tan(');
    safe = safe.replace(/log\(/g, 'Math.log10(');
    safe = safe.replace(/ln\(/g, 'Math.log(');
    safe = safe.replace(/√\(/g, 'Math.sqrt(');
    safe = safe.replace(/abs\(/g, 'Math.abs(');
    safe = safe.replace(/π/g, 'Math.PI');
    safe = safe.replace(/e/g, 'Math.E');
    safe = safe.replace(/\^/g, '**');

    return safe;
}

export function calculatePredict(expression) {
    try {
        let safeExp = getSafeExpression(expression);
        if (!safeExp || /[\+\-\*\/\(]$/.test(safeExp)) return ''; 

        const openCount = (safeExp.match(/\(/g) || []).length;
        const closeCount = (safeExp.match(/\)/g) || []).length;
        for (let i = 0; i < openCount - closeCount; i++) {
            safeExp += ')';
        }

        if (!/[+\-*/(]/.test(safeExp) && !expression.includes('^') && !expression.includes('√') && !expression.includes('abs')) {
            return '';
        }

        const res = eval(safeExp);
        if (isNaN(res)) return '';

        let resStr;
        if (Math.abs(res) >= 1e16 || (Math.abs(res) < 1e-6 && res !== 0)) {
            resStr = String(res).replace('.', ',');
        } else {
            resStr = String(parseFloat(res.toFixed(2))).replace('.', ',');
        }
        
        if (resStr === expression.trim()) return '';

        return resStr;
    } catch {
        return '';
    }
}

export function handleAction(action, inputElement, updateUI) {
    let exp = inputElement.value;
    let start = inputElement.selectionStart;
    let end = inputElement.selectionEnd;

    if (['sin', 'cos', 'tan', 'ln', 'log', '√'].includes(action)) {
        action += '(';
    } else if (action === '|x|') {
        action = 'abs(';
    } else if (action === '1/x') {
        action = '1/';
    } else if (action === 'x²') {
        action = '^2';
    } else if (action === 'x³') {
        action = '^3';
    } else if (action === 'eˣ') {
        action = 'e^';
    } else if (action === '10ˣ') {
        action = '10^';
    }

    const operators = ['+', '-', '×', '÷', '^', ','];

    if (action === 'C') {
        inputElement.value = '';
    } else if (action === '⌫') {
        if (start > 0 && start === end) {
            inputElement.value = exp.slice(0, start - 1) + exp.slice(start);
            inputElement.setSelectionRange(start - 1, start - 1);
        }
    } else if (action === '=') {
        const result = calculatePredict(exp);
        if (result) {
            historyList.push({ exp: exp, res: result });
            inputElement.value = result;
        }
    } else if (action === '()') {
        const beforeCursor = exp.slice(0, start);
        const openCount = (beforeCursor.match(/\(/g) || []).length;
        const closeCount = (beforeCursor.match(/\)/g) || []).length;
        const insertChar = openCount > closeCount ? ')' : '(';
        
        inputElement.value = exp.slice(0, start) + insertChar + exp.slice(start);
        inputElement.setSelectionRange(start + 1, start + 1);
    } else {
        const prevChar = exp.slice(start - 1, start);
        
        if (operators.includes(action) && operators.includes(prevChar)) {
            inputElement.value = exp.slice(0, start - 1) + action + exp.slice(start);
            inputElement.setSelectionRange(start, start);
        } else {
            inputElement.value = exp.slice(0, start) + action + exp.slice(start);
            inputElement.setSelectionRange(start + action.length, start + action.length);
        }
    }
    
    inputElement.focus();
    updateUI();
}