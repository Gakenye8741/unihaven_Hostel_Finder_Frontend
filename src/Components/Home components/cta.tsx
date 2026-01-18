import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Building2, Zap, BarChart3 } from 'lucide-react';

const ManagerCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-slate-800 p-10 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden group">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366F1]/10 blur-[120px] rounded-full group-hover:bg-[#6366F1]/15 transition-all duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full"></div>

        <div className="relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8">
            <ShieldCheck size={14} className="text-[#6366F1]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Partner Ecosystem</span>
          </div>
          
          <h3 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter italic leading-none">
            OWN A <span className="text-[#6366F1]">HOSTEL?</span>
          </h3>
          
          <p className="text-slate-400 mb-12 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Join the premium network of property managers reaching thousands of students daily. 
            Fill your rooms faster and manage inquiries with professional tools.
          </p>

          {/* Quick Stats/Features for Owners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
             <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <Zap className="text-indigo-400" size={20} />
                <p className="text-[9px] font-black uppercase tracking-widest text-white">Instant Leads</p>
             </div>
             <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <BarChart3 className="text-indigo-400" size={20} />
                <p className="text-[9px] font-black uppercase tracking-widest text-white">Demand Tracking</p>
             </div>
             <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <Building2 className="text-indigo-400" size={20} />
                <p className="text-[9px] font-black uppercase tracking-widest text-white">Brand Growth</p>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={() => navigate('/ApplyHostelOwner')}
              className="group bg-white text-[#6366F1] px-14 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Get Started <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button className="bg-slate-800/40 hover:bg-slate-800 text-white border border-white/5 px-12 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.25em] transition-all backdrop-blur-sm">
              View Guide
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
             <div className="h-[1px] w-12 bg-white/20" />
             <p className="text-[8px] font-black uppercase tracking-[0.3em]">Official Onboarding Portal</p>
             <div className="h-[1px] w-12 bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerCTA;