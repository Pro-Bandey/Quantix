let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;
let currentPage = 'calculator';
let isDropdownOpen = false;
let currencyRates = {};
let lastUpdated = '';
const equationDisplay = document.getElementById('equation');
const resultDisplay = document.getElementById('result');

const extApi = typeof browser !== "undefined" ? browser : chrome;

const menuBtns = [
    document.getElementById('menu-btn-calculator'),
    document.getElementById('menu-btn-currency'),
    document.getElementById('menu-btn-length'),
    document.getElementById('menu-btn-mass'),
    document.getElementById('menu-btn-temperature'),
    document.getElementById('menu-btn-volume'),
    document.getElementById('menu-btn-area'),
    document.getElementById('menu-btn-speed'),
    document.getElementById('menu-btn-time'),
    document.getElementById('menu-btn-age')
];

/* === Currency Elements === */
const currencyInput = document.getElementById('currency-input');
const currencyFromUnit = document.getElementById('currency-from-unit');
const currencyToUnit = document.getElementById('currency-to-unit');
const currencyOutput = document.getElementById('currency-output');
const currencySwapBtn = document.getElementById('currency-swap-btn');
const loadingIndicator = document.getElementById('loading-indicator');
const converterSection = document.getElementById('converter-section');
const lastUpdatedElement = document.getElementById('last-updated');

/* === Mass Elements === */
const massInput = document.getElementById('mass-input');
const massFromUnit = document.getElementById('mass-from-unit');
const massToUnit = document.getElementById('mass-to-unit');
const massOutput = document.getElementById('mass-output');
const massSwapBtn = document.getElementById('mass-swap-btn');

/* === Length Elements === */
const lengthInput = document.getElementById('length-input');
const lengthFromUnit = document.getElementById('length-from-unit');
const lengthToUnit = document.getElementById('length-to-unit');
const lengthOutput = document.getElementById('length-output');
const lengthSwapBtn = document.getElementById('length-swap-btn');

/* === Temperature Elements === */
const temperatureInput = document.getElementById('temperature-input');
const temperatureFromUnit = document.getElementById('temperature-from-unit');
const temperatureToUnit = document.getElementById('temperature-to-unit');
const temperatureOutput = document.getElementById('temperature-output');
const temperatureSwapBtn = document.getElementById('temperature-swap-btn');

/* === Volume Elements === */
const volumeInput = document.getElementById('volume-input');
const volumeFromUnit = document.getElementById('volume-from-unit');
const volumeToUnit = document.getElementById('volume-to-unit');
const volumeOutput = document.getElementById('volume-output');
const volumeSwapBtn = document.getElementById('volume-swap-btn');

/* === Menu === */
const menuOverlay = document.getElementById('menu-overlay');
const menuSidebar = document.getElementById('menu-sidebar');
const closeMenuBtn = document.getElementById('close-menu-btn');

const areaInput = document.getElementById('area-input');
const areaFromUnit = document.getElementById('area-from-unit');
const areaToUnit = document.getElementById('area-to-unit');
const areaOutput = document.getElementById('area-output');
const areaSwapBtn = document.getElementById('area-swap-btn');

const speedInput = document.getElementById('speed-input');
const speedFromUnit = document.getElementById('speed-from-unit');
const speedToUnit = document.getElementById('speed-to-unit');
const speedOutput = document.getElementById('speed-output');
const speedSwapBtn = document.getElementById('speed-swap-btn');

const timeInput = document.getElementById('time-input');
const timeFromUnit = document.getElementById('time-from-unit');
const timeToUnit = document.getElementById('time-to-unit');
const timeOutput = document.getElementById('time-output');
const timeSwapBtn = document.getElementById('time-swap-btn');

const dobInput = document.getElementById('dob-input');
const ageResult = document.getElementById('age-result');
const calcAgeBtn = document.getElementById('calc-age-btn');

/* === Pages === */
const calculatorPage = document.getElementById('calculator-page');
const currencyPage = document.getElementById('currency-page');
const lengthPage = document.getElementById('length-page');
const massPage = document.getElementById('mass-page');
const temperaturePage = document.getElementById('temperature-page');
const volumePage = document.getElementById('volume-page');
const areaPage = document.getElementById('area-page');
const speedPage = document.getElementById('speed-page');
const timePage = document.getElementById('time-page');
const agePage = document.getElementById('age-page');

