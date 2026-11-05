/* =====================================================
   MINI BUDGET PLANNER
   Premium Finance Dashboard
===================================================== */


'use strict';


// DOM ELEMENTS

const balanceEl = document.getElementById('balance');

const transactionsEl = document.getElementById('transactions');

const chartCanvas = document.getElementById('chart');

const amountInput = document.getElementById('amount');

const descriptionInput = document.getElementById('description');

const dateInput = document.getElementById('date');

const currencySelect = document.getElementById('currency');

const typeSelect = document.getElementById('type');

const categorySelect = document.getElementById('category');

const darkBtn = document.getElementById('darkModeBtn');

const chartEmpty = document.getElementById('chartEmpty');

const statusMessage = document.getElementById('statusMessage');


// APPLICATION STATE

let transactions = [];

let chart = null;

let budgetCurrency = null;


// LOCAL STORAGE KEYS

const STORAGE_KEYS = {

    transactions: 'miniBudgetTransactions',

    currency: 'miniBudgetCurrency',

    theme: 'miniBudgetTheme'

};


// CURRENCY SYMBOLS

const CURRENCY_SYMBOLS = {

    USD: '$',
    LKR: 'Rs.',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CHF: 'CHF',
    CAD: 'CA$',
    AUD: 'A$',
    CNY: '¥',
    RUB: '₽',
    BRL: 'R$',
    ZAR: 'R',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
    KRW: '₩',
    MXN: 'MX$',
    TRY: '₺',
    SAR: 'ر.س',
    AED: 'د.إ',
    DZD: 'دج',
    AOA: 'Kz',
    BWP: 'P',
    EGP: 'E£',
    GHS: '₵'

};


// INITIALIZATION

document.addEventListener('DOMContentLoaded', initializeApp);


function initializeApp() {

    loadTheme();

    loadBudget();

    setTodayDate();

    setupEventListeners();

    updateDashboard();

    updateChart();

}


// SET TODAY'S DATE

function setTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    dateInput.value = `${year}-${month}-${day}`;

}


// EVENT LISTENERS

function setupEventListeners() {

    document.getElementById('transactionForm')
        .addEventListener('submit', addTransaction);


    document.getElementById('saveBtn')
        .addEventListener('click', saveBudget);


    document.getElementById('downloadBtn')
        .addEventListener('click', downloadBudget);


    document.getElementById('printBtn')
        .addEventListener('click', printBudget);


    document.getElementById('clearBtn')
        .addEventListener('click', clearBudget);


    darkBtn.addEventListener('click', toggleDarkMode);


    transactionsEl.addEventListener('click', handleTransactionAction);


    currencySelect.addEventListener('change', handleCurrencyChange);

}


// FORMAT MONEY

function formatMoney(amount, currency = budgetCurrency || 'USD') {

    const symbol = CURRENCY_SYMBOLS[currency] || currency;

    const formatted = new Intl.NumberFormat('en-US', {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    }).format(amount);


    return `${symbol} ${formatted}`;

}


// DATE FORMATTING

function formatDate(dateString) {

    if (!dateString) return '';

    const [year, month, day] = dateString.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-US', {

        year: 'numeric',

        month: 'short',

        day: 'numeric'

    });

}


// GENERATE UNIQUE ID

