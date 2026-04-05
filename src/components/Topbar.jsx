import {
  FiBarChart2,
  FiList,
  FiMoon,
  FiPieChart,
  FiShield,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { roleOptions } from "../data/mockData";
import { useFinanceStore } from "../store/useFinanceStore";

const mobileSections = [
  { id: "overview", label: "Overview", icon: FiBarChart2 },
  { id: "transactions", label: "Transactions", icon: FiList },
  { id: "insights", label: "Insights", icon: FiPieChart },
];

const Topbar = () => {
  const role = useFinanceStore((state) => state.role);
  const theme = useFinanceStore((state) => state.theme);
  const setRole = useFinanceStore((state) => state.setRole);
  const setTheme = useFinanceStore((state) => state.setTheme);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[rgba(248,245,238,0.84)] backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-[rgba(7,12,22,0.82)]">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            Finance Dashboard UI
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            Personal finance at a glance
          </h2>
        </div>

        <div className="grid w-full gap-3 self-start sm:grid-cols-2 lg:w-auto lg:flex">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-amber-300 hover:shadow-[0_14px_34px_rgba(217,119,6,0.12)] dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-amber-500/60 lg:w-auto"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-300">
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </span>
            <span>
              <span className="block text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Theme
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </span>
          </button>

          <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 lg:w-auto">
            {role === "Admin" ? (
              <FiShield className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FiUser className="text-sky-600 dark:text-sky-400" />
            )}
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Demo Role
              </p>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none dark:text-white"
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
          {mobileSections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-amber-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              >
                <Icon className="text-amber-600 dark:text-amber-300" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Topbar;
