import { FiBarChart2, FiList, FiPieChart } from "react-icons/fi";

const sections = [
  { id: "overview", label: "Overview", icon: FiBarChart2 },
  { id: "transactions", label: "Transactions", icon: FiList },
  { id: "insights", label: "Insights", icon: FiPieChart },
];

const Sidebar = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/80 px-6 py-8 text-slate-100 lg:flex lg:flex-col">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">
          Zorvyn Assignment
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          FinTracker
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
          A responsive finance dashboard focused on clarity, spending patterns,
          and role-based controls.
        </p>
      </div>

      <nav className="space-y-3">
        {sections.map((section) => {
          const IconComponent = section.icon;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-amber-300/30 hover:bg-white/8 hover:text-white"
            >
              <IconComponent className="text-base text-amber-300" />
              {section.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
          Focus
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-200">
          The UI stays intentionally lightweight while still covering charts,
          filtering, responsive layouts, and admin interactions.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
