import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiEdit3,
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import {
  expenseCategories,
  incomeCategories,
} from "../data/mockData";
import { useFinanceStore } from "../store/useFinanceStore";
import {
  applyTransactionFilters,
  formatCurrency,
  formatDate,
  getCategoryBreakdown,
  getInsights,
  getSummary,
  getTrendData,
  getUniqueCategories,
} from "../utils/helpers";

const chartColors = ["#d97706", "#0f766e", "#2563eb", "#9333ea", "#dc2626"];

const emptyForm = {
  id: null,
  date: "",
  description: "",
  merchant: "",
  amount: "",
  category: "Housing",
  type: "expense",
};

const SummaryCard = ({ label, value, detail, accent, icon }) => {
  const accentStyles = {
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{label}</p>
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${accentStyles[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children }) => (
  <div className="rounded-[30px] border border-white/60 bg-white/90 p-6 shadow-[0_25px_70px_rgba(148,163,184,0.15)]">
    <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
      Visualization
    </p>
    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
      {title}
    </h3>
    <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    <div className="mt-6">{children}</div>
  </div>
);

const InputShell = ({ icon, label, children }) => (
  <label className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
      {icon}
      {label}
    </div>
    <div className="mt-2">{children}</div>
  </label>
);

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

const InsightCard = ({ eyebrow, title, value, description }) => (
  <div className="rounded-[30px] border border-white/60 bg-white/90 p-6 shadow-[0_25px_70px_rgba(148,163,184,0.15)]">
    <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{eyebrow}</p>
    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
      {title}
    </h3>
    <p className="mt-4 text-3xl font-semibold text-amber-600">{value}</p>
    <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
  </div>
);

const Dashboard = () => {
  const role = useFinanceStore((state) => state.role);
  const filters = useFinanceStore((state) => state.filters);
  const transactions = useFinanceStore((state) => state.transactions);
  const setFilter = useFinanceStore((state) => state.setFilter);
  const clearFilters = useFinanceStore((state) => state.clearFilters);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const resetTransactions = useFinanceStore((state) => state.resetTransactions);

  const [form, setForm] = useState(emptyForm);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const trendData = useMemo(() => getTrendData(transactions), [transactions]);
  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(transactions),
    [transactions],
  );
  const insights = useMemo(() => getInsights(transactions), [transactions]);
  const filteredTransactions = useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters],
  );
  const availableCategories = useMemo(
    () => getUniqueCategories(transactions),
    [transactions],
  );

  const isAdmin = role === "Admin";
  const latestTrend = trendData.at(-1);
  const previousTrend = trendData.at(-2);
  const balanceDelta =
    latestTrend && previousTrend
      ? latestTrend.balance - previousTrend.balance
      : latestTrend?.balance || 0;

  const openCreateForm = () => {
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
      category: expenseCategories[0],
    });
    setIsEditorOpen(true);
  };

  const openEditForm = (tx) => {
    setForm({
      ...tx,
      amount: String(tx.amount),
    });
    setIsEditorOpen(true);
    document.getElementById("transactions")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const closeForm = () => {
    setIsEditorOpen(false);
    setForm(emptyForm);
  };

  const handleTypeChange = (nextType) => {
    setForm((current) => ({
      ...current,
      type: nextType,
      category:
        nextType === "income" ? incomeCategories[0] : expenseCategories[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAdmin) {
      return;
    }

    const payload = {
      ...form,
      id: form.id || `TXN-${Date.now()}`,
      amount: Number(form.amount),
    };

    if (
      !payload.date ||
      !payload.description.trim() ||
      !payload.merchant.trim() ||
      !payload.category ||
      !payload.amount
    ) {
      return;
    }

    if (form.id) {
      updateTransaction(payload);
    } else {
      addTransaction(payload);
    }

    closeForm();
  };

  return (
    <div className="space-y-8 pb-10">
      <section
        id="overview"
        className="overflow-hidden rounded-[32px] border border-white/60 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
      >
        <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.5fr_0.9fr] lg:px-10 lg:py-9">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-amber-300/80">
              Dashboard Overview
            </p>
            <h3 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Track balances, spending patterns, and role-based actions from a
              single view.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Built with React, Zustand, Tailwind, and Recharts using local mock
              data. Viewer mode is read-only, while Admin unlocks transaction
              creation and editing for the demo.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SummaryCard
                label="Total Balance"
                value={formatCurrency(summary.balance)}
                accent="amber"
                detail={`${summary.savingsRate}% saved from income`}
                icon={<FiTrendingUp />}
              />
              <SummaryCard
                label="Income"
                value={formatCurrency(summary.income)}
                accent="emerald"
                detail="All inflows this period"
                icon={<FiArrowUpRight />}
              />
              <SummaryCard
                label="Expenses"
                value={formatCurrency(summary.expenses)}
                accent="rose"
                detail="Operational and lifestyle costs"
                icon={<FiArrowDownRight />}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Momentum
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Latest monthly balance</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatCurrency(latestTrend?.balance || 0)}
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                {balanceDelta >= 0 ? "+" : ""}
                {formatCurrency(balanceDelta)} vs last month
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Role access</span>
                <span className="font-semibold text-white">{role}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Transactions tracked</span>
                <span className="font-semibold text-white">
                  {transactions.length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Largest expense</span>
                <span className="font-semibold text-white">
                  {insights.largestExpense
                    ? formatCurrency(insights.largestExpense.amount)
                    : "No expenses"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard
          title="Balance trend"
          subtitle="A time-based view of cumulative balance by month."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e7dcc6" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `Rs ${Math.round(value / 1000)}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#d97706"
                  strokeWidth={3}
                  fill="url(#balanceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Spending breakdown"
          subtitle="A categorical view of expense concentration."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] xl:grid-cols-1">
            <div className="mx-auto h-64 w-full max-w-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    innerRadius={65}
                    outerRadius={96}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.slice(0, 5).map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      <section
        id="transactions"
        className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]"
      >
        <div className="rounded-[30px] border border-white/60 bg-white/90 p-6 shadow-[0_25px_70px_rgba(148,163,184,0.15)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Transactions
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Search, filter, and sort financial activity
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <FiRefreshCw />
                Clear filters
              </button>
              <button
                type="button"
                onClick={openCreateForm}
                disabled={!isAdmin}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <FiPlus />
                Add transaction
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InputShell icon={<FiSearch />} label="Search">
              <input
                value={filters.query}
                onChange={(event) => setFilter("query", event.target.value)}
                placeholder="Merchant, category, type..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </InputShell>

            <InputShell icon={<FiFilter />} label="Type">
              <select
                value={filters.type}
                onChange={(event) => setFilter("type", event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </InputShell>

            <InputShell icon={<FiFilter />} label="Category">
              <select
                value={filters.category}
                onChange={(event) => setFilter("category", event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              >
                <option value="all">All categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </InputShell>

            <InputShell icon={<FiFilter />} label="Sort">
              <select
                value={filters.sortBy}
                onChange={(event) => setFilter("sortBy", event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amountHigh">Amount high to low</option>
                <option value="amountLow">Amount low to high</option>
              </select>
            </InputShell>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
            {filteredTransactions.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.24em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Transaction</th>
                      <th className="px-5 py-4 font-medium">Date</th>
                      <th className="px-5 py-4 font-medium">Category</th>
                      <th className="px-5 py-4 font-medium">Type</th>
                      <th className="px-5 py-4 font-medium">Amount</th>
                      <th className="px-5 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="align-top">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {tx.description}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {tx.merchant}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {tx.category}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                              tx.type === "income"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`px-5 py-4 text-sm font-semibold ${
                            tx.type === "income"
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(tx)}
                            disabled={!isAdmin}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FiEdit3 />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No transactions match the current filters.
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try clearing the search, changing the type filter, or resetting
                  the demo dataset.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={resetTransactions}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white"
                  >
                    Restore demo data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/60 bg-white/90 p-6 shadow-[0_25px_70px_rgba(148,163,184,0.15)]">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
              Monthly flow
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Income vs expenses
            </h3>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid stroke="#ece5d8" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(value) => `Rs ${Math.round(value / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar
                    dataKey="income"
                    fill="#0f766e"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#dc2626"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-[#fffaf1] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
                  Role-based UI
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {isAdmin ? "Admin controls enabled" : "Viewer mode enabled"}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${
                  isAdmin
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-sky-100 text-sky-700"
                }`}
              >
                {role}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Viewer can explore charts and transactions. Admin can add new
              items and edit existing records using the form below.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/60 bg-white/90 p-6 shadow-[0_25px_70px_rgba(148,163,184,0.15)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
                  Transaction editor
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {form.id ? "Edit transaction" : "Create transaction"}
                </h3>
              </div>
              {!isEditorOpen && isAdmin ? (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Open form
                </button>
              ) : null}
            </div>

            {isEditorOpen && isAdmin ? (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Date">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                      className="field-input"
                      required
                    />
                  </Field>
                  <Field label="Amount">
                    <input
                      type="number"
                      min="1"
                      value={form.amount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          amount: event.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="Enter amount"
                      required
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <input
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="field-input"
                    placeholder="Salary credit, rent, groceries..."
                    required
                  />
                </Field>

                <Field label="Merchant">
                  <input
                    value={form.merchant}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        merchant: event.target.value,
                      }))
                    }
                    className="field-input"
                    placeholder="Company or vendor name"
                    required
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Type">
                    <select
                      value={form.type}
                      onChange={(event) => handleTypeChange(event.target.value)}
                      className="field-input"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </Field>
                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      className="field-input"
                    >
                      {(form.type === "income"
                        ? incomeCategories
                        : expenseCategories
                      ).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white"
                  >
                    {form.id ? "Save changes" : "Add transaction"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
                <p className="text-sm leading-6 text-slate-600">
                  {isAdmin
                    ? "Open the form to create a new transaction or select Edit from the table."
                    : "Switch the role toggle to Admin to demonstrate add and edit capabilities."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="insights" className="grid gap-6 lg:grid-cols-3">
        <InsightCard
          eyebrow="Highest spend"
          title={insights.topCategory?.name || "No expense data"}
          value={
            insights.topCategory
              ? formatCurrency(insights.topCategory.value)
              : "Unavailable"
          }
          description="Top expense category across the current dataset."
        />
        <InsightCard
          eyebrow="Monthly comparison"
          title={
            insights.monthlyExpenseChange >= 0
              ? "Spending increased"
              : "Spending reduced"
          }
          value={formatCurrency(Math.abs(insights.monthlyExpenseChange || 0))}
          description={
            insights.previousMonth
              ? `Compared with ${insights.previousMonth.label}.`
              : "Need at least two months of data for comparison."
          }
        />
        <InsightCard
          eyebrow="Observation"
          title="Useful takeaway"
          value={`${summary.savingsRate}% savings rate`}
          description={insights.observation}
        />
      </section>
    </div>
  );
};

export default Dashboard;