function generateId() {

    if (window.crypto && crypto.randomUUID) {

        return crypto.randomUUID();

    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;

}


// STATUS MESSAGE

function showMessage(message, isError = false) {

    statusMessage.textContent = message;

    statusMessage.style.color = isError
        ? '#dc554d'
        : '';


}


// ADD TRANSACTION

function addTransaction(event) {

    event.preventDefault();


    const description = descriptionInput.value.trim();

    const amount = Number(amountInput.value);

    const date = dateInput.value;

    const currency = currencySelect.value;

    const type = typeSelect.value;

    const category = categorySelect.value;


    // DESCRIPTION VALIDATION

    if (!description) {

        showMessage('Please enter a transaction description.', true);

        descriptionInput.focus();

        return;

    }


    if (description.length > 100) {

        showMessage('Description must not exceed 100 characters.', true);

        return;

    }


    // AMOUNT VALIDATION

    if (

        !Number.isFinite(amount) ||

        amount <= 0 ||

        amount > 1000000000000

    ) {

        showMessage('Please enter a valid positive amount.', true);

        amountInput.focus();

        return;

    }


    // DATE VALIDATION

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {

        showMessage('Please select a valid transaction date.', true);

        dateInput.focus();

        return;

    }


    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {

        showMessage('Please select a valid date.', true);

        return;

    }


    // TYPE VALIDATION

    if (!['income', 'expense'].includes(type)) {

        showMessage('Please select a valid transaction type.', true);

        return;

    }


    // CATEGORY VALIDATION

    if (!category) {

        showMessage('Please select a category.', true);

        return;

    }


    // CURRENCY VALIDATION
    // All transactions use the same currency.
    // Different currencies must never be added together directly.

    if (budgetCurrency && currency !== budgetCurrency) {

        showMessage(

            `Your current budget uses ${budgetCurrency}. Remove all transactions before changing currency.`,

            true

        );

        currencySelect.value = budgetCurrency;

        return;

    }


    if (!budgetCurrency) {

        budgetCurrency = currency;

    }


    // CREATE TRANSACTION

    const transaction = {

        id: generateId(),

        description,

        amount,

        date,

        currency,

        type,

        category

    };


    transactions.push(transaction);


    if (!persistBudget()) {

        transactions.pop();

        return;

    }


    // UPDATE INTERFACE

    renderTransactions();

    updateDashboard();

    updateChart();

    updateCurrencyLock();


    // RESET INPUTS

    descriptionInput.value = '';

    amountInput.value = '';

    categorySelect.value = 'Other';

    descriptionInput.focus();


    showMessage('Transaction added successfully! ✓');

}


// RENDER TRANSACTIONS

function renderTransactions() {

    transactionsEl.replaceChildren();


    transactions.forEach(transaction => {

        const li = document.createElement('li');

        li.className = `transaction-item ${transaction.type}`;


        // LEFT SIDE

        const main = document.createElement('div');

        main.className = 'transaction-main';


        const icon = document.createElement('span');

        icon.className = 'transaction-icon';

        icon.textContent = transaction.type === 'income'
            ? '↗'
            : '↘';


        const details = document.createElement('div');

        details.className = 'transaction-details';


        const description = document.createElement('span');

        description.className = 'transaction-description';

        description.textContent = transaction.description;


        const meta = document.createElement('span');

        meta.className = 'transaction-meta';

        meta.textContent =
            `${transaction.category} · ${formatDate(transaction.date)}`;


        details.append(description, meta);

        main.append(icon, details);


        // RIGHT SIDE

        const right = document.createElement('div');

        right.className = 'transaction-right';


        const amount = document.createElement('span');

        amount.className = 'transaction-amount';


        const sign = transaction.type === 'income'
            ? '+'
            : '−';


        amount.textContent =
            `${sign}${formatMoney(transaction.amount, transaction.currency)}`;


        const deleteButton = document.createElement('button');

        deleteButton.type = 'button';

        deleteButton.className = 'delete-transaction';

        deleteButton.dataset.id = transaction.id;

        deleteButton.textContent = '×';

        deleteButton.setAttribute(

            'aria-label',

            `Delete transaction: ${transaction.description}`

        );


        right.append(amount, deleteButton);

        li.append(main, right);

        transactionsEl.appendChild(li);

    });


    // EMPTY STATE

    document.getElementById('emptyTransactions').classList.toggle(

        'hidden',

        transactions.length > 0

    );


    // TRANSACTION COUNT

    const count = transactions.length;

    document.getElementById('transactionCount').textContent =

        `${count} ${count === 1 ? 'transaction' : 'transactions'}`;

}


// DELETE TRANSACTION

function handleTransactionAction(event) {

    const button = event.target.closest('.delete-transaction');

    if (!button) return;


    const id = button.dataset.id;


    const transaction = transactions.find(

        item => item.id === id

    );


    if (!transaction) return;


    const confirmed = window.confirm(

        `Delete "${transaction.description}"?`

    );


    if (!confirmed) return;


    transactions = transactions.filter(

        item => item.id !== id

    );


    if (transactions.length === 0) {

        budgetCurrency = null;

    }


    persistBudget();

    renderTransactions();

    updateDashboard();

    updateChart();

    updateCurrencyLock();


    showMessage('Transaction deleted successfully.');

}


// CALCULATE TOTALS

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === 'income') {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });


    return {

        income,

        expense,

        savings: income - expense

    };

}


// UPDATE DASHBOARD

function updateDashboard() {

    const totals = calculateTotals();

    const currency = budgetCurrency || currencySelect.value;

    const balance = totals.income - totals.expense;


    // MAIN BALANCE

    balanceEl.textContent = formatMoney(balance, currency);


    // SUMMARY CARDS

    document.getElementById('totalIncome').textContent =

        formatMoney(totals.income, currency);


    document.getElementById('totalExpense').textContent =

        formatMoney(totals.expense, currency);


    document.getElementById('totalSavings').textContent =

        formatMoney(totals.savings, currency);


    updateSuggestion(totals);

}


// FINANCIAL SUGGESTION

function updateSuggestion(totals) {

    const suggestion = document.getElementById('suggestion');


    if (transactions.length === 0) {

        suggestion.textContent =

            'Start tracking your finances today.';

        return;

    }


    if (totals.expense > totals.income) {

        suggestion.textContent =

            '⚠ Your expenses are higher than your income. Review your spending.';

        return;

    }


    if (totals.income === 0 && totals.expense === 0) {

        suggestion.textContent =

            'Add your first transaction to view your budget.';

        return;

    }


    if (

        totals.income > 0 &&

        totals.expense / totals.income > 0.7

    ) {

        suggestion.textContent =

            '⚠ You are using more than 70% of your income. Consider saving more.';

        return;

    }


    suggestion.textContent =

        '✓ Your budget is looking positive. Keep managing your money wisely!';

}


// UPDATE CHART

function updateChart() {

    if (typeof Chart === 'undefined') {

        chartEmpty.textContent =

            'Chart library unavailable. Your transactions are still saved.';

        chartEmpty.classList.remove('hidden');

        return;

    }


    const totals = calculateTotals();


    const hasTransactions = transactions.length > 0;


    chartEmpty.classList.toggle(

        'hidden',

        hasTransactions

    );


    const dark = document.body.classList.contains('dark');

    const textColor = dark ? '#d5e4da' : '#64746b';


    if (chart) {

        chart.destroy();

        chart = null;

    }


    chart = new Chart(chartCanvas, {

        type: 'doughnut',

        data: {

            labels: [

                'Income',

                'Expenses'

            ],

            datasets: [{

                data: [

                    totals.income,

                    totals.expense

                ],

                backgroundColor: [

                    '#239b69',

                    '#ed786c'

                ],

                borderColor: dark

                    ? ['#1a2a22', '#1a2a22']

                    : ['#ffffff', '#ffffff'],

                borderWidth: 4,

                hoverOffset: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: '70%',

            animation: {

                duration: 450

            },

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    enabled: hasTransactions,

                    callbacks: {

                        label(context) {

                            return `${context.label}: ${formatMoney(

                                context.parsed,

                                budgetCurrency || currencySelect.value

                            )}`;

                        }

                    }

                }

            }

        }

    });

}


// SAVE BUDGET

function persistBudget() {

    try {

        localStorage.setItem(

            STORAGE_KEYS.transactions,

            JSON.stringify(transactions)

        );


        localStorage.setItem(

            STORAGE_KEYS.currency,

            budgetCurrency || ''

        );


        return true;

    } catch (error) {

        console.error('Save error:', error);

        showMessage(

            'Unable to save budget. Check browser storage.',

            true

        );

        return false;

    }

}


function saveBudget() {

    if (!persistBudget()) return;


    showMessage('Budget saved successfully! ✓');

}


// LOAD SAVED BUDGET

function loadBudget() {

    try {

        const saved = localStorage.getItem(

            STORAGE_KEYS.transactions

        );


        const data = saved ? JSON.parse(saved) : [];


        transactions = Array.isArray(data)

            ? data.filter(isValidSavedTransaction)

            : [];


        const savedCurrency = localStorage.getItem(

            STORAGE_KEYS.currency

        );


        const validCurrencies = Array.from(

            currencySelect.options

        ).map(option => option.value);


        budgetCurrency = savedCurrency &&

            validCurrencies.includes(savedCurrency)

            ? savedCurrency

            : (

                transactions.length > 0

                    ? transactions[0].currency

                    : null

            );


        // Keep all totals in one currency.

        if (budgetCurrency) {

            transactions = transactions.filter(

                transaction => transaction.currency === budgetCurrency

            );


            currencySelect.value = budgetCurrency;

        }


        updateCurrencyLock();

        renderTransactions();


    } catch (error) {

        console.error('Unable to load budget:', error);

        transactions = [];

        budgetCurrency = null;

    }

}