const calculatorMenuBtn = document.getElementById('calculator-menu-btn');
const currencyMenuBtn = document.getElementById('currency-menu-btn');
const lengthMenuBtn = document.getElementById('length-menu-btn');
const massMenuBtn = document.getElementById('mass-menu-btn');
const temperatureMenuBtn = document.getElementById('temperature-menu-btn');
const volumeMenuBtn = document.getElementById('volume-menu-btn');
const areaMenuBtn = document.getElementById('area-menu-btn');
const speedMenuBtn = document.getElementById('speed-menu-btn');
const timeMenuBtn = document.getElementById('time-menu-btn');
const ageMenuBtn = document.getElementById('age-menu-btn');

const measurementsSubmenu = document.getElementById('measurements-submenu');
const measurementsArrow = document.getElementById('measurements-arrow');

/* ===  FORMULAS  === */

const massFormulas = {
    toBase: {
        kilograms: v => v,
        grams: v => v / 1000,
        milligrams: v => v / 1000000,
        pounds: v => v * 0.453592,
        ounces: v => v * 0.0283495,
        tons: v => v * 1000
    },
    fromBase: {
        kilograms: v => v,
        grams: v => v * 1000,
        milligrams: v => v * 1000000,
        pounds: v => v * 2.20462,
        ounces: v => v * 35.274,
        tons: v => v / 1000
    }
};

const lengthFormulas = {
    toBase: {
        meters: v => v,
        kilometers: v => v * 1000,
        decimeter: v => v / 10,
        centimeters: v => v / 100,
        millimeters: v => v / 1000,
        miles: v => v * 1609.344,
        yards: v => v * 0.9144,
        feet: v => v * 0.3048,
        inches: v => v * 0.0254
    },
    fromBase: {
        meters: v => v,
        kilometers: v => v / 1000,
        decimeter: v => v * 10,
        centimeters: v => v * 100,
        millimeters: v => v * 1000,
        miles: v => v / 1609.344,
        yards: v => v / 0.9144,
        feet: v => v / 0.3048,
        inches: v => v / 0.0254
    }
};

const temperatureFormulas = {
    celsius: {
        celsius: c => c,
        fahrenheit: c => (c * 9 / 5) + 32,
        kelvin: c => c + 273.15
    },
    fahrenheit: {
        celsius: f => (f - 32) * 5 / 9,
        fahrenheit: f => f,
        kelvin: f => (f - 32) * 5 / 9 + 273.15
    },
    kelvin: {
        celsius: k => k - 273.15,
        fahrenheit: k => (k - 273.15) * 9 / 5 + 32,
        kelvin: k => k
    }
};

const volumeFormulas = {
    toBase: {
        liters: v => v,
        milliliters: v => v / 1000,
        centiliters: v => v / 100,
        deciliters: v => v / 10,
        quartliters: v => v / 4,
        gallons: v => v * 3.78541,
        quarts: v => v * 0.946353,
        pints: v => v * 0.473176,
        cups: v => v * 0.236588,
        fluidOunces: v => v * 0.0295735,
        tablespoons: v => v * 0.0147868,
        teaspoons: v => v * 0.00492892
    },
    fromBase: {
        liters: v => v,
        milliliters: v => v * 1000,
        centiliters: v => v * 100,
        deciliters: v => v * 10,
        quartliters: v => v * 4,
        gallons: v => v / 3.78541,
        quarts: v => v / 0.946353,
        pints: v => v / 0.473176,
        cups: v => v / 0.236588,
        fluidOunces: v => v / 0.0295735,
        tablespoons: v => v / 0.0147868,
        teaspoons: v => v / 0.00492892
    }
};

const areaFormulas = {
    toBase: {
        squareMeters: v => v,
        squareKilometers: v => v * 1000000,
        squareCentimeters: v => v / 10000,
        squareFeet: v => v * 0.092903,
        squareYards: v => v * 0.836127,
        squareMiles: v => v * 2589988.11,
        acres: v => v * 4046.86,
        sqacres: v => v * 102421.5,
        hectares: v => v * 10000
    },
    fromBase: {
        squareMeters: v => v,
        squareKilometers: v => v / 1000000,
        squareCentimeters: v => v * 10000,
        squareFeet: v => v / 0.092903,
        squareYards: v => v / 0.836127,
        squareMiles: v => v / 2589988.11,
        acres: v => v / 4046.86,
        sqacres: v => v / 102421.5,
        hectares: v => v / 10000
    }
};

