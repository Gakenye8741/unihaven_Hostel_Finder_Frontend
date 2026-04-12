import React from 'react';
import { ShieldCheck, Camera, MessageCircle } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    { 
      icon: <ShieldCheck className="text-[#6366F1]" size={28} />, 
      title: "Verified Listings", 
      desc: "Every hostel is physically inspected by our campus agents to ensure the photos match the reality of the rooms." 
    },
    { 
      icon: <Camera className="text-[#6366F1]" size={28} />, 
      title: "Visual Walkthroughs", 
      desc: "Explore detailed galleries of hostel interiors, study areas, and amenities so you can choose your next home with confidence." 
    },
    { 
      icon: <MessageCircle className="text-[#6366F1]" size={28} />, 
      title: "Direct Owner Contact", 
      desc: "We provide direct lines to hostel owners, allowing you to inquire, negotiate, and book your room personally." 
    }
  ];

  return (
    <section className="py-24 bg-[#0F172A] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section to clarify the app mission */}
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-white font-black text-4xl md:text-5xl tracking-tighter uppercase italic mb-4">
            Direct Student-to-Owner Connection
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl uppercase tracking-widest text-xs">
            Simplifying your search with authentic visuals and direct communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#6366F1]/50 transition-all duration-500 shadow-xl">
              <div className="mb-6 p-4 w-fit rounded-xl bg-[#6366F1]/10 group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-500 text-[#6366F1]">
                {f.icon}
              </div>
              <h4 className="text-white font-black text-xl mb-3 tracking-tight uppercase italic">{f.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;