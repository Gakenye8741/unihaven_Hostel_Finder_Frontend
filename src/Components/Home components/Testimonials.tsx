import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    { name: "Kevin M.", campus: "JKUAT", text: "Found a room in 10 minutes. The virtual tour was exactly like the real thing.", rating: 5 },
    { name: "Sarah W.", campus: "Strathmore", text: "The security filters helped my parents feel safe about my move to Madaraka.", rating: 5 },
    { name: "Brian O.", campus: "UoN", text: "Finally a site that actually verifies the WiFi speeds before listing!", rating: 4 }
  ];

  return (
    <section className="py-24 bg-[#0F172A] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#6366F1] text-[10px] uppercase tracking-[0.4em] font-black mb-4">Reviews</p>
          <h3 className="text-3xl font-black text-white tracking-tight">Voices of UniHaven</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800 relative group hover:border-[#6366F1]/30 transition-all">
              <Quote className="absolute top-6 right-6 text-slate-800 group-hover:text-[#6366F1]/20 transition-colors" size={40} />
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="fill-[#6366F1] text-[#6366F1]" />)}
              </div>
              <p className="text-slate-300 italic mb-6 text-sm leading-relaxed">"{r.text}"</p>
              <div>
                <p className="text-white font-black text-sm">{r.name}</p>
                <p className="text-[#6366F1] text-[10px] uppercase font-bold tracking-widest">{r.campus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;