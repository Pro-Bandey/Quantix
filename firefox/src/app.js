let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;
let currentPage = 'calculator';
let currencyRates = {};
let lastUpdated = '';

// Browser/Web Extension Storage Wrapper Fallback
const extApi = typeof browser !== "undefined" ? browser : (typeof chrome !== "undefined" ? chrome : null);

const storage = {
    set: function (data, callback) {
        if (extApi && extApi.storage && extApi.storage.local) {
            extApi.storage.local.set(data, callback);
        } else {
            for (let key in data) {
                localStorage.setItem(key, JSON.stringify(data[key]));
            }
            if (callback) callback();
        }
    },
    get: function (keys, callback) {
        if (extApi && extApi.storage && extApi.storage.local) {
            extApi.storage.local.get(keys, callback);
        } else {
            let result = {};
            const keysArray = Array.isArray(keys) ? keys : [keys];
            keysArray.forEach(k => {
                let val = localStorage.getItem(k);
                result[k] = val ? JSON.parse(val) : undefined;
            });
            if (callback) callback(result);
        }
    }
};

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
const currencyFromSearch = document.getElementById('currency-from-search');
const currencyToSearch = document.getElementById('currency-to-search');
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

/* === Area Elements === */
const areaInput = document.getElementById('area-input');
const areaFromUnit = document.getElementById('area-from-unit');
const areaToUnit = document.getElementById('area-to-unit');
const areaOutput = document.getElementById('area-output');
const areaSwapBtn = document.getElementById('area-swap-btn');

/* === Speed Elements === */
const speedInput = document.getElementById('speed-input');
const speedFromUnit = document.getElementById('speed-from-unit');
const speedToUnit = document.getElementById('speed-to-unit');
const speedOutput = document.getElementById('speed-output');
const speedSwapBtn = document.getElementById('speed-swap-btn');

/* === Time Elements === */
const timeInput = document.getElementById('time-input');
const timeFromUnit = document.getElementById('time-from-unit');
const timeToUnit = document.getElementById('time-to-unit');
const timeOutput = document.getElementById('time-output');
const timeSwapBtn = document.getElementById('time-swap-btn');

/* === Age Elements === */
const dobInput = document.getElementById('dob-input');
const ageResult = document.getElementById('age-result');
const calcAgeBtn = document.getElementById('calc-age-btn');

/* === Menu Overlay & Sidebar === */
const menuOverlay = document.getElementById('menu-overlay');
const menuSidebar = document.getElementById('menu-sidebar');
const closeMenuBtn = document.getElementById('close-menu-btn');

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

const pageMenuButtons = {
    calculator: calculatorMenuBtn,
    currency: currencyMenuBtn,
    length: lengthMenuBtn,
    mass: massMenuBtn,
    temperature: temperatureMenuBtn,
    volume: volumeMenuBtn,
    area: areaMenuBtn,
    speed: speedMenuBtn,
    time: timeMenuBtn,
    age: ageMenuBtn
};

const equationDisplay = document.getElementById('equation');
const resultDisplay = document.getElementById('result');

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
    const pages = [
        calculatorPage, currencyPage, lengthPage, massPage,
        temperaturePage, volumePage, areaPage, speedPage,
        timePage, agePage
    ];

    pages.forEach(p => p && p.classList.add('hidden'));

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

    // Sync menu selected visual state
    Object.keys(pageMenuButtons).forEach(key => {
        if (pageMenuButtons[key]) {
            if (key === pageToShow) {
                pageMenuButtons[key].classList.add('active');
            } else {
                pageMenuButtons[key].classList.remove('active');
            }
        }
    });

    closeMenu();
}

// Collapsible Sidebar Accordions
const groupHeaders = document.querySelectorAll('.menu-group-header');
groupHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const group = header.parentElement;
        const isCollapsed = group.classList.contains('collapsed');
        if (isCollapsed) {
            group.classList.remove('collapsed');
            header.setAttribute('aria-expanded', 'true');
        } else {
            group.classList.add('collapsed');
            header.setAttribute('aria-expanded', 'false');
        }
    });
});

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
    previousInput = currentInput || previousInput || '0';
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

/* ===  CONVERTER LOGIC  === */
function convertMass() {
    const inputValue = parseFloat(massInput.value);
    if (isNaN(inputValue)) return massOutput.textContent = '0';
    const result = massFormulas.fromBase[massToUnit.value](massFormulas.toBase[massFromUnit.value](inputValue));
    massOutput.textContent = result > 1000 ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : result > 1 ? result.toFixed(2) : result.toFixed(4);
}
function swapMassUnits() {
    [massFromUnit.value, massToUnit.value] = [massToUnit.value, massFromUnit.value];
    convertMass();
    savePreferences();
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
    savePreferences();
}

