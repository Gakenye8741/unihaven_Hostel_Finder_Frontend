import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSideNav } from "../dashboardDesign/AdminSidenav";
import { Menu, X } from "lucide-react";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 relative font-sans overflow-hidden">
      
      {/* SINGLE MOBILE TRIGGER - Click once to see everything */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-[999] p-4 bg-indigo-600 text-white rounded-full shadow-2xl border border-indigo-400/30 active:scale-90 transition-all"
        >
          <Menu size={24} strokeWidth={3} />
        </button>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-72 h-full fixed top-0 left-0 z-30">
        <AdminSideNav />
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />

          {/* Sidebar Panel */}
          <aside className="fixed top-0 left-0 z-[1001] w-[80%] max-w-[300px] h-full shadow-2xl lg:hidden transform transition-transform duration-300">
            {/* Direct Close Button in the drawer */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 z-[1002] p-2 text-slate-400"
            >
              <X size={24} />
            </button>
            <AdminSideNav onNavItemClick={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pt-24 p-4 md:p-8 lg:ml-72 bg-[#030712] min-h-screen">
        <div className="max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};