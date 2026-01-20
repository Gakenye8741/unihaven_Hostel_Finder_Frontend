import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Lock, 
  PhoneCall, 
  UserCheck, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Home,
  Verified
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const SafetyTrust: React.FC = () => {
  const safetyRules = [
    {
      icon: <Eye className="text-indigo-500" size={24} />,
      title: "Physical Inspection First",
      desc: "Never pay any deposit before physically visiting the hostel. Ensure the room matches the photos on our platform."
    },
    {
      icon: <ShieldAlert className="text-amber-500" size={24} />,
      title: "Say No to 'Viewing Fees'",
      desc: "Legitimate landlords rarely charge to show a house. Be cautious of anyone demanding money just to see a room."
    },
    {
      icon: <UserCheck className="text-emerald-500" size={24} />,
      title: "Verify the Owner",
      desc: "Ask to see the caretaker's or owner's ID and official hostel registration if you feel uncertain."
    },
    {
      icon: <Lock className="text-indigo-500" size={24} />,
      title: "Secure Your Receipt",
      desc: "When you pay your deposit, ensure you get a signed, stamped receipt or a formal rental agreement."
    }
  ];

  return (
    <div className="bg-[#030712] min-h-screen text-slate-300 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[9px]">
              Your Safety is Our Priority
            </span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">
            Trust & <span className="text-emerald-500">Verification</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm lg:text-lg leading-relaxed font-medium">
            At UniHaven, we are committed to creating a scam-free environment for students. 
            Learn how we verify listings and what steps you should take to stay secure.
          </p>
        </div>
      </section>

      {/* VERIFICATION BADGE SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-8 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3 flex justify-center">
             <div className="relative">
                <div className="w-40 h-40 bg-emerald-500/10 rounded-full animate-pulse flex items-center justify-center">
                    <Verified size={80} className="text-emerald-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-2xl">
                    Verified Hub
                </div>
             </div>
          </div>
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">What does "Verified" mean?</h2>
            <p className="text-slate-400 text-sm leading-loose">
              Every hostel with a verification badge has been visited by a UniHaven representative. 
              We check for:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 "Actual existence of the property",
                 "Security measures (fences, guards, CCTV)",
                 "Water and Electricity reliability",
                 "Ownership legitimacy",
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE STUDENT SAFETY GUIDE */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tight">The Student <span className="text-emerald-500">Safety Guide</span></h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mt-2 font-bold">Follow these rules to avoid campus housing scams</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyRules.map((rule, i) => (
            <div key={i} className="group p-8 bg-slate-900/20 border border-slate-800 rounded-[2.5rem] hover:border-emerald-500/30 transition-all duration-500">
               <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {rule.icon}
               </div>
               <h4 className="text-white font-black uppercase italic text-lg mb-3 tracking-tight">{rule.title}</h4>
               <p className="text-[12px] text-slate-500 leading-relaxed font-medium">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCAM ALERT BANNER */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-amber-500 text-black rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                <AlertTriangle size={32} />
            </div>
            <div>
                <h3 className="text-white font-black uppercase italic text-xl mb-2">Red Flag Warning</h3>
                <p className="text-slate-400 text-[11px] lg:text-xs leading-relaxed uppercase font-bold tracking-wider">
                    If someone claiming to be a UniHaven agent calls you asking for money to "hold a room" without you having seen it, 
                    hang up immediately. We do not collect payments on behalf of landlords at this stage.
                </p>
            </div>
        </div>
      </section>

      {/* REPORT SECTION */}
      <section className="max-w-5xl mx-auto px-6 mb-32 text-center">
        <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-black text-white uppercase italic tracking-tighter">Something look wrong?</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
                Help us keep the community safe. If you find a fake listing or encountered a suspicious owner, report it immediately.
            </p>
            <a 
                href="mailto:report@unihaven.com" 
                className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
                Report a Listing <PhoneCall size={16} />
            </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SafetyTrust;