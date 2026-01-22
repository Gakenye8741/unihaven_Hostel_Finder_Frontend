import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Send, Github, Mail, Phone, MapPin, ShieldCheck, HelpCircle, FileText, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  // Trigger loader whenever the URL path changes
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 800); // Loader shows for 800ms
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <footer className="bg-[#030712] border-t border-slate-900 pt-20 pb-32 lg:pb-10 px-6 lg:px-10 relative overflow-hidden">
      
      {/* NAVIGATION LOADER OVERLAY (Small & Subtle) */}
      {isNavigating && (
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-pulse w-full shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND & LOADER STATUS */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none">
                  Uni<span className="text-indigo-600">Haven</span>
                </h2>
                {/* SPINNING LOADER NEXT TO BRAND */}
                {isNavigating && (
                  <Loader2 size={18} className="text-indigo-500 animate-spin" />
                )}
              </div>
              <p className="text-slate-500 text-[11px] mt-4 leading-relaxed font-bold uppercase tracking-tight">
                Engineering the future of student living in Kenya. Discover verified hostels with zero middle-men.
              </p>
            </div>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Join the newsletter..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 px-4 text-[10px] text-white outline-none focus:border-indigo-600 transition-all font-bold tracking-widest uppercase"
              />
              <button className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-50">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/hostels" className="hover:text-indigo-500 transition-colors">Find a Hostel</Link></li>
              <li><Link to="/map" className="hover:text-indigo-500 transition-colors">Campus Map</Link></li>
              <li><Link to="/About" className="hover:text-indigo-500 transition-colors">About Us</Link></li>
              <li><Link to="/ApplyHostelOwner" className="hover:text-amber-500 transition-colors text-amber-500/80">List Property</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES */}
          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-50">Resources</h4>
            <ul className="space-y-4 text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <li>
                <Link to="/safety" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-500" /> Safety Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
                  <HelpCircle size={12} className="text-indigo-500" /> Help Center
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-indigo-500 transition-colors flex items-center gap-2">
                  <FileText size={12} className="text-indigo-500" /> Terms & Privacy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-500 transition-colors">Support Contact</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-50">Headquarters</h4>
            <ul className="space-y-5 text-slate-400">
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500"><Phone size={14} /></div>
                <span className="text-[10px] font-black tracking-widest uppercase">+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500"><Mail size={14} /></div>
                <span className="text-[10px] font-black tracking-widest uppercase">hello@unihaven.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR: SOCIALS & CREDITS */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-slate-600 text-[9px] uppercase tracking-[0.4em] font-black text-center md:text-left">
              © 2026 UniHaven Premier Residency • All Rights Reserved
            </p>
            <div className="flex items-center gap-2">
              {/* Conditional Loader or Pulse depending on state */}
              {isNavigating ? (
                <div className="flex items-center gap-2 text-indigo-500 text-[7px] uppercase font-black tracking-widest">
                  <Loader2 size={8} className="animate-spin" /> Fetching Content...
                </div>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-slate-800 text-[7px] uppercase tracking-[0.6em] font-black">Systems Operational</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {[
              { icon: <Facebook size={16} />, link: "#" },
              { icon: <Twitter size={16} />, link: "#" },
              { icon: <Instagram size={16} />, link: "#" },
              { icon: <Github size={16} />, link: "#" }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.link} 
                className="w-12 h-12 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 shadow-inner"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;