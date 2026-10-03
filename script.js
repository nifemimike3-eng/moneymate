/* =========================================================
   MONEYMATE V3
   COMPLETE SCRIPT.JS
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const TRANSACTIONS_KEY = "moneymate_transactions_v3";
const GOAL_KEY = "moneymate_goal_v3";
const THEME_KEY = "moneymate_theme_v3";


let transactions =
    JSON.parse(
        localStorage.getItem(TRANSACTIONS_KEY)
    ) || [];

let savingsGoal =
    JSON.parse(
        localStorage.getItem(GOAL_KEY)
    ) || {
        name: "",
        target: 0
    };

let currentFilter = "all";


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    document.querySelectorAll(selector);


/* =========================================================
   ELEMENTS
   ========================================================= */

const totalBalance = $("#totalBalance");
const totalIncome = $("#totalIncome");
const totalExpense = $("#totalExpense");

const monthIncome = $("#monthIncome");
const monthExpense = $("#monthExpense");

const currentMonth = $("#currentMonth");

const spendingPercent = $("#spendingPercent");
const spendingProgress = $("#spendingProgress");

const spendingChart = $("#spendingChart");

const homeTransactions = $("#homeTransactions");
const transactionList = $("#transactionList");

const searchInput = $("#searchInput");

const transactionForm = $("#transactionForm");

const descriptionInput = $("#description");
const amountInput = $("#amount");
const categoryInput = $("#category");
const transactionTypeInput = $("#transactionType");
const transactionDateInput = $("#transactionDate");

const statTransactions = $("#statTransactions");
const statIncome = $("#statIncome");
const statExpense = $("#statExpense");
const statCategories = $("#statCategories");

const incomeChartBar = $("#incomeChartBar");
const expenseChartBar = $("#expenseChartBar");

const chartIncomeValue = $("#chartIncomeValue");
const chartExpenseValue = $("#chartExpenseValue");

const categoryStats = $("#categoryStats");

const goalName = $("#goalName");
const goalTarget = $("#goalTarget");
const savedAmount = $("#savedAmount");
const goalProgress = $("#goalProgress");
const goalPercent = $("#goalPercent");
const goalRemaining = $("#goalRemaining");

const moneyAdvice = $("#moneyAdvice");

const toast = $("#toast");
const toastIcon = $("#toastIcon");
const toastMessage = $("#toastMessage");

const goalModal = $("#goalModal");
const confirmModal = $("#confirmModal");

const goalNameInput = $("#goalNameInput");
const goalAmountInput = $("#goalAmountInput");

const importFile = $("#importFile");


/* =========================================================
   INITIAL SETUP
   ========================================================= */

function init() {

    setDefaultDate();

    loadTheme();

    setupNavigation();

    setupTransactionType();

    setupQuickActions();

    setupFilters();

    setupSearch();

    setupTransactionForm();

    setupSavingsGoal();

    setupDataManagement();

    setupModals();

    updateEverything();
}


/* =========================================================
   MONEY FORMAT
   ========================================================= */

function formatMoney(value) {

    const number = Number(value) || 0;

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2
        }
    ).format(number);
}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveTransactions() {

    localStorage.setItem(
        TRANSACTIONS_KEY,
        JSON.stringify(transactions)
    );
}


function saveGoal() {

    localStorage.setItem(
        GOAL_KEY,
        JSON.stringify(savingsGoal)
    );
}


/* =========================================================
   DEFAULT DATE
   ========================================================= */

function setDefaultDate() {

    if (!transactionDateInput) return;

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    transactionDateInput.value = today;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navItems =
        $$(".nav-item");

    navItems.forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                const pageId =
                    item.dataset.page;

                showPage(pageId);

            }
        );

    });


    if (viewAllHome) {

        viewAllHome.addEventListener(
            "click",
            () => {

                showPage("transactionsPage");

            }
        );

    }

}