const speedFormulas = {
    toBase: {
        metersPerSecond: v => v,
        kilometersPerHour: v => v / 3.6,
        milesPerHour: v => v * 0.44704,
        feetPerSecond: v => v * 0.3048,
        knots: v => v * 0.514444,
        mach: v => v * 343
    },
    fromBase: {
        metersPerSecond: v => v,
        kilometersPerHour: v => v * 3.6,
        milesPerHour: v => v / 0.44704,
        feetPerSecond: v => v / 0.3048,
        knots: v => v / 0.514444,
        mach: v => v / 343
    }
};

const timeFormulas = {
    toBase: {
        seconds: v => v,
        minutes: v => v * 60,
        hours: v => v * 3600,
        days: v => v * 86400,
        weeks: v => v * 604800,
        months: v => v * 2592000,
        years: v => v * 31557600,
        century: v => v * 3155760000,
        milliseconds: v => v / 1000
    },
    fromBase: {
        seconds: v => v,
        minutes: v => v / 60,
        hours: v => v / 3600,
        days: v => v / 86400,
        weeks: v => v / 604800,
        months: v => v / 2592000,
        years: v => v / 31557600,
        century: v => v / 3155760000,
        milliseconds: v => v * 1000
    }
};

/* ===  MENU FUNCTIONS  === */
function openMenu() {
    menuOverlay.classList.remove('opacity-0', 'invisible');
    menuOverlay.classList.add('opacity-100', 'visible');
    menuSidebar.classList.remove('-translate-x-full');
    menuSidebar.classList.add('translate-x-0');
}

function closeMenu() {
    menuOverlay.classList.remove('opacity-100', 'visible');
    menuOverlay.classList.add('opacity-0', 'invisible');
    menuSidebar.classList.remove('translate-x-0');
    menuSidebar.classList.add('-translate-x-full');
}

function showPage(pageToShow) {
    calculatorPage.classList.add('hidden');
    currencyPage.classList.add('hidden');
    lengthPage.classList.add('hidden');
    massPage.classList.add('hidden');
    temperaturePage.classList.add('hidden');
    volumePage.classList.add('hidden');
    areaPage.classList.add('hidden');
    speedPage.classList.add('hidden');
    timePage.classList.add('hidden');
    agePage.classList.add('hidden');

    switch (pageToShow) {
        case 'calculator': calculatorPage.classList.remove('hidden'); break;
        case 'currency': currencyPage.classList.remove('hidden'); break;
        case 'length': lengthPage.classList.remove('hidden'); break;
        case 'mass': massPage.classList.remove('hidden'); break;
        case 'temperature': temperaturePage.classList.remove('hidden'); break;
        case 'volume': volumePage.classList.remove('hidden'); break;
        case 'area': areaPage.classList.remove('hidden'); break;
        case 'speed': speedPage.classList.remove('hidden'); break;
        case 'time': timePage.classList.remove('hidden'); break;
        case 'age': agePage.classList.remove('hidden'); break;
        default: calculatorPage.classList.remove('hidden');
    }

    currentPage = pageToShow;
    closeMenu();
}

/* ===  CALCULATOR FUNCTIONS  === */
function updateDisplay() {
    resultDisplay.textContent = currentInput || '0';
    equationDisplay.textContent = (previousInput && operator) ? previousInput + ' ' + operator : '';
}

function inputNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    currentInput += number;
    updateDisplay();
}

function inputOperator(nextOperator) {
    if (previousInput && currentInput && operator) calculate();
    previousInput = currentInput;
    operator = nextOperator;
    currentInput = '';
    updateDisplay();
}

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = current !== 0 ? prev / current : 0; break;
        default: return;
    }

    result = Math.round(result * 100000) / 100000;
    equationDisplay.textContent = `${previousInput} ${operator} ${currentInput} =`;
    resultDisplay.textContent = result;

    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
}

function clearCalculator() {
    currentInput = '';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    equationDisplay.textContent = '';
    resultDisplay.textContent = '0';
}

function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
        if (currentInput === '') resultDisplay.textContent = '0';
    }
}

