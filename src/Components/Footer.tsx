import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030712] border-t border-slate-900 pt-20 pb-10 px-6 lg:px-10">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND & NEWSLETTER */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none">
                Uni<span className="text-indigo-600">Haven</span>
              </h2>
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
              <li><Link to="/campus-hub" className="hover:text-indigo-500 transition-colors">Campus Hub</Link></li>
              <li><Link to="/About" className="hover:text-indigo-500 transition-colors">Our Mission</Link></li>
              <li><Link to="/ApplyHostelOwner" className="hover:text-indigo-500 transition-colors">List Property</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: TOP CAMPUS LINKS */}
          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-50">Top Hubs</h4>
            <ul className="space-y-4 text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/campus/Jkuat" className="hover:text-indigo-500 transition-colors">JKUAT - Juja</Link></li>
              <li><Link to="/campus/Strathmore%20University" className="hover:text-indigo-500 transition-colors">Strathmore</Link></li>
              <li><Link to="/campus/University%20Of%20Nairobi" className="hover:text-indigo-500 transition-colors">UoN Main</Link></li>
              <li><Link to="/campus/Laikipia%20University" className="hover:text-indigo-500 transition-colors">Laikipia Uni</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & SUPPORT */}
          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-50">Get In Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-slate-400">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500"><Phone size={14} /></div>
                <span className="text-[10px] font-black tracking-widest uppercase">+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-4 text-slate-400">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500"><Mail size={14} /></div>
                <span className="text-[10px] font-black tracking-widest uppercase">hello@unihaven.com</span>
              </li>
              <li className="flex items-center gap-4 text-slate-400">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500"><MapPin size={14} /></div>
                <span className="text-[10px] font-black tracking-widest uppercase">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR: SOCIALS & CREDITS */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-slate-600 text-[9px] uppercase tracking-[0.4em] font-black">
              © 2026 UniHaven Premier Residency • All Rights Reserved
            </p>
            <p className="text-slate-800 text-[7px] uppercase tracking-[0.6em] font-black">
              Engineered for the next generation of scholars
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {[
              { icon: <Facebook size={16} />, link: "#" },
              { icon: <Twitter size={16} />, link: "#" },
              { icon: <Instagram size={16} />, link: "#" },
              { icon: <Github size={16} />, link: "#" } // Changed LinkedIn to Github to match Dev theme
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