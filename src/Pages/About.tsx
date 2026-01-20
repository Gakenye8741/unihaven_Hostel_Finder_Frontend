import React from 'react';
import { 
  ShieldCheck, MapPin, Users, Zap, Building2, CheckCircle2,
  ArrowRight, Target, Search, MessageSquare, Eye, PhoneCall
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';

const About: React.FC = () => {
  const stats = [
    { label: "Partner Institutions", value: "50+" },
    { label: "Verified Hostels", value: "1,200+" },
    { label: "Active Students", value: "10k+" },
    { label: "Safety Rating", value: "99.9%" },
  ];

  const features = [
    {
      icon: <MapPin className="text-indigo-500" size={24} />,
      title: "Campus-Centric Search",
      desc: "Find housing within walking distance of your specific lecture halls and faculty buildings using our high-precision campus mapping."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
      title: "Verified Listings",
      desc: "Every property undergoes a strict quality audit by our ground team before appearing on UniHaven to ensure the photos match reality."
    },
    {
      icon: <MessageSquare className="text-amber-500" size={24} />,
      title: "Direct Connection",
      desc: "We provide direct contact information for verified owners, allowing you to negotiate and book without expensive middle-men."
    }
  ];

  const steps = [
    { icon: <Search size={20} />, title: "Search", text: "Filter by your specific campus and budget." },
    { icon: <Eye size={20} />, title: "Explore", text: "View high-quality photos and verified details." },
    { icon: <PhoneCall size={20} />, title: "Contact", text: "Get in touch with the owner directly." },
    { icon: <Building2 size={20} />, title: "Move In", text: "Visit the hostel and secure your new home." }
  ];

  return (
    <div className="bg-[#030712] min-h-screen text-slate-300 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Target size={14} className="text-indigo-500" />
            <span className="text-indigo-500 font-black uppercase tracking-[0.3em] text-[9px]">
              Direct Student-to-Owner Marketplace
            </span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">
            Your Home <br /> <span className="text-indigo-600">Away From Home</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm lg:text-lg leading-relaxed font-medium">
            UniHaven is Kenya's premier digital directory for student accommodation. 
            We provide a transparent platform for students to find 
            safe and convenient housing near their institutions—completely free of charge.
          </p>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] text-center hover:border-indigo-500/50 transition-colors group">
              <h3 className="text-3xl lg:text-4xl font-black text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE MISSION */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tight mb-4">
                Why We Built <span className="text-indigo-600">UniHaven</span>
              </h2>
              <p className="text-slate-400 text-sm lg:text-base leading-loose">
                Finding a hostel shouldn't be a struggle. We realized that thousands of Kenyan students 
                spend days walking door-to-door, often falling victim to fake agents who charge "viewing fees" 
                for houses that don't exist.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">The UniHaven Edge</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['No Viewing Fees', 'Verified Property Info', 'Real Room Photos', 'Direct Owner Contacts', 'Campus Distance Tracking', 'Student Reviews'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 size={14} className="text-indigo-500 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-900/20 border border-slate-800/50 hover:border-indigo-500/30 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-white font-black uppercase italic mb-1 tracking-tight">{f.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tight">How to use <span className="text-indigo-600">UniHaven</span></h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mt-2 font-bold">Simple, transparent, and direct</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative p-8 bg-slate-900/10 border border-slate-800 rounded-[2.5rem] text-center overflow-hidden group hover:bg-slate-900/30 transition-all">
               <span className="absolute -top-2 -right-2 text-6xl font-black text-slate-800/20 italic group-hover:text-indigo-500/10 transition-colors">{i+1}</span>
               <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                {s.icon}
               </div>
               <h5 className="text-white font-bold uppercase text-xs mb-2">{s.title}</h5>
               <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION - Removed huge bottom margin to sit better with footer */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-indigo-600 rounded-[3rem] p-8 lg:p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
              Find your next home
            </h2>
            <p className="text-indigo-100/70 text-sm lg:text-base mb-10 max-w-xl mx-auto font-medium">
              Browse through hundreds of verified hostels and contact owners directly. No middle-men, no brokers, just your next home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hostels" className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                Start Exploring <ArrowRight size={16} />
              </Link>
              <Link to="/ApplyHostelOwner" className="bg-indigo-950 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all border border-indigo-400/30 active:scale-95 shadow-lg">
                List Your Property
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default About;