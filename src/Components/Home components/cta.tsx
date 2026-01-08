import React from 'react';

const ManagerCTA: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-slate-800 p-12 md:p-20 rounded-[2rem] shadow-2xl relative overflow-hidden text-center">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 blur-[100px] rounded-full"></div>
        
        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Own a Hostel?</h3>
        <p className="text-slate-400 mb-10 text-lg font-medium max-w-2xl mx-auto">Join 100+ property managers who use UniHaven to reach thousands of students effortlessly.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-[#6366F1] hover:bg-[#4f46e5] text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
            List Your Property
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default ManagerCTA;