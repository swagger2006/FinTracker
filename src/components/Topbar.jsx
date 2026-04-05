import { FiShield, FiUser } from "react-icons/fi";
import { roleOptions } from "../data/mockData";
import { useFinanceStore } from "../store/useFinanceStore";

const Topbar = () => {
  const role = useFinanceStore((state) => state.role);
  const setRole = useFinanceStore((state) => state.setRole);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[rgba(248,245,238,0.84)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Finance Dashboard UI
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Personal finance at a glance
          </h2>
        </div>

        <label className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          {role === "Admin" ? (
            <FiShield className="text-emerald-600" />
          ) : (
            <FiUser className="text-sky-600" />
          )}
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Demo Role
            </p>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-900 outline-none"
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
    </header>
  );
};

export default Topbar;
