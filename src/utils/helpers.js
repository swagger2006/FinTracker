const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "2-digit",
});

export const formatCurrency = (value) => currencyFormatter.format(value || 0);

export const formatDate = (value) => shortDateFormatter.format(new Date(value));

export const getMonthKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const getMonthLabel = (value) => monthFormatter.format(new Date(value));

export const getUniqueCategories = (transactions) =>
  [...new Set(transactions.map((tx) => tx.category))].sort();

export const applyTransactionFilters = (transactions, filters) => {
  const query = filters.query.trim().toLowerCase();

  return [...transactions]
    .filter((tx) => {
      const matchesQuery =
        !query ||
        [tx.description, tx.merchant, tx.category, tx.type]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesType = filters.type === "all" || tx.type === filters.type;
      const matchesCategory =
        filters.category === "all" || tx.category === filters.category;

      return matchesQuery && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "amountHigh":
          return b.amount - a.amount;
        case "amountLow":
          return a.amount - b.amount;
        case "newest":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
};

export const getSummary = (transactions) => {
  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") {
        acc.income += tx.amount;
      } else {
        acc.expenses += tx.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 },
  );

  const balance = totals.income - totals.expenses;
  const savingsRate = totals.income
    ? Math.round((balance / totals.income) * 100)
    : 0;

  return {
    balance,
    income: totals.income,
    expenses: totals.expenses,
    savingsRate,
  };
};

export const getTrendData = (transactions) => {
  const grouped = transactions.reduce((acc, tx) => {
    const key = getMonthKey(tx.date);
    if (!acc[key]) {
      acc[key] = {
        month: key,
        label: getMonthLabel(tx.date),
        income: 0,
        expenses: 0,
      };
    }

    if (tx.type === "income") {
      acc[key].income += tx.amount;
    } else {
      acc[key].expenses += tx.amount;
    }

    return acc;
  }, {});

  let runningBalance = 0;

  return Object.values(grouped)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((entry) => {
      runningBalance += entry.income - entry.expenses;
      return {
        label: entry.label,
        income: entry.income,
        expenses: entry.expenses,
        balance: runningBalance,
      };
    });
};

export const getCategoryBreakdown = (transactions) =>
  Object.values(
    transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => {
        if (!acc[tx.category]) {
          acc[tx.category] = {
            name: tx.category,
            value: 0,
          };
        }

        acc[tx.category].value += tx.amount;
        return acc;
      }, {}),
  ).sort((a, b) => b.value - a.value);

export const getInsights = (transactions) => {
  const summary = getSummary(transactions);
  const monthlyTrend = getTrendData(transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const expenses = transactions.filter((tx) => tx.type === "expense");

  const largestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
  const topCategory = breakdown[0];
  const latestMonth = monthlyTrend.at(-1);
  const previousMonth = monthlyTrend.at(-2);
  const monthlyExpenseChange =
    latestMonth && previousMonth
      ? latestMonth.expenses - previousMonth.expenses
      : 0;

  const observation =
    summary.savingsRate >= 50
      ? "Savings rate is strong this period, leaving room for long-term investing."
      : "Spending is rising faster than savings, so discretionary costs deserve attention.";

  return {
    topCategory,
    largestExpense,
    latestMonth,
    previousMonth,
    monthlyExpenseChange,
    observation,
  };
};

const escapeCsvValue = (value) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

export const exportTransactionsToCsv = (transactions) => {
  const headers = [
    "ID",
    "Date",
    "Description",
    "Merchant",
    "Category",
    "Type",
    "Amount",
  ];

  const rows = transactions.map((tx) => [
    tx.id,
    tx.date,
    tx.description,
    tx.merchant,
    tx.category,
    tx.type,
    tx.amount,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);

  link.href = URL.createObjectURL(blob);
  link.download = `fintracker-transactions-${stamp}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
