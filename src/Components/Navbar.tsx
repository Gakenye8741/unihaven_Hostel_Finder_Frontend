import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { 
  LogOut, User, ChevronDown, 
  LayoutDashboard, X, Home, Search, 
  Building2, Map, Info, PlusCircle,
  ShieldCheck, HelpCircle, MessageSquare, MoreHorizontal 
} from "lucide-react";
import type { RootState } from "../App/store";
import { clearCredentials } from "../features/Auth/Auth.slice";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const infoMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, role } = useSelector((state: RootState) => state.auth);

  const showApplyTab = useMemo(() => {
    const userRole = role?.toUpperCase();
    return userRole !== "OWNER" && userRole !== "ADMIN";
  }, [role]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
        setInfoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearCredentials());
    setMenuOpen(false);
    toast.success("Logged out successfully", {
      id: "logout-toast",
      icon: '🏠',
      style: {
        background: '#0F172A',
        color: '#6366F1',
        fontSize: '10px',
        letterSpacing: '0.2em',
        border: '1px solid #6366F1'
      },
    });
    navigate("/login");
  };

  const dashboardConfig = useMemo(() => {
    const userRole = role?.toUpperCase();
    switch (userRole) {
      case "ADMIN": return { path: "/admin-dashboard", label: "Admin Portal" };
      case "OWNER": return { path: "/owner-dashboard", label: "Owner Portal" };
      case "CARETAKER": return { path: "/caretaker-dashboard", label: "Caretaker Portal" };
      default: return { path: "/student-dashboard", label: "Student Portal" };
    }
  }, [role]);

  const activeStyle = ({ isActive }: { isActive: boolean }) => 
    `flex items-center transition-all duration-300 py-2 border-b-2 ${
      isActive 
      ? "text-[#6366F1] border-[#6366F1]" 
      : "text-slate-400 border-transparent hover:text-[#6366F1]"
    }`;

  const applyTabStyle = ({ isActive }: { isActive: boolean }) => 
    `flex items-center transition-all duration-300 py-2 border-b-2 ${
      isActive 
      ? "text-amber-400 border-amber-400" 
      : "text-amber-500/70 border-transparent hover:text-amber-400"
    }`;

  const activeMobileBottomStyle = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center justify-center flex-1 transition-all duration-300 ${
      isActive ? "text-[#6366F1]" : "text-slate-500"
    }`;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${
        scrolled 
        ? "bg-[#0F172A]/95 backdrop-blur-md border-indigo-500/30 shadow-2xl py-0" 
        : "bg-[#0F172A] border-slate-800 py-1"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* LOGO */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 mr-3 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 transition-all group-hover:bg-indigo-500/20">
                <Building2 className="text-[#6366F1] group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-sans font-black text-xl sm:text-2xl tracking-tighter leading-none">UniHaven</span>
                <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.4em] text-indigo-400 mt-1 font-bold">Premium Housing</span>
              </div>
            </Link>

            {/* DESKTOP NAV - ARRANGED & PRESENTABLE */}
            <div className="hidden lg:flex space-x-10 items-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <NavLink to="/" end className={activeStyle}><Home size={13} className="mr-1.5" /> Home</NavLink>
              <NavLink to="/hostels" className={activeStyle}><Search size={13} className="mr-1.5" /> Find Hostel</NavLink>
              <NavLink to="/map" className={activeStyle}><Map size={13} className="mr-1.5" /> Campus Map</NavLink>
              
              {showApplyTab && (
                <NavLink to="/ApplyHostelOwner" className={applyTabStyle}>
                  <PlusCircle size={13} className="mr-1.5" /> Apply
                </NavLink>
              )}

              {/* RESOURCES DROPDOWN (Safety, FAQ, Contact) */}
              <div className="relative" ref={infoMenuRef}>
                <button 
                  onMouseEnter={() => setInfoDropdownOpen(true)}
                  className="flex items-center text-slate-400 hover:text-[#6366F1] transition-all py-2"
                >
                  Resources <ChevronDown size={10} className={`ml-1 transition-transform ${infoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {infoDropdownOpen && (
                  <div 
                    onMouseLeave={() => setInfoDropdownOpen(false)}
                    className="absolute top-full -left-4 w-48 bg-[#1E293B] border border-white/10 shadow-2xl py-2 rounded-xl animate-in fade-in zoom-in-95 duration-150"
                  >
                    <NavLink to="/safety" className="flex items-center px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      <ShieldCheck size={14} className="mr-3 text-emerald-500" /> Safety Guide
                    </NavLink>
                    <NavLink to="/faq" className="flex items-center px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      <HelpCircle size={14} className="mr-3 text-indigo-500" /> Help Center
                    </NavLink>
                    <NavLink to="/contact" className="flex items-center px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      <MessageSquare size={14} className="mr-3 text-indigo-500" /> Contact Support
                    </NavLink>
                  </div>
                )}
              </div>

              {/* MAJOR BUTTON: ABOUT */}
              <NavLink to="/about" className={({ isActive }) => `
                flex items-center px-5 py-2.5 rounded-full border-2 transition-all duration-300 
                ${isActive 
                  ? "bg-white text-[#0F172A] border-white font-black" 
                  : "bg-transparent text-white border-white/20 hover:border-white/60 hover:bg-white/5"
                }
              `}>
                <Info size={13} className="mr-2" /> About UniHaven
              </NavLink>
            </div>

            {/* PROFILE ACCESS */}
            <div className="flex items-center space-x-4">
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
                    <div className="px-5 py-2">
                      <p className="text-[8px] text-slate-500 uppercase tracking-[0.2em] mb-1 font-bold">Portal Access</p>
                      <p className="text-[11px] text-white font-medium truncate mb-3">{isAuthenticated ? user?.username : "Guest Resident"}</p>
                      
                      {isAuthenticated ? (
                        <>
                          <NavLink to={dashboardConfig.path} className="flex items-center px-4 py-3 text-xs uppercase tracking-widest text-slate-300 hover:bg-white/5 transition-colors" onClick={() => setMenuOpen(false)}>
                            <LayoutDashboard size={14} className="mr-3" /> {dashboardConfig.label}
                          </NavLink>
                          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-[10px] uppercase tracking-widest text-rose-400 hover:bg-rose-500/5 mt-2 transition-colors">
                            <LogOut size={14} className="mr-3" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <NavLink to="/login" className="flex items-center px-4 py-3 text-xs uppercase tracking-widest text-slate-300 hover:bg-white/5 transition-colors" onClick={() => setMenuOpen(false)}>
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

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0F172A]/95 backdrop-blur-xl border-t border-slate-800 z-[100] px-4 pb-2">
        {mobileMoreOpen && (
          <div className="absolute bottom-20 right-4 w-48 bg-[#1E293B] border border-white/10 shadow-2xl rounded-2xl p-2 animate-in slide-in-from-bottom-5">
            <NavLink to="/safety" className="flex items-center p-3 text-[10px] uppercase tracking-widest text-slate-300 border-b border-white/5" onClick={() => setMobileMoreOpen(false)}>
              <ShieldCheck size={14} className="mr-3 text-emerald-500" /> Safety
            </NavLink>
            <NavLink to="/faq" className="flex items-center p-3 text-[10px] uppercase tracking-widest text-slate-300 border-b border-white/5" onClick={() => setMobileMoreOpen(false)}>
              <HelpCircle size={14} className="mr-3 text-indigo-500" /> FAQ
            </NavLink>
            <NavLink to="/contact" className="flex items-center p-3 text-[10px] uppercase tracking-widest text-slate-300 border-b border-white/5" onClick={() => setMobileMoreOpen(false)}>
              <MessageSquare size={14} className="mr-3 text-indigo-500" /> Contact
            </NavLink>
            <NavLink to="/about" className="flex items-center p-3 text-[10px] uppercase tracking-widest text-slate-300" onClick={() => setMobileMoreOpen(false)}>
              <Info size={14} className="mr-3 text-indigo-500" /> About
            </NavLink>
          </div>
        )}

        <div className="flex justify-between h-16 items-center">
          <NavLink to="/" end className={activeMobileBottomStyle}><Home size={20} /><span className="text-[8px] uppercase mt-1 font-bold">Home</span></NavLink>
          <NavLink to="/hostels" className={activeMobileBottomStyle}><Search size={20} /><span className="text-[8px] uppercase mt-1 font-bold">Find</span></NavLink>
          {showApplyTab && (
            <NavLink to="/ApplyHostelOwner" className={activeMobileBottomStyle}>
              <div className="bg-amber-500 p-2 rounded-full -mt-8 shadow-lg shadow-amber-500/20 text-[#0F172A]"><PlusCircle size={24} /></div>
              <span className="text-[8px] uppercase mt-1 font-bold text-amber-500">Apply</span>
            </NavLink>
          )}
          <NavLink to="/map" className={activeMobileBottomStyle}><Map size={20} /><span className="text-[8px] uppercase mt-1 font-bold">Map</span></NavLink>
          <button onClick={() => setMobileMoreOpen(!mobileMoreOpen)} className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 ${mobileMoreOpen ? "text-[#6366F1]" : "text-slate-500"}`}>
            <MoreHorizontal size={20} /><span className="text-[8px] uppercase mt-1 font-bold">More</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;