function convertTemperature() {
    const inputValue = parseFloat(temperatureInput.value);
    if (isNaN(inputValue)) return temperatureOutput.textContent = '0.00';
    temperatureOutput.textContent = temperatureFormulas[temperatureFromUnit.value][temperatureToUnit.value](inputValue).toFixed(2);
}
function swapTemperatureUnits() {
    [temperatureFromUnit.value, temperatureToUnit.value] = [temperatureToUnit.value, temperatureFromUnit.value];
    convertTemperature();
    savePreferences();
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
    savePreferences();
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
    savePreferences();
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
    savePreferences();
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
    savePreferences();
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

/* ===  CURRENCY API + CONVERTER (Offline Caching Fallback) === */
function convertCurrency() {
    const inputValue = parseFloat(currencyInput.value);
    if (isNaN(inputValue)) return currencyOutput.textContent = '0.00';
    if (!Object.keys(currencyRates).length) return currencyOutput.textContent = 'Offline rates...';

    const inUSD = inputValue / currencyRates[currencyFromUnit.value];
    const result = inUSD * currencyRates[currencyToUnit.value];

    currencyOutput.textContent = result.toFixed(2);
}

function swapCurrencyUnits() {
    [currencyFromUnit.value, currencyToUnit.value] = [currencyToUnit.value, currencyFromUnit.value];
    convertCurrency();
    savePreferences();
}

async function fetchExchangeRates() {
    const apiUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network request failed");
        const data = await response.json();

        // Convert lowercase keys to uppercase for standard ISO dropdown support
        const rawRates = data.usd;
        const uppercaseRates = {};
        for (const key in rawRates) {
            uppercaseRates[key.toUpperCase()] = rawRates[key];
        }

        currencyRates = uppercaseRates;
        lastUpdated = data.date;

        // Save normalized rates to storage fallback for offline support
        storage.set({
            offlineRatesCache: currencyRates,
            offlineRatesLastUpdate: lastUpdated
        });

        processExchangeRates();
    } catch {
        // Recover using Offline cached state if network requests fail
        storage.get(['offlineRatesCache', 'offlineRatesLastUpdate'], result => {
            if (result && result.offlineRatesCache) {
                currencyRates = result.offlineRatesCache;
                lastUpdated = result.offlineRatesLastUpdate || 'Cached';
                processExchangeRates();
            } else {
                loadingIndicator.innerHTML = '<p class="text-red-500 text-center">Connection error. No offline rates are stored.</p>';
            }
        });
    }
}

function processExchangeRates() {
    populateCurrencyDropdowns();
    lastUpdatedElement.textContent = new Date(lastUpdated).toLocaleDateString() || lastUpdated;

    loadingIndicator.style.display = 'none';
    converterSection.classList.remove('hidden');
    converterSection.classList.add('flex');

    // Bind Live dropdown search filters
    filterDropdown(currencyFromSearch, currencyFromUnit);
    filterDropdown(currencyToSearch, currencyToUnit);

    loadPreferences();
    convertCurrency();
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

function filterDropdown(searchEl, selectEl) {
    searchEl.addEventListener('input', () => {
        const query = searchEl.value.toLowerCase().trim();
        const options = selectEl.options;
        let firstMatch = null;

        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            const text = opt.textContent.toLowerCase();
            if (text.includes(query)) {
                opt.style.display = '';
                if (!firstMatch) firstMatch = opt.value;
            } else {
                opt.style.display = 'none';
            }
        }

        // Auto-select first matching option if the current selection is hidden
        if (firstMatch && selectEl.selectedOptions[0].style.display === 'none') {
            selectEl.value = firstMatch;
            convertCurrency();
            savePreferences();
        }
    });
}

/* ===  THEME SWITCH UTILS (Manual Preference Toggle) === */
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIconPath = document.getElementById('theme-icon-path');
const themeBtnText = document.getElementById('theme-btn-text');

