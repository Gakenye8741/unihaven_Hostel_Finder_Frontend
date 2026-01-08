import React from 'react';
import { ShieldCheck, Zap, Smartphone } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    { 
      icon: <ShieldCheck className="text-[#6366F1]" size={28} />, 
      title: "Verified Listings", 
      desc: "Every hostel is physically inspected by our campus agents to ensure safety and quality." 
    },
    { 
      icon: <Zap className="text-[#6366F1]" size={28} />, 
      title: "Instant Booking", 
      desc: "Secure your room instantly. No more traveling miles just to check room availability." 
    },
    { 
      icon: <Smartphone className="text-[#6366F1]" size={28} />, 
      title: "Digital Payments", 
      desc: "Pay rent and deposits securely via M-Pesa or Card through your student portal." 
    }
  ];

  return (
    <section className="py-24 bg-[#0F172A] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#6366F1]/50 transition-all duration-500">
              <div className="mb-6 p-4 w-fit rounded-xl bg-[#6366F1]/10 group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-500 text-[#6366F1]">
                {f.icon}
              </div>
              <h4 className="text-white font-black text-xl mb-3 tracking-tight">{f.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;