// VALIDATE SAVED TRANSACTION

function isValidSavedTransaction(item) {

    return Boolean(

        item &&

        typeof item.id === 'string' &&

        typeof item.description === 'string' &&

        Number.isFinite(Number(item.amount)) &&

        Number(item.amount) > 0 &&

        ['income', 'expense'].includes(item.type) &&

        typeof item.date === 'string' &&

        typeof item.currency === 'string'

    );

}


// LOCK CURRENCY WHEN RECORDS EXIST

function updateCurrencyLock() {

    const locked = transactions.length > 0;


    currencySelect.disabled = locked;


    const help = document.getElementById('currencyHelp');


    help.textContent = locked

        ? `Currency locked to ${budgetCurrency}. Remove all transactions to change currency.`

        : 'Choose one currency for this budget.';


}


// HANDLE CURRENCY CHANGES

function handleCurrencyChange() {

    if (

        budgetCurrency &&

        currencySelect.value !== budgetCurrency

    ) {

        currencySelect.value = budgetCurrency;

        showMessage(

            'Remove all existing transactions before changing currency.',

            true

        );

    }

}


// DOWNLOAD CSV

function downloadBudget() {

    if (transactions.length === 0) {

        showMessage(

            'Add transactions before downloading a report.',

            true

        );

        return;

    }


    const headers = [

        'Date',

        'Description',

        'Category',

        'Type',

        'Amount',

        'Currency'

    ];


    const rows = transactions.map(transaction => [

        transaction.date,

        transaction.description,

        transaction.category,

        transaction.type,

        transaction.amount,

        transaction.currency

    ]);


    const escapeCSV = value =>

        `"${String(value).replace(/"/g, '""')}"`;


    const csv = [

        headers,

        ...rows

    ]

        .map(row => row.map(escapeCSV).join(','))

        .join('\n');


    const blob = new Blob(

        ['\uFEFF', csv],

        {

            type: 'text/csv;charset=utf-8;'

        }

    );


    const url = URL.createObjectURL(blob);


    const link = document.createElement('a');

    link.href = url;

    link.download = 'mini-budget-report.csv';


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);


    showMessage('Budget report downloaded successfully!');

}


// PRINT REPORT

function printBudget() {

    if (transactions.length === 0) {

        showMessage(

            'Add transactions before printing your report.',

            true

        );

        return;

    }


    window.print();

}


// CLEAR BUDGET

function clearBudget() {

    if (transactions.length === 0) {

        showMessage('There are no transactions to clear.', true);

        return;

    }


    const confirmed = window.confirm(

        'Are you sure you want to delete all saved transactions? This cannot be undone.'

    );


    if (!confirmed) return;


    transactions = [];

    budgetCurrency = null;


    persistBudget();


    currencySelect.disabled = false;

    currencySelect.value = 'USD';


    renderTransactions();

    updateDashboard();

    updateChart();

    updateCurrencyLock();


    showMessage('All transactions have been cleared.');

}


// DARK MODE

function loadTheme() {

    const savedTheme = localStorage.getItem(

        STORAGE_KEYS.theme

    );


    if (savedTheme === 'dark') {

        document.body.classList.add('dark');

    }


    updateThemeButton();

}


function toggleDarkMode() {

    document.body.classList.toggle('dark');


    const theme = document.body.classList.contains('dark')

        ? 'dark'

        : 'light';


    localStorage.setItem(

        STORAGE_KEYS.theme,

        theme

    );


    updateThemeButton();

    updateChart();

}


function updateThemeButton() {

    const dark = document.body.classList.contains('dark');


    darkBtn.textContent = dark ? '☀️' : '🌙';

    darkBtn.setAttribute(

        'aria-pressed',

        String(dark)

    );

    darkBtn.setAttribute(

        'aria-label',

        dark ? 'Switch to light mode' : 'Switch to dark mode'

    );

}