function showPage(pageId) {

    $$(".page").forEach((page) => {

        page.classList.remove(
            "active-page"
        );

    });


    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    $$(".nav-item").forEach((item) => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

function setupQuickActions() {

    const quickIncome =
        $("#quickIncome");

    const quickExpense =
        $("#quickExpense");


    if (quickIncome) {

        quickIncome.addEventListener(
            "click",
            () => {

                showPage("addPage");

                setTransactionType(
                    "income"
                );

            }
        );

    }


    if (quickExpense) {

        quickExpense.addEventListener(
            "click",
            () => {

                showPage("addPage");

                setTransactionType(
                    "expense"
                );

            }
        );

    }

}


/* =========================================================
   TRANSACTION TYPE
   ========================================================= */

function setupTransactionType() {

    const buttons =
        $$(".type-btn");

    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                setTransactionType(
                    button.dataset.type
                );

            }
        );

    });

}


function setTransactionType(type) {

    transactionTypeInput.value =
        type;


    $$(".type-btn").forEach(
        (button) => {

            button.classList.toggle(
                "active",
                button.dataset.type === type
            );

        }
    );

}


/* =========================================================
   ADD TRANSACTION
   ========================================================= */

function setupTransactionForm() {

    if (!transactionForm) return;


    transactionForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            addTransaction();

        }
    );

}


function addTransaction() {

    const description =
        descriptionInput.value.trim();

    const amount =
        Number(amountInput.value);

    const category =
        categoryInput.value;

    const type =
        transactionTypeInput.value;

    const date =
        transactionDateInput.value;


    if (!description) {

        showToast(
            "Please enter a description.",
            "!"
        );

        return;
    }


    if (!amount || amount <= 0) {

        showToast(
            "Please enter a valid amount.",
            "!"
        );

        return;
    }


    if (!date) {

        showToast(
            "Please select a date.",
            "!"
        );

        return;
    }


    const transaction = {

        id:
            Date.now().toString(),

        description,

        amount,

        category,

        type,

        date,

        createdAt:
            new Date().toISOString()

    };


    transactions.unshift(
        transaction
    );


    saveTransactions();

    transactionForm.reset();

    setTransactionType("income");

    setDefaultDate();

    updateEverything();

    showPage("homePage");

    showToast(
        type === "income"
            ? "Income added successfully."
            : "Expense added successfully."
    );

}


/* =========================================================
   CALCULATIONS
   ========================================================= */

