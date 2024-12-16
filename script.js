document.addEventListener('DOMContentLoaded', () => {
    const rInput = document.getElementById('r');
    const gInput = document.getElementById('g');
    const bInput = document.getElementById('b');

    const rSlider = document.getElementById('rSlider');
    const gSlider = document.getElementById('gSlider');
    const bSlider = document.getElementById('bSlider');

    const cOutput = document.getElementById('c');
    const mOutput = document.getElementById('m');
    const yOutput = document.getElementById('y');
    const kOutput = document.getElementById('k');

    const lOutput = document.getElementById('l');
    const aOutput = document.getElementById('a');
    const bOutput = document.getElementById('b_lab');

    const colorDisplay = document.getElementById('colorDisplay');
    const rgbValue = document.getElementById('rgbValue');
    const cmykValue = document.getElementById('cmykValue');
    const labValue = document.getElementById('labValue');

    const hexInput = document.getElementById('hex');
    const colorPicker = document.getElementById('colorPicker');

    function updateColor() {
        const r = parseInt(rInput.value);
        const g = parseInt(gInput.value);
        const b = parseInt(bInput.value);

        // Обновление отображаемого цвета
        colorDisplay.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        rgbValue.textContent = `(${r}, ${g}, ${b})`;

        // Конвертация RGB в CMYK
        const cmyk = rgbToCmyk(r, g, b);
        cOutput.value = cmyk.c;
        mOutput.value = cmyk.m;
        yOutput.value = cmyk.y;
        kOutput.value = cmyk.k;
        cmykValue.textContent = `(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`;

        // Конвертация RGB в LAB
        const lab = rgbToLab(r, g, b);
        lOutput.value = lab.l;
        aOutput.value = lab.a;
        bOutput.value = lab.b;
        labValue.textContent = `(${lab.l}, ${lab.a}, ${lab.b})`;
    }

    function rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        return {
            c: Math.round((c - k) / (1 - k) * 100),
            m: Math.round((m - k) / (1 - k) * 100),
            y: Math.round((y - k) / (1 - k) * 100),
            k: Math.round(k * 100)
        };
    }

    function rgbToLab(r, g, b) {
        // Преобразование RGB в XYZ
        r /= 255; g /= 255; b /= 255;
        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        r *= 100; g *= 100; b *= 100;

        const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
        const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
        const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

        // Преобразование XYZ в LAB
        const xN = 95.047; // стандартное значение для D65
        const yN = 100.000;
        const zN = 108.883;

        let l = 116 * f(y / yN) - 16;
        let a = 500 * (f(x / xN) - f(y / yN));
        let b_lab = 200 * (f(y / yN) - f(z / zN));

        return { l: Math.round(l), a: Math.round(a), b: Math.round(b_lab) };
    }

    function f(t) {
        return t > 0.008856 ? Math.pow(t, 1 / 3) : (t * 7.787) + (16 / 116);
    }

    function hexToRgb(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    // Обработчики событий для RGB
    [rInput, gInput, bInput].forEach(input => {
        input.addEventListener('input', () => {
            rSlider.value = rInput.value;
            gSlider.value = gInput.value;
            bSlider.value = bInput.value;
            updateColor();
        });
    });

    [rSlider, gSlider, bSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            rInput.value = rSlider.value;
            gInput.value = gSlider.value;
            bInput.value = bSlider.value;
            updateColor();
        });
    });

    colorPicker.addEventListener('input', function() {
        const color = this.value;
        const rgb = hexToRgb(color);
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
        rSlider.value = rgb.r;
        gSlider.value = rgb.g;
        bSlider.value = rgb.b;
        updateColor();
    });

    hexInput.addEventListener('input', function() {
        const color = this.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            const rgb = hexToRgb(color);
            rInput.value = rgb.r;
            gInput.value = rgb.g;
            bInput.value = rgb.b;
            rSlider.value = rgb.r;
            gSlider.value = rgb.g;
            bSlider.value = rgb.b;
            updateColor();
        }
    });

    // Инициализация цвета
    updateColor();
});