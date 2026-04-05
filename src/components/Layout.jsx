import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,_#f8f5ee_0%,_#f2eee5_52%,_#ebe4d6_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