const sunPath = "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM5.64 4.22a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 0 1-1.42 1.41L5.64 5.64a1 1 0 0 1 0-1.41zm11.31 11.31a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 0 1-1.41 1.42l-1.42-1.42a1 1 0 0 1 0-1.41zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zM5.64 19.78a1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 0 1 1.41 1.42l-1.42 1.41a1 1 0 0 1-1.41 0zm11.31-11.31a1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 0 1 1.41 1.42l-1.42 1.41a1 1 0 0 1-1.41 0z";
const moonPath = "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z";

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
        if (themeIconPath) themeIconPath.setAttribute('d', sunPath);
        if (themeBtnText) themeBtnText.textContent = "Light Mode";
    } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
        if (themeIconPath) themeIconPath.setAttribute('d', moonPath);
        if (themeBtnText) themeBtnText.textContent = "Dark Mode";
    }
}

themeToggleBtn.addEventListener('click', () => {
    const root = document.documentElement;
    const currentTheme = root.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    storage.set({ selectedTheme: newTheme });
});

// Load stored theme or evaluate native system scheme
storage.get(['selectedTheme'], result => {
    if (result && result.selectedTheme) {
        applyTheme(result.selectedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
});

/* ===  PREFERENCES (Cross-compatible Chrome / Web Storage)  === */
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
    storage.set({ userPreferences: prefs });
}

function loadPreferences() {
    storage.get(['userPreferences'], result => {
        const prefs = result.userPreferences;
        if (!prefs) return;

        if (prefs.lastCurrencyFrom && currencyFromUnit.options.length) currencyFromUnit.value = prefs.lastCurrencyFrom;
        if (prefs.lastCurrencyTo && currencyToUnit.options.length) currencyToUnit.value = prefs.lastCurrencyTo;
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

/* ===  KEYBOARD NAVIGATOR SHORTCUTS === */
window.addEventListener('keydown', (e) => {
    // 1. Swap shortcut key listener: s / S or Control + S
    if ((e.key === 's' || e.key === 'S') && !e.altKey && !e.shiftKey) {
        // Prevent default save behavior when using Ctrl+S
        if (e.ctrlKey) e.preventDefault();

        // Ensure standard input is not focused to prevent blocking typed text
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
            triggerCurrentPageSwap();
        }
    }

    // 2. Swapping pages using Arrow Keys when no inputs are focused
    const focusedTag = document.activeElement.tagName.toLowerCase();
    const isTyping = focusedTag === 'input' || focusedTag === 'textarea' || focusedTag === 'select';

    if (!isTyping) {
        const sections = [
            'calculator', 'age', 'currency', 'length', 'mass',
            'temperature', 'volume', 'area', 'speed', 'time'
        ];
        let index = sections.indexOf(currentPage);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            index = (index + 1) % sections.length;
            showPage(sections[index]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            index = (index - 1 + sections.length) % sections.length;
            showPage(sections[index]);
        }
    }

    // 3. Calculator page specific numeric key overrides
    if (currentPage === 'calculator') {
        processCalculatorKeyboard(e);
    }
});

function triggerCurrentPageSwap() {
    switch (currentPage) {
        case 'currency': swapCurrencyUnits(); break;
        case 'length': swapLengthUnits(); break;
        case 'mass': swapMassUnits(); break;
        case 'temperature': swapTemperatureUnits(); break;
        case 'volume': swapVolumeUnits(); break;
        case 'area': swapAreaUnits(); break;
        case 'speed': swapSpeedUnits(); break;
        case 'time': swapTimeUnits(); break;
    }
}

function processCalculatorKeyboard(e) {
    const val = e.key;
    let clickId = '';

    if (val >= '0' && val <= '9') {
        inputNumber(val);
        clickId = `${val}-btn`;
    } else if (val === '.') {
        inputNumber('.');
        clickId = 'dot-btn';
    } else if (val === '+') {
        inputOperator('+');
        clickId = 'plus-btn';
    } else if (val === '-') {
        inputOperator('-');
        clickId = 'minus-btn';
    } else if (val === '*' || val === 'x' || val === 'X') {
        inputOperator('×');
        clickId = 'mult-btn';
    } else if (val === '/') {
        e.preventDefault();
        inputOperator('÷');
        clickId = 'divide-btn';
    } else if (val === 'Enter' || val === '=') {
        e.preventDefault();
        calculate();
        clickId = 'equal-btn';
    } else if (val === 'Backspace') {
        backspace();
        clickId = 'backspace-btn';
    } else if (val === 'Delete' || val === 'Escape') {
        clearCalculator();
        clickId = 'ac-btn';
    }

    if (clickId) {
        const targetBtn = document.getElementById(clickId);
        if (targetBtn) {
            targetBtn.classList.add('keyboard-active');
            setTimeout(() => targetBtn.classList.remove('keyboard-active'), 120);
        }
    }
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