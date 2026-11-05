# 💰 Mini Budget Planner

A modern and responsive personal finance management web application designed to help users track income, monitor expenses, manage transactions, and understand their financial position.

---

## 📌 Project Overview

Mini Budget Planner is a browser-based budgeting application that provides a simple way to organize personal financial records.

Users can record their income and expenses, view their current balance, monitor net savings, and visualize their financial activity through an interactive chart.

The application also includes dark mode, transaction management, CSV report downloads, and browser-based data storage.

## ✨ Features

### 💵 Income Management
- Record income transactions.
- Add transaction descriptions.
- Select transaction dates.
- Organize income by category.
- View total income automatically.

### 💸 Expense Management
- Record daily expenses.
- Categorize spending activities.
- Delete unwanted transactions.
- View total expenses automatically.

### 💰 Financial Overview
- View the current balance.
- Calculate net savings.
- Compare total income and expenses.
- Receive simple budget suggestions.

### 📊 Interactive Financial Chart
- Doughnut chart displaying income and expenses.
- Visual comparison of financial activity.
- Automatically updates when transactions change.

### 🌙 Dark Mode
- Switch between light and dark themes.
- Save theme preferences in the browser.
- Comfortable viewing experience.

### 💱 Multiple Currency Support
- Supports USD, LKR, EUR, GBP, INR, JPY, and other currencies.
- Select one currency for each budget.
- Prevents direct addition of transactions in different currencies.

*Note: Currency selection does not perform exchange-rate conversion.*

### 💾 Data Management
- Save budget information using browser Local Storage.
- Retain transactions after refreshing the page.
- Delete individual transactions.
- Clear all saved budget transactions.

### 📥 Download and Print
- Download transaction reports as CSV files.
- Open downloaded reports using spreadsheet applications.
- Print financial reports or save them as PDF.

### 📱 Responsive Design
- Modern financial dashboard interface.
- Responsive desktop and mobile layouts.
- Interactive buttons and form controls.
- Smooth visual transitions.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Budget calculations and application functionality |
| Chart.js | Interactive financial charts |
| Local Storage | Browser-based data persistence |
| Google Fonts | Poppins typography |
| Google Analytics | Website usage analytics |

## 📂 Project Structure

```text
Mini-Budget-Planner/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- An internet connection for external resources such as Chart.js and Google Fonts.

### Run Locally

1. Clone the repository:

```bash
git clone https://github.com/rithmymanathunga/Mini-Budget-Planner.git

2. Open the project folder.

3. Open `index.html` in your web browser.

No additional installation or backend setup is required.

## 📊 Financial Calculations

The application uses the following calculations:

| Metric | Calculation |
|---|---|
| Total Income | Sum of all income transactions |
| Total Expenses | Sum of all expense transactions |
| Net Savings | Total Income − Total Expenses |
| Current Balance | Total Income − Total Expenses |

All transactions within one budget must use the same currency.

## 💾 Data Storage

Mini Budget Planner uses the browser's Local Storage to save financial transactions and theme preferences.

This means:

- Data remains available after refreshing the page.
- Data is stored locally in the current browser.
- Data is not automatically synchronized across devices.
- Clearing browser storage may remove saved information.

**Privacy note:** This application is a personal budgeting demonstration, not a secure banking service. Avoid entering passwords, bank account credentials, or other sensitive financial information.

## 🔒 Limitations

- No user authentication system.
- No cloud database or automatic account synchronization.
- No automatic currency exchange conversion.
- No bank account integration.
- Financial suggestions are basic spending indicators, not professional financial advice.

## 🎯 Project Objectives

- Encourage better personal budgeting habits.
- Help users monitor income and expenses.
- Make everyday financial record management easier.
- Provide a visual understanding of spending and savings.
- Demonstrate practical front-end web development skills.

## 👩‍💻 Project Information

**Project Name:** Mini Budget Planner

**Type:** Personal Finance Management Web Application

**Platform:** Web Browser

**Development Technologies:** HTML, CSS and JavaScript

---

© 2026 Mini Budget Planner