function getTotalIncome() {

    return transactions
        .filter(
            (transaction) =>
                transaction.type === "income"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

}


function getTotalExpense() {

    return transactions
        .filter(
            (transaction) =>
                transaction.type === "expense"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

}


function getBalance() {

    return (
        getTotalIncome() -
        getTotalExpense()
    );

}


/* =========================================================
   MONTHLY DATA
   ========================================================= */

function getCurrentMonthTransactions() {

    const now = new Date();

    const month =
        now.getMonth();

    const year =
        now.getFullYear();


    return transactions.filter(
        (transaction) => {

            const date =
                new Date(transaction.date);

            return (
                date.getMonth() === month &&
                date.getFullYear() === year
            );

        }
    );

}


function getMonthIncome() {

    return getCurrentMonthTransactions()
        .filter(
            (transaction) =>
                transaction.type === "income"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

}


function getMonthExpense() {

    return getCurrentMonthTransactions()
        .filter(
            (transaction) =>
                transaction.type === "expense"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    const income =
        getTotalIncome();

    const expense =
        getTotalExpense();

    const balance =
        income - expense;


    totalIncome.textContent =
        formatMoney(income);

    totalExpense.textContent =
        formatMoney(expense);

    totalBalance.textContent =
        formatMoney(balance);


    const mIncome =
        getMonthIncome();

    const mExpense =
        getMonthExpense();


    monthIncome.textContent =
        formatMoney(mIncome);

    monthExpense.textContent =
        formatMoney(mExpense);


    const monthName =
        new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(new Date());


    currentMonth.textContent =
        monthName;


    let percent = 0;

    if (mIncome > 0) {

        percent =
            (mExpense / mIncome) * 100;

    }


    percent =
        Math.min(
            Math.round(percent),
            100
        );


    spendingPercent.textContent =
        `${percent}%`;

    spendingProgress.style.width =
        `${percent}%`;


    updateAdvice(
        income,
        expense,
        balance
    );

}


/* =========================================================
   MONEY ADVICE
   ========================================================= */

function updateAdvice(
    income,
    expense,
    balance
) {

    if (transactions.length === 0) {

        moneyAdvice.textContent =
            "Start adding transactions and MoneyMate will give you useful money insights.";

        return;
    }


    if (income === 0 && expense > 0) {

        moneyAdvice.textContent =
            "You have recorded expenses but no income yet. Keep tracking everything so you can understand your spending.";

        return;
    }


    if (balance < 0) {

        moneyAdvice.textContent =
            "Your recorded expenses are currently higher than your income. Review your recent expenses and look for areas you can reduce.";

        return;
    }


    if (income > 0) {

        const ratio =
            expense / income;


        if (ratio <= 0.5) {

            moneyAdvice.textContent =
                "Nice work. Your recorded spending is below half of your income. Keep tracking and consider setting a savings goal.";

        } else if (ratio <= 0.8) {

            moneyAdvice.textContent =
                "You're doing fairly well, but a large part of your income is being spent. Review your biggest categories.";

        } else {

            moneyAdvice.textContent =
                "Most of your recorded income is being spent. Check your largest expenses and see where you can cut back.";

        }

    }

}


/* =========================================================
   HOME TRANSACTIONS
   ========================================================= */

function renderHomeTransactions() {

    if (!homeTransactions) return;


    const recent =
        transactions.slice(0, 5);


    if (recent.length === 0) {

        homeTransactions.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💸</div>
                <h3>No transactions yet</h3>
                <p>
                    Add your first income or expense
                    to start tracking your money.
                </p>
            </div>
        `;

        return;
    }


    homeTransactions.innerHTML =
        recent
            .map(
                transactionHTML
            )
            .join("");

}


/* =========================================================
   ALL TRANSACTIONS
   ========================================================= */

function renderTransactions() {

    if (!transactionList) return;


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let filtered =
        [...transactions];


    if (currentFilter !== "all") {

        filtered =
            filtered.filter(
                (transaction) =>
                    transaction.type ===
                    currentFilter
            );

    }


    if (search) {

        filtered =
            filtered.filter(
                (transaction) => {

                    const text =
                        `${transaction.description}
                        ${transaction.category}
                        ${transaction.type}`
                            .toLowerCase();

                    return text.includes(search);

                }
            );

    }


    if (filtered.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔎</div>
                <h3>No transactions found</h3>
                <p>
                    Try another search or add a new transaction.
                </p>
            </div>
        `;

        return;
    }


    transactionList.innerHTML =
        filtered
            .map(
                transactionHTML
            )
            .join("");

}


/* =========================================================
   TRANSACTION HTML
   ========================================================= */

function transactionHTML(transaction) {

    const isIncome =
        transaction.type === "income";


    const sign =
        isIncome ? "+" : "-";


    const icon =
        getCategoryIcon(
            transaction.category,
            transaction.type
        );


    return `
        <div class="transaction-item">

            <div class="transaction-icon ${transaction.type}">
                ${icon}
            </div>

            <div class="transaction-info">

                <strong>
                    ${escapeHTML(
                        transaction.description
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        transaction.category
                    )}
                </span>

            </div>

            <div class="transaction-right">

                <span class="transaction-amount ${transaction.type}">
                    ${sign}${formatMoney(
                        transaction.amount
                    )}
                </span>

                <span class="transaction-date">
                    ${formatDate(
                        transaction.date
                    )}
                </span>

            </div>

            <button
                class="delete-btn"
                data-delete="${transaction.id}"
                aria-label="Delete transaction">
                🗑️
            </button>

        </div>
    `;

}


/* =========================================================
   DELETE TRANSACTION
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-delete]"
            );


        if (!button) return;


        const id =
            button.dataset.delete;


        const transaction =
            transactions.find(
                (item) =>
                    item.id === id
            );


        if (!transaction) return;


        const confirmed =
            confirm(
                `Delete "${transaction.description}"?`
            );


        if (!confirmed) return;


        transactions =
            transactions.filter(
                (item) =>
                    item.id !== id
            );


        saveTransactions();

        updateEverything();

        showToast(
            "Transaction deleted."
        );

    }
);


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        renderTransactions
    );

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupFilters() {

    $$(".filter-btn").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    currentFilter =
                        button.dataset.filter;


                    $$(".filter-btn")
                        .forEach(
                            (btn) => {

                                btn.classList.toggle(
                                    "active",
                                    btn === button
                                );

                            }
                        );


                    renderTransactions();

                }
            );

        }
    );

}


/* =========================================================
   CATEGORY ICONS
   ========================================================= */

function getCategoryIcon(
    category,
    type
) {

    if (type === "income") {
        return "💰";
    }


    const icons = {

        Food: "🍔",

        Transport: "🚌",

        Shopping: "🛍️",

        Bills: "📄",

        School: "🎓",

        Business: "💼",

        Entertainment: "🎮",

        Health: "❤️",

        Family: "👨‍👩‍👧",

        Other: "📦"

    };


    return icons[category] || "📦";

}


/* =========================================================
   SPENDING BREAKDOWN
   ========================================================= */

function renderSpendingChart() {

    if (!spendingChart) return;


    const expenses =
        transactions.filter(
            (transaction) =>
                transaction.type === "expense"
        );


    if (expenses.length === 0) {

        spendingChart.innerHTML = `
            <div class="empty-chart">
                <div>📊</div>
                <p>No expenses yet</p>
                <small>
                    Add an expense to see your spending
                </small>
            </div>
        `;

        return;
    }


    const categories = {};


    expenses.forEach(
        (transaction) => {

            const category =
                transaction.category;

            categories[category] =
                (categories[category] || 0) +
                Number(transaction.amount);

        }
    );


    const sorted =
        Object.entries(categories)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    const highest =
        sorted[0][1];


    spendingChart.innerHTML =
        sorted
            .map(
                ([category, amount]) => {

                    const percent =
                        highest > 0
                            ? (amount / highest) * 100
                            : 0;


                    return `
                        <div class="chart-row">

                            <span class="chart-name">
                                ${getCategoryIcon(
                                    category,
                                    "expense"
                                )}
                                ${escapeHTML(category)}
                            </span>

                            <div class="chart-track">
                                <div
                                    class="chart-bar-fill"
                                    style="width:${percent}%">
                                </div>
                            </div>

                            <span class="chart-amount">
                                ${formatMoney(amount)}
                            </span>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

    const income =
        getTotalIncome();

    const expense =
        getTotalExpense();


    statTransactions.textContent =
        transactions.length;


    statIncome.textContent =
        transactions.filter(
            (transaction) =>
                transaction.type === "income"
        ).length;


    statExpense.textContent =
        transactions.filter(
            (transaction) =>
                transaction.type === "expense"
        ).length;


    const categories =
        new Set(
            transactions.map(
                (transaction) =>
                    transaction.category
            )
        );


    statCategories.textContent =
        categories.size;


    chartIncomeValue.textContent =
        formatMoney(income);

    chartExpenseValue.textContent =
        formatMoney(expense);


    const max =
        Math.max(
            income,
            expense,
            1
        );


    const incomeHeight =
        Math.max(
            (income / max) * 180,
            4
        );


    const expenseHeight =
        Math.max(
            (expense / max) * 180,
            4
        );


    incomeChartBar.style.height =
        `${incomeHeight}px`;

    expenseChartBar.style.height =
        `${expenseHeight}px`;


    renderCategoryStats();

}


/* =========================================================
   CATEGORY STATISTICS
   ========================================================= */

function renderCategoryStats() {

    const expenses =
        transactions.filter(
            (transaction) =>
                transaction.type === "expense"
        );


    if (expenses.length === 0) {

        categoryStats.innerHTML = `
            <div class="empty-state small-empty">
                <div class="empty-icon">📊</div>
                <p>
                    Add expenses to see category statistics.
                </p>
            </div>
        `;

        return;
    }


    const categories = {};


    expenses.forEach(
        (transaction) => {

            categories[
                transaction.category
            ] =
                (categories[
                    transaction.category
                ] || 0) +
                Number(transaction.amount);

        }
    );


    const total =
        expenses.reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );


    const sorted =
        Object.entries(categories)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    categoryStats.innerHTML =
        sorted
            .map(
                ([category, amount]) => {

                    const percent =
                        total > 0
                            ? (amount / total) * 100
                            : 0;


                    return `
                        <div class="category-stat">

                            <div class="category-stat-top">

                                <span>
                                    ${getCategoryIcon(
                                        category,
                                        "expense"
                                    )}
                                    ${escapeHTML(category)}
                                </span>

                                <strong>
                                    ${formatMoney(amount)}
                                </strong>

                            </div>

                            <div class="category-progress">

                                <div
                                    class="category-progress-fill"
                                    style="width:${percent}%">
                                </div>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   SAVINGS GOAL
   ========================================================= */

function setupSavingsGoal() {

    const setGoalBtn =
        $("#setGoalBtn");

    const saveGoalBtn =
        $("#saveGoalBtn");


    if (setGoalBtn) {

        setGoalBtn.addEventListener(
            "click",
            openGoalModal
        );

    }


    if (saveGoalBtn) {

        saveGoalBtn.addEventListener(
            "click",
            saveSavingsGoal
        );

    }

}


function openGoalModal() {

    goalNameInput.value =
        savingsGoal.name || "";

    goalAmountInput.value =
        savingsGoal.target || "";


    goalModal.classList.add(
        "show"
    );

}


function saveSavingsGoal() {

    const name =
        goalNameInput.value.trim();

    const target =
        Number(
            goalAmountInput.value
        );


    if (!name) {

        showToast(
            "Enter a goal name.",
            "!"
        );

        return;
    }


    if (!target || target <= 0) {

        showToast(
            "Enter a valid target amount.",
            "!"
        );

        return;
    }


    savingsGoal = {

        name,

        target

    };


    saveGoal();

    updateSavings();

    closeGoalModal();

    showToast(
        "Savings goal saved."
    );

}


/* =========================================================
   SAVINGS DISPLAY
   ========================================================= */

function updateSavings() {

    const target =
        Number(savingsGoal.target) || 0;


    const balance =
        Math.max(
            getBalance(),
            0
        );


    if (!target) {

        goalName.textContent =
            "No savings goal";

        goalTarget.textContent =
            formatMoney(0);

        savedAmount.textContent =
            formatMoney(0);

        goalPercent.textContent =
            "0% completed";

        goalRemaining.textContent =
            "₦0.00 remaining";

        goalProgress.style.width =
            "0%";

        return;
    }


    const saved =
        Math.min(
            balance,
            target
        );


    const percent =
        Math.min(
            Math.round(
                (saved / target) * 100
            ),
            100
        );


    const remaining =
        Math.max(
            target - saved,
            0
        );


    goalName.textContent =
        savingsGoal.name;

    goalTarget.textContent =
        formatMoney(target);

    savedAmount.textContent =
        formatMoney(saved);

    goalPercent.textContent =
        `${percent}% completed`;

    goalRemaining.textContent =
        `${formatMoney(remaining)} remaining`;

    goalProgress.style.width =
        `${percent}%`;

}


/* =========================================================
   MODALS
   ========================================================= */

function setupModals() {

    const closeGoalModalBtn =
        $("#closeGoalModal");

    const cancelClear =
        $("#cancelClear");


    if (closeGoalModalBtn) {

        closeGoalModalBtn.addEventListener(
            "click",
            closeGoalModal
        );

    }


    if (cancelClear) {

        cancelClear.addEventListener(
            "click",
            closeConfirmModal
        );

    }


    goalModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                goalModal
            ) {

                closeGoalModal();

            }

        }
    );


    confirmModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                confirmModal
            ) {

                closeConfirmModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeGoalModal();

                closeConfirmModal();

            }

        }
    );

}


function closeGoalModal() {

    goalModal.classList.remove(
        "show"
    );

}


function closeConfirmModal() {

    confirmModal.classList.remove(
        "show"
    );

}


/* =========================================================
   DATA MANAGEMENT
   ========================================================= */

function setupDataManagement() {

    const exportBtn =
        $("#exportBtn");

    const importBtn =
        $("#importBtn");

    const clearDataBtn =
        $("#clearDataBtn");

    const confirmClear =
        $("#confirmClear");


    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            exportData
        );

    }


    if (importBtn) {

        importBtn.addEventListener(
            "click",
            () => {

                importFile.click();

            }
        );

    }


    if (importFile) {

        importFile.addEventListener(
            "change",
            importData
        );

    }


    if (clearDataBtn) {

        clearDataBtn.addEventListener(
            "click",
            () => {

                confirmModal.classList.add(
                    "show"
                );

            }
        );

    }


    if (confirmClear) {

        confirmClear.addEventListener(
            "click",
            clearAllData
        );

    }

}


