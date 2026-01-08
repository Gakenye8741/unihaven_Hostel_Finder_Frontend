import React from 'react';

const Neighborhoods: React.FC = () => {
  const areas = [
    { name: "Madaraka", hostels: "12+ Hostels", img: "https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&w=400&q=75" },
    { name: "Juja", hostels: "25+ Hostels", img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=400&q=75" },
    { name: "Eldoret", hostels: "15+ Hostels", img: "https://images.unsplash.com/photo-1449156001935-d2863fb72690?auto=format&fit=crop&w=400&q=75" },
    { name: "Westlands", hostels: "8+ Hostels", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=75" }
  ];

  return (
    <section className="py-24 px-4 bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-[#6366F1] text-[10px] uppercase tracking-[0.4em] font-black mb-2">Explore the Vibe</p>
            <h3 className="text-3xl font-black text-white tracking-tight">Student Neighborhoods</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, i) => (
            <div key={i} className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-slate-800">
              <img 
                src={area.img} 
                loading="lazy"
                alt={area.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-black text-xl mb-1">{area.name}</p>
                <div className="inline-block px-3 py-1 bg-[#6366F1] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                  {area.hostels}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Neighborhoods;