/* ===  CONVERTER FUNCTIONS  === */
function convertMass() {
    const inputValue = parseFloat(massInput.value);
    if (isNaN(inputValue)) return massOutput.textContent = '0';
    const result = massFormulas.fromBase[massToUnit.value](massFormulas.toBase[massFromUnit.value](inputValue));
    massOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapMassUnits() {
    [massFromUnit.value, massToUnit.value] = [massToUnit.value, massFromUnit.value];
    convertMass();
}

function convertLength() {
    const inputValue = parseFloat(lengthInput.value);
    if (isNaN(inputValue)) return lengthOutput.textContent = '0';
    const result = lengthFormulas.fromBase[lengthToUnit.value](lengthFormulas.toBase[lengthFromUnit.value](inputValue));
    lengthOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapLengthUnits() {
    [lengthFromUnit.value, lengthToUnit.value] = [lengthToUnit.value, lengthFromUnit.value];
    convertLength();
}

function convertTemperature() {
    const inputValue = parseFloat(temperatureInput.value);
    if (isNaN(inputValue)) return temperatureOutput.textContent = '0.00';
    temperatureOutput.textContent = temperatureFormulas[temperatureFromUnit.value][temperatureToUnit.value](inputValue).toFixed(2);
}
function swapTemperatureUnits() {
    [temperatureFromUnit.value, temperatureToUnit.value] = [temperatureToUnit.value, temperatureFromUnit.value];
    convertTemperature();
}

function convertVolume() {
    const inputValue = parseFloat(volumeInput.value);
    if (isNaN(inputValue)) return volumeOutput.textContent = '0';
    const result = volumeFormulas.fromBase[volumeToUnit.value](volumeFormulas.toBase[volumeFromUnit.value](inputValue));
    volumeOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapVolumeUnits() {
    [volumeFromUnit.value, volumeToUnit.value] = [volumeToUnit.value, volumeFromUnit.value];
    convertVolume();
}

function convertArea() {
    const inputValue = parseFloat(areaInput.value);
    if (isNaN(inputValue)) return areaOutput.textContent = '0';
    const result = areaFormulas.fromBase[areaToUnit.value](areaFormulas.toBase[areaFromUnit.value](inputValue));
    areaOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapAreaUnits() {
    [areaFromUnit.value, areaToUnit.value] = [areaToUnit.value, areaFromUnit.value];
    convertArea();
}

function convertSpeed() {
    const inputValue = parseFloat(speedInput.value);
    if (isNaN(inputValue)) return speedOutput.textContent = '0';
    const result = speedFormulas.fromBase[speedToUnit.value](speedFormulas.toBase[speedFromUnit.value](inputValue));
    speedOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapSpeedUnits() {
    [speedFromUnit.value, speedToUnit.value] = [speedToUnit.value, speedFromUnit.value];
    convertSpeed();
}

function convertTime() {
    const inputValue = parseFloat(timeInput.value);
    if (isNaN(inputValue)) return timeOutput.textContent = '0';
    const result = timeFormulas.fromBase[timeToUnit.value](timeFormulas.toBase[timeFromUnit.value](inputValue));
    timeOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapTimeUnits() {
    [timeFromUnit.value, timeToUnit.value] = [timeToUnit.value, timeFromUnit.value];
    convertTime();
}

/* ===  AGE CALCULATOR  === */
function calculateAge() {
    const dobValue = dobInput.value;
    if (!dobValue) return ageResult.textContent = "Please select your date of birth.";

    const birthDate = new Date(dobValue);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    ageResult.textContent = `${years} years, ${months} months, ${days} days`;
}

/* ===  CURRENCY API + CONVERTER  === */
function convertCurrency() {
    const inputValue = parseFloat(currencyInput.value);
    if (isNaN(inputValue)) return currencyOutput.textContent = '0.00';
    if (!Object.keys(currencyRates).length) return currencyOutput.textContent = 'Loading...';

    const inUSD = inputValue / currencyRates[currencyFromUnit.value];
    const result = inUSD * currencyRates[currencyToUnit.value];

    currencyOutput.textContent = result.toFixed(2);
}

function swapCurrencyUnits() {
    [currencyFromUnit.value, currencyToUnit.value] = [currencyToUnit.value, currencyFromUnit.value];
    convertCurrency();
}

async function fetchExchangeRates() {
    try {
        const apiKey = 'df6815c6703843997dab033e';
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await response.json();

        currencyRates = data.conversion_rates;
        lastUpdated = data.time_last_update_utc;

        populateCurrencyDropdowns();
        lastUpdatedElement.textContent = new Date(lastUpdated).toLocaleDateString();

        loadingIndicator.style.display = 'none';
        converterSection.classList.remove('hidden');
        converterSection.classList.add('flex');

        convertCurrency();
    } catch {
        loadingIndicator.innerHTML = '<p class="text-red-500 text-center">Failed to load rates. Please refresh.</p>';
    }
}

function populateCurrencyDropdowns() {
    const currencies = Object.keys(currencyRates).sort();

    currencyFromUnit.innerHTML = '';
    currencyToUnit.innerHTML = '';

    currencies.forEach(currency => {
        const opt1 = document.createElement('option');
        opt1.value = currency;
        opt1.textContent = currency;

        const opt2 = opt1.cloneNode(true);

        currencyFromUnit.appendChild(opt1);
        currencyToUnit.appendChild(opt2);
    });

    currencyFromUnit.value = 'USD';
    currencyToUnit.value = 'PKR';
}


/* ===  PREFERENCES (Chrome Storage)  === */
function savePreferences() {
    const prefs = {
        lastCurrencyFrom: currencyFromUnit.value,
        lastCurrencyTo: currencyToUnit.value,
        lastCurrencyAmount: currencyInput.value,
        lastLengthFrom: lengthFromUnit.value,
        lastLengthTo: lengthToUnit.value,
        lastMassFrom: massFromUnit.value,
        lastMassTo: massToUnit.value,
        lastTemperatureFrom: temperatureFromUnit.value,
        lastTemperatureTo: temperatureToUnit.value,
        lastVolumeFrom: volumeFromUnit.value,
        lastVolumeTo: volumeToUnit.value,
        lastAreaFrom: areaFromUnit.value,
        lastAreaTo: areaToUnit.value,
        lastSpeedFrom: speedFromUnit.value,
        lastSpeedTo: speedToUnit.value,
        lastTimeFrom: timeFromUnit.value,
        lastTimeTo: timeToUnit.value
    };

    extApi.storage.local.set({ userPreferences: prefs });
}

function loadPreferences() {
    extApi.storage.local.get(['userPreferences'], result => {
        const prefs = result.userPreferences;
        if (!prefs) return;

        if (prefs.lastCurrencyFrom) currencyFromUnit.value = prefs.lastCurrencyFrom;
        if (prefs.lastCurrencyTo) currencyToUnit.value = prefs.lastCurrencyTo;
        if (prefs.lastCurrencyAmount) currencyInput.value = prefs.lastCurrencyAmount;

        if (prefs.lastLengthFrom) lengthFromUnit.value = prefs.lastLengthFrom;
        if (prefs.lastLengthTo) lengthToUnit.value = prefs.lastLengthTo;

        if (prefs.lastMassFrom) massFromUnit.value = prefs.lastMassFrom;
        if (prefs.lastMassTo) massToUnit.value = prefs.lastMassTo;

        if (prefs.lastTemperatureFrom) temperatureFromUnit.value = prefs.lastTemperatureFrom;
        if (prefs.lastTemperatureTo) temperatureToUnit.value = prefs.lastTemperatureTo;

        if (prefs.lastVolumeFrom) volumeFromUnit.value = prefs.lastVolumeFrom;
        if (prefs.lastVolumeTo) volumeToUnit.value = prefs.lastVolumeTo;

        if (prefs.lastAreaFrom) areaFromUnit.value = prefs.lastAreaFrom;
        if (prefs.lastAreaTo) areaToUnit.value = prefs.lastAreaTo;

        if (prefs.lastSpeedFrom) speedFromUnit.value = prefs.lastSpeedFrom;
        if (prefs.lastSpeedTo) speedToUnit.value = prefs.lastSpeedTo;

        if (prefs.lastTimeFrom) timeFromUnit.value = prefs.lastTimeFrom;
        if (prefs.lastTimeTo) timeToUnit.value = prefs.lastTimeTo;
    });
}

/* ===  EVENT LISTENERS  === */
menuBtns.forEach(btn => btn && btn.addEventListener('click', openMenu));
closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

calculatorMenuBtn.addEventListener('click', () => showPage('calculator'));
currencyMenuBtn.addEventListener('click', () => showPage('currency'));
lengthMenuBtn.addEventListener('click', () => showPage('length'));
massMenuBtn.addEventListener('click', () => showPage('mass'));
temperatureMenuBtn.addEventListener('click', () => showPage('temperature'));
volumeMenuBtn.addEventListener('click', () => showPage('volume'));
areaMenuBtn.addEventListener('click', () => showPage('area'));
speedMenuBtn.addEventListener('click', () => showPage('speed'));
timeMenuBtn.addEventListener('click', () => showPage('time'));
ageMenuBtn.addEventListener('click', () => showPage('age'));

currencyFromUnit.addEventListener('change', () => { convertCurrency(); savePreferences(); });
currencyToUnit.addEventListener('change', () => { convertCurrency(); savePreferences(); });
currencyInput.addEventListener('input', () => { convertCurrency(); savePreferences(); });
currencySwapBtn.addEventListener('click', swapCurrencyUnits);

massFromUnit.addEventListener('change', () => { convertMass(); savePreferences(); });
massToUnit.addEventListener('change', () => { convertMass(); savePreferences(); });
massInput.addEventListener('input', convertMass);
massSwapBtn.addEventListener('click', swapMassUnits);

lengthFromUnit.addEventListener('change', () => { convertLength(); savePreferences(); });
lengthToUnit.addEventListener('change', () => { convertLength(); savePreferences(); });
lengthInput.addEventListener('input', convertLength);
lengthSwapBtn.addEventListener('click', swapLengthUnits);

temperatureFromUnit.addEventListener('change', () => { convertTemperature(); savePreferences(); });
temperatureToUnit.addEventListener('change', () => { convertTemperature(); savePreferences(); });
temperatureInput.addEventListener('input', convertTemperature);
temperatureSwapBtn.addEventListener('click', swapTemperatureUnits);

volumeFromUnit.addEventListener('change', () => { convertVolume(); savePreferences(); });
volumeToUnit.addEventListener('change', () => { convertVolume(); savePreferences(); });
volumeInput.addEventListener('input', convertVolume);
volumeSwapBtn.addEventListener('click', swapVolumeUnits);

areaFromUnit.addEventListener('change', () => { convertArea(); savePreferences(); });
areaToUnit.addEventListener('change', () => { convertArea(); savePreferences(); });
areaInput.addEventListener('input', convertArea);
areaSwapBtn.addEventListener('click', swapAreaUnits);

speedFromUnit.addEventListener('change', () => { convertSpeed(); savePreferences(); });
speedToUnit.addEventListener('change', () => { convertSpeed(); savePreferences(); });
speedInput.addEventListener('input', convertSpeed);
speedSwapBtn.addEventListener('click', swapSpeedUnits);

timeFromUnit.addEventListener('change', () => { convertTime(); savePreferences(); });
timeToUnit.addEventListener('change', () => { convertTime(); savePreferences(); });
timeInput.addEventListener('input', convertTime);
timeSwapBtn.addEventListener('click', swapTimeUnits);

calcAgeBtn.addEventListener('click', calculateAge);

document.getElementById('1-btn').addEventListener('click', () => inputNumber('1'));
document.getElementById('2-btn').addEventListener('click', () => inputNumber('2'));
document.getElementById('3-btn').addEventListener('click', () => inputNumber('3'));
document.getElementById('4-btn').addEventListener('click', () => inputNumber('4'));
document.getElementById('5-btn').addEventListener('click', () => inputNumber('5'));
document.getElementById('6-btn').addEventListener('click', () => inputNumber('6'));
document.getElementById('7-btn').addEventListener('click', () => inputNumber('7'));
document.getElementById('8-btn').addEventListener('click', () => inputNumber('8'));
document.getElementById('9-btn').addEventListener('click', () => inputNumber('9'));
document.getElementById('0-btn').addEventListener('click', () => inputNumber('0'));
document.getElementById('dot-btn').addEventListener('click', () => inputNumber('.'));

document.getElementById('plus-btn').addEventListener('click', () => inputOperator('+'));
document.getElementById('minus-btn').addEventListener('click', () => inputOperator('-'));
document.getElementById('mult-btn').addEventListener('click', () => inputOperator('×'));
document.getElementById('divide-btn').addEventListener('click', () => inputOperator('÷'));

document.getElementById('ac-btn').addEventListener('click', clearCalculator);
document.getElementById('equal-btn').addEventListener('click', calculate);
document.getElementById('backspace-btn').addEventListener('click', backspace);

fetchExchangeRates();
loadPreferences();