/* =========================================================
   EXPORT
   ========================================================= */

function exportData() {

    const backup = {

        app: "MoneyMate",

        version: "3.0",

        exportedAt:
            new Date().toISOString(),

        transactions,

        savingsGoal

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    const date =
        new Date()
            .toISOString()
            .split("T")[0];


    link.href = url;

    link.download =
        `MoneyMate-backup-${date}.json`;


    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);


    showToast(
        "Backup exported successfully."
    );

}


/* =========================================================
   IMPORT
   ========================================================= */

function importData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        (e) => {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );


                if (
                    !data ||
                    !Array.isArray(
                        data.transactions
                    )
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                transactions =
                    data.transactions;


                if (
                    data.savingsGoal &&
                    typeof data.savingsGoal ===
                    "object"
                ) {

                    savingsGoal =
                        data.savingsGoal;

                }


                saveTransactions();

                saveGoal();

                updateEverything();


                showToast(
                    "Backup imported successfully."
                );


            } catch (error) {

                showToast(
                    "This backup file is not valid.",
                    "!"
                );

            }


            importFile.value = "";

        };


    reader.readAsText(file);

}


/* =========================================================
   CLEAR ALL DATA
   ========================================================= */

function clearAllData() {

    transactions = [];

    savingsGoal = {
        name: "",
        target: 0
    };


    saveTransactions();

    saveGoal();

    updateEverything();

    closeConfirmModal();


    showToast(
        "All MoneyMate data has been cleared."
    );

}


/* =========================================================
   DARK MODE
   ========================================================= */

function setupTheme() {

    const themeBtn =
        $("#themeBtn");


    if (!themeBtn) return;


    themeBtn.addEventListener(
        "click",
        toggleTheme
    );

}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeButton();

    setupTheme();

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
    );


    updateThemeButton();

}


function updateThemeButton() {

    const themeBtn =
        $("#themeBtn");


    if (!themeBtn) return;


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    themeBtn.textContent =
        isDark ? "☀️" : "🌙";

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return new Intl.DateTimeFormat(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(date);

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(
    message,
    icon = "✓"
) {

    toastMessage.textContent =
        message;

    toastIcon.textContent =
        icon;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateEverything() {

    updateDashboard();

    renderHomeTransactions();

    renderTransactions();

    renderSpendingChart();

    updateStatistics();

    updateSavings();

}


/* =========================================================
   START APP
   ========================================================= */

const viewAllHome =
    $("#viewAllHome");


init();