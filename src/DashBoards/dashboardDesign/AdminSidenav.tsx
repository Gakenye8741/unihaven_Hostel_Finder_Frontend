import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Image as ImageIcon,
  LogOut,
  Settings,
  User,
  ShieldHalf,
  Wifi,
  GitCommitVerticalIcon,
  List
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../features/Auth/Auth.slice";

const navItems = [
  { name: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard className="text-indigo-400" size={18} /> },
  { name: "Manage Hostels", path: "Manage-hostels", icon: <Building2 className="text-blue-400" size={18} /> },
  { name: "Manage Rooms", path: "Manage-rooms", icon: <BedDouble className="text-pink-500" size={18} /> },
  { name: "Media Gallery", path: "product-media", icon: <ImageIcon className="text-green-400" size={18} /> },
  { name: "Amenity Manager", path: "Manage-Amenities", icon: <Wifi className="text-orange-600" size={18} /> },
   { name: "Review Manager", path: "Manage-Reviews", icon: <GitCommitVerticalIcon className="text-shadow-lime-600" size={18} /> },
  { name: "Hostel verifications", path: "Hostel-verifications", icon: <List className="text-yellow-400" size={18} /> },
  { name: "My Profile", path: "adminprofile", icon: <User className="text-purple-400" size={18} /> },
  { name: "Settings", path: "settings", icon: <Settings className="text-teal-400" size={18} /> },
  { name: "Logout", path: "#", icon: <LogOut className="text-red-500" size={18} /> },
];

export const AdminSideNav = ({ onNavItemClick }: { onNavItemClick?: () => void }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    onNavItemClick?.();
  };

  return (
    <aside className="h-full w-full flex flex-col bg-[#0F172A] text-slate-300 overflow-hidden border-r-2 border-b-4 border-indigo-500/20 shadow-2xl">
      
      {/* BRANDING SECTION */}
      <div className="p-8 pb-6 text-center border-b border-white/5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <ShieldHalf size={20} className="text-indigo-500" />
          </div>
          <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">
            UniHaven
          </h4>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400/80">
          Admin Control Core
        </p>
      </div>

      {/* SCROLLABLE NAV AREA */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) =>
          item.name === "Logout" ? (
            <button
              key={index}
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-rose-500/10 transition-all w-full text-left group border border-transparent hover:border-rose-500/20"
            >
              <span className="group-hover:rotate-12 transition-transform">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-widest font-black text-rose-500">{item.name}</span>
            </button>
          ) : (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/admin-dashboard"}
              onClick={onNavItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden border ${
                  isActive 
                    ? "bg-indigo-600/10 border-indigo-500/40 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                    : "border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-100"
                }`
              }
            >
              {/* Active Indicator Bar */}
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-[.active]:opacity-100 transition-opacity" />
              
              <span className="group-hover:scale-110 transition-transform relative z-10">
                {item.icon}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black relative z-10">
                {item.name}
              </span>
            </NavLink>
          )
        )}
      </nav>

      {/* FOOTER STATUS */}
      <div className="p-6 bg-black/20 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">System Online</span>
          </div>
          <span className="text-[8px] font-bold text-slate-600 tracking-tighter">v2.4.0-LU</span>
        </div>
      </div>
    </aside>
  );
};