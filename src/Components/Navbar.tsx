import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { 
  LogOut, User, ChevronDown, 
  LayoutDashboard, X, Home, Search, 
  Building2, Map, Star, Info, ShieldCheck 
} from "lucide-react";
import type { RootState } from "../App/store";
import { clearCredentials } from "../features/Auth/Auth.slice";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  const { isAuthenticated, user, role } = useSelector((state: RootState) => state.auth);

  // Handle scroll effect for border and background transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(clearCredentials());
    setMenuOpen(false);
    toast.dismiss();
    toast.success("Logged out successfully", {
      id: "logout-toast",
      icon: '🏠',
      duration: 3000,
      style: {
        borderRadius: '0px',
        background: '#0F172A',
        color: '#6366F1', // Indigo theme color
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '0.2em',
        border: '1px solid #6366F1'
      },
    });
    navigate("/login");
  };

  // UPDATED: Dashboard configuration mapping based on your specific roles
  const dashboardConfig = useMemo(() => {
    const userRole = role?.toUpperCase();
    
    switch (userRole) {
      case "ADMIN":
        return { path: "/admin-dashboard", label: "Admin Portal" };
      case "OWNER":
        return { path: "/owner-dashboard", label: "Owner Portal" };
      case "CARETAKER":
        return { path: "/caretaker-dashboard", label: "Caretaker Portal" };
      case "STUDENT":
        return { path: "/student-dashboard", label: "Student Portal" };
      default:
        // Default fallback (e.g., for MANAGER or unknown roles)
        return { path: "/student-dashboard", label: "User Portal" };
    }
  }, [role]);

  // UniHaven Indigo Theme Macros
  const activeStyle = ({ isActive }: { isActive: boolean }) => 
    `flex items-center transition-all duration-300 py-2 border-b-2 ${
      isActive 
      ? "text-[#6366F1] border-[#6366F1]" 
      : "text-slate-400 border-transparent hover:text-[#6366F1]"
    }`;

  const activeMobileStyle = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-5 py-3 text-xs uppercase tracking-widest transition-colors ${
      isActive 
      ? "text-[#6366F1] bg-white/5 font-bold" 
      : "text-slate-300 hover:bg-white/5"
    }`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${
      scrolled 
      ? "bg-[#0F172A]/95 backdrop-blur-md border-indigo-500/30 shadow-2xl py-0" 
      : "bg-[#0F172A] border-slate-800 py-1"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO SECTION - UniHaven Branding */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 mr-3 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 transition-all group-hover:bg-indigo-500/20">
              <Building2 className="text-[#6366F1] group-hover:scale-110 transition-transform" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-sans font-black text-xl sm:text-2xl tracking-tighter leading-none">UniHaven</span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.4em] text-indigo-400 mt-1 font-bold">Premium Housing</span>
            </div>
          </Link>

          {/* DESKTOP NAV links - Hostel Finder Scope */}
          <div className="hidden lg:flex space-x-8 items-center text-[10px] uppercase tracking-[0.2em] font-bold">
            <NavLink to="/" end className={activeStyle}><Home size={13} className="mr-1.5" /> Home</NavLink>
            <NavLink to="/hostels" className={activeStyle}><Search size={13} className="mr-1.5" /> Find Hostel</NavLink>
            <NavLink to="/map" className={activeStyle}><Map size={13} className="mr-1.5" /> Campus Map</NavLink>
            <NavLink to="/reviews" className={activeStyle}><Star size={13} className="mr-1.5" /> Reviews</NavLink>
            <NavLink to="/safety" className={activeStyle}><ShieldCheck size={13} className="mr-1.5" /> Safety</NavLink>
            <NavLink to="/about" className={activeStyle}><Info size={13} className="mr-1.5" /> About</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {/* ACCOUNT MENU */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-lg text-[#6366F1] hover:bg-indigo-500/20 transition"
              >
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-md bg-[#6366F1] flex items-center justify-center text-[10px] text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:block">{user?.username}</span>
                  </div>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest font-bold">Sign In</span>
                )}
                {menuOpen ? <X size={14} /> : <ChevronDown size={14} />}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1E293B] border border-white/10 shadow-2xl py-3 rounded-xl z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="lg:hidden flex flex-col border-b border-white/5 pb-2 mb-2">
                    <NavLink to="/" end className={activeMobileStyle} onClick={() => setMenuOpen(false)}><Home size={16} className="mr-3" /> Home</NavLink>
                    <NavLink to="/hostels" className={activeMobileStyle} onClick={() => setMenuOpen(false)}><Search size={16} className="mr-3" /> Find Hostel</NavLink>
                    <NavLink to="/map" className={activeMobileStyle} onClick={() => setMenuOpen(false)}><Map size={16} className="mr-3" /> Campus Map</NavLink>
                    <NavLink to="/reviews" className={activeMobileStyle} onClick={() => setMenuOpen(false)}><Star size={16} className="mr-3" /> Reviews</NavLink>
                  </div>

                  <div className="px-5 py-2">
                    <p className="text-[8px] text-slate-500 uppercase tracking-[0.2em] mb-1 font-bold">Portal Access</p>
                    <p className="text-[11px] text-white font-medium truncate mb-3">{isAuthenticated ? user?.username : "Guest Resident"}</p>
                    
                    {isAuthenticated ? (
                      <>
                        <NavLink to={dashboardConfig.path} className={activeMobileStyle} onClick={() => setMenuOpen(false)}>
                          <LayoutDashboard size={14} className="mr-3" /> {dashboardConfig.label}
                        </NavLink>
                        <button onClick={handleLogout} className="flex items-center w-full px-5 py-2 text-[10px] uppercase tracking-widest text-rose-400 hover:bg-rose-500/5 mt-2 transition-colors">
                          <LogOut size={14} className="mr-3" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <NavLink to="/login" className={activeMobileStyle} onClick={() => setMenuOpen(false)}>
                        <User size={14} className="mr-3" /> Member Access
                      </NavLink>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;