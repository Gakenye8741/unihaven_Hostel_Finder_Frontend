import React from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle } from 'lucide-react';

const SecurityBanner: React.FC = () => {
  const trustItems = [
    { icon: <Lock size={16} />, text: "Secure Payments" },
    { icon: <Eye size={16} />, text: "Physical Vetting" },
    { icon: <CheckCircle size={16} />, text: "Scam Protection" }
  ];

  return (
    <section className="py-12 bg-[#0F172A] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#6366F1]/10 rounded-2xl border border-[#6366F1]/20">
            <ShieldCheck size={32} className="text-[#6366F1]" />
          </div>
          <div>
            <h4 className="text-white font-black text-xl tracking-tight leading-none mb-2">The UniHaven Guarantee</h4>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">100% Verified Residencies Only</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-[#6366F1]/50 transition-colors">
              <span className="text-[#6366F1]">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityBanner;