import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useFinanceStore } from "../store/useFinanceStore";

const Layout = ({ children }) => {
  const theme = useFinanceStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,_#f8f5ee_0%,_#f2eee5_52%,_#ebe4d6_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_22%),linear-gradient(180deg,_#08111f_0%,_#0c1729_52%,_#101d31_100%)] dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-5 sm:px-8 sm:py-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
