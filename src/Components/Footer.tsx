import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND & NEWSLETTER */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-black text-2xl tracking-tighter">Uni<span className="text-[#6366F1]">Haven</span></h2>
              <p className="text-slate-400 text-xs mt-4 leading-relaxed font-medium">
                The most trusted student housing network in Kenya. We simplify campus living by connecting students with verified, high-quality hostels.
              </p>
            </div>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Get price alerts..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-[#6366F1] transition-all"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#4f46e5] transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-black mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Find a Hostel</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">List Your Property</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Virtual Tours</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Student Dashboard</a></li>
            </ul>
          </div>

          {/* COLUMN 3: TOP CAMPUSES */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-black mb-6">Top Hubs</h4>
            <ul className="space-y-4 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">JKUAT - Juja</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Strathmore - Madaraka</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">UoN - Main Campus</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">KU - Ruiru</a></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-black mb-6">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <div className="p-2 bg-slate-900 rounded-lg text-[#6366F1]"><Phone size={14} /></div>
                <span className="text-[11px] font-bold">+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="p-2 bg-slate-900 rounded-lg text-[#6366F1]"><Mail size={14} /></div>
                <span className="text-[11px] font-bold">help@unihaven.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="p-2 bg-slate-900 rounded-lg text-[#6366F1]"><MapPin size={14} /></div>
                <span className="text-[11px] font-bold">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR: SOCIALS & COPYRIGHT */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[9px] uppercase tracking-[0.4em] font-black">
            © 2026 UniHaven Premier Residency • All Rights Reserved
          </p>
          
          <div className="flex items-center gap-4">
            {[
              { icon: <Facebook size={16} />, link: "#" },
              { icon: <Twitter size={16} />, link: "#" },
              { icon: <Instagram size={16} />, link: "#" },
              { icon: <Linkedin size={16} />, link: "#" }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.link} 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#6366F1] hover:border-[#6366F1]/50 transition-all duration-300"
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