// === KALKULATOR LOGIKASI ===

let currentInput = '';
let justCalculated = false;

const resultEl    = document.getElementById('result');
const expressionEl = document.getElementById('expression');

// Qo'shish
function qoshish(a, b) {
  return a + b;
}

// Ayirish
function ayirish(a, b) {
  return a - b;
}

// Ko'paytirish
function kopaytirish(a, b) {
  return a * b;
}

// Bo'lish
function bolish(a, b) {
  if (b === 0) return 'Xato: 0 ga bo\'lish mumkin emas';
  return a / b;
}

// Ekranga qiymat qo'shish
function appendValue(val) {
  const operators = ['+', '-', '*', '/'];

  if (justCalculated && !operators.includes(val)) {
    currentInput = '';
  }
  justCalculated = false;

  // Ketma-ket operator bosishni oldini olish
  if (operators.includes(val) && operators.includes(currentInput.slice(-1))) {
    currentInput = currentInput.slice(0, -1);
  }

  // Nuqtani takrorlamaslik
  if (val === '.') {
    const parts = currentInput.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
    if (lastPart === '') currentInput += '0';
  }

  currentInput += val;
  updateDisplay();
}

// Hammasini tozalash
function clearAll() {
  currentInput = '';
  justCalculated = false;
  expressionEl.textContent = '';
  resultEl.textContent = '0';
}

// Oxirgi belgini o'chirish
function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  resultEl.textContent = currentInput || '0';
}

// Hisoblash
function calculate() {
  if (!currentInput) return;

  try {
    // Foiz hisoblash
    let expression = currentInput.replace(/%/g, '/100');

    // Tokens ajratish va hisoblash
    const tokens = tokenize(expression);
    const result = evaluate(tokens);

    expressionEl.textContent = formatExpression(currentInput) + ' =';

    if (result === 'Xato: 0 ga bo\'lish mumkin emas') {
      resultEl.textContent = result;
      currentInput = '';
    } else {
      const rounded = parseFloat(result.toFixed(10));
      resultEl.textContent = formatNumber(rounded);
      currentInput = String(rounded);
      justCalculated = true;
    }
  } catch (e) {
    resultEl.textContent = 'Xato!';
    currentInput = '';
  }
}

// Tokenize qilish
function tokenize(expr) {
  const tokens = [];
  let num = '';

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if ('0123456789.'.includes(ch)) {
      num += ch;
    } else if ('+-*/'.includes(ch)) {
      if (num !== '') { tokens.push(parseFloat(num)); num = ''; }
      // Unary minus
      if (ch === '-' && (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string')) {
        num = '-';
      } else {
        tokens.push(ch);
      }
    }
  }
  if (num !== '') tokens.push(parseFloat(num));
  return tokens;
}

// Ko'paytirish va bo'lishni avval hisoblash (operator ustuvorligi)
function evaluate(tokens) {
  // * va / ni hisoblash
  let t = [...tokens];
  for (let i = 1; i < t.length - 1; i += 2) {
    if (t[i] === '*' || t[i] === '/') {
      const a = t[i - 1], op = t[i], b = t[i + 1];
      let res;
      if (op === '*') res = kopaytirish(a, b);
      else {
        res = bolish(a, b);
        if (typeof res === 'string') return res;
      }
      t.splice(i - 1, 3, res);
      i -= 2;
    }
  }
  // + va - ni hisoblash
  let result = t[0];
  for (let i = 1; i < t.length - 1; i += 2) {
    const op = t[i], b = t[i + 1];
    if (op === '+') result = qoshish(result, b);
    else if (op === '-') result = ayirish(result, b);
  }
  return result;
}

// Ekranni yangilash
function updateDisplay() {
  resultEl.textContent = formatExpression(currentInput) || '0';
}

// Operatorlarni chiroyli ko'rsatish
function formatExpression(expr) {
  return expr
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' − ');
}

// Sonni formatlash (millionlar uchun vergul yoki oddiy)
function formatNumber(num) {
  if (Math.abs(num) >= 1e12) return num.toExponential(4);
  return num.toLocaleString('uz-UZ', { maximumFractionDigits: 10 });
}
