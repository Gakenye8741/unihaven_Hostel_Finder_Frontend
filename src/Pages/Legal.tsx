import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileText, Lock, Eye, Scale, 
  AlertCircle, ArrowRight, Fingerprint, Cookie, 
  UserCheck, Loader2 
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Legal: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { pathname } = useLocation();

  // Scroll to top on load and simulate page ready
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="bg-[#030712] min-h-screen text-slate-400 selection:bg-indigo-500/30">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:pt-48 lg:pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6">
            {isPageLoading ? <Loader2 size={12} className="text-indigo-500 animate-spin" /> : <Scale size={12} className="text-indigo-500" />}
            <span className="text-indigo-500 font-black uppercase tracking-[0.3em] text-[9px]">Legal Framework 2026</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
            Compliance & <span className="text-indigo-600">Privacy</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            Protecting the UniHaven Student Community
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          
          {/* STICKY SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block sticky top-32 h-fit space-y-8">
            <div className="bg-slate-900/20 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6 border-b border-white/5 pb-4">Legal Pillars</h4>
              <nav className="space-y-4">
                {[
                  { id: 'terms', label: '1. Terms of Service', icon: <FileText size={14} /> },
                  { id: 'privacy', label: '2. Privacy Policy', icon: <Lock size={14} /> },
                  { id: 'cookies', label: '3. Cookie Policy', icon: <Cookie size={14} /> },
                  { id: 'rights', label: '4. User Rights', icon: <UserCheck size={14} /> }
                ].map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-all group"
                  >
                    <span className="text-slate-700 group-hover:text-indigo-500 transition-colors">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl">
              <AlertCircle size={20} className="text-indigo-500 mb-4" />
              <p className="text-[10px] leading-relaxed font-bold text-slate-500 uppercase tracking-tight">
                Last modified: Jan 20, 2026. These terms apply to all residents and property owners.
              </p>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="space-y-24">
            
            {/* 1. TERMS OF SERVICE */}
            {/* 1. TERMS OF SERVICE - DETAILED VERSION */}
<div id="terms" className="scroll-mt-32 space-y-10">
  <div className="flex items-center gap-4 text-white border-b border-white/5 pb-6">
    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
      <FileText size={24} className="text-indigo-500" />
    </div>
    <div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Terms of Service</h2>
      <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-[0.3em] mt-2">Operational Agreement & Liability</p>
    </div>
  </div>

  <div className="space-y-10 text-[13px] leading-relaxed">
    
    {/* Nature of Service */}
    <div className="space-y-4">
      <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <span className="w-8 h-px bg-indigo-500"></span> 1.1 The Platform Role
      </h3>
      <p>
        UniHaven is a <span className="text-white font-bold text-xs uppercase italic tracking-tight">Marketplace Infrastructure Provider</span>. We provide the technology for Students to discover Hostels and for Owners to list them. 
        <span className="text-indigo-400 font-bold"> Crucially:</span> UniHaven is not a real estate agent, a landlord, or an insurance provider. Any rental agreement formed is a direct contract between the Student and the Owner.
      </p>
    </div>

    {/* Verification & Accuracy */}
    <div className="space-y-4">
      <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <span className="w-8 h-px bg-indigo-500"></span> 1.2 Listing Integrity
      </h3>
      <p>
        While UniHaven employs a verification process for property owners, we do not guarantee the current state, cleanliness, or safety of the physical premises.
      </p>
      <ul className="grid md:grid-cols-2 gap-4">
        <li className="p-4 bg-white/5 rounded-xl border border-white/5">
          <span className="text-indigo-500 font-black block mb-1">OWNER DUTY:</span>
          Owners must provide high-fidelity photos. Misrepresentation of distance to campus or amenities results in permanent banning.
        </li>
        <li className="p-4 bg-white/5 rounded-xl border border-white/5">
          <span className="text-indigo-500 font-black block mb-1">STUDENT DUTY:</span>
          Students are required to conduct a physical site visit before making any financial commitment.
        </li>
      </ul>
    </div>

    {/* Financial Terms */}
    <div className="space-y-4">
      <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <span className="w-8 h-px bg-indigo-500"></span> 1.3 Fee Structure & Refunds
      </h3>
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <span className="text-white font-bold uppercase text-[10px]">Owner Listing Fees:</span>
            <span className="text-right text-slate-500">Fees paid for "Premium Listing" or "Verification Badges" are earned upon service activation. No refunds are issued if an owner decides to delist.</span>
          </div>
          <div className="flex justify-between items-start gap-4 pt-4 border-t border-white/5">
            <span className="text-white font-bold uppercase text-[10px]">Booking Deposits:</span>
            <span className="text-right text-slate-500">UniHaven does not currently hold rent deposits. All financial transactions occur externally. We are not liable for deposit disputes.</span>
          </div>
        </div>
      </div>
    </div>

    {/* Accountability */}
    <div className="space-y-4">
      <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <span className="w-8 h-px bg-indigo-500"></span> 1.4 Security & Account Use
      </h3>
      <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl">
        <p className="text-xs italic leading-loose">
          "The user is solely responsible for maintaining the confidentiality of their credentials. Any action taken via your account (e.g., booking requests or listing edits) will be legally attributed to you. If you suspect a breach, you must notify <span className="text-white underline">security@unihaven.com</span> within 6 hours."
        </p>
      </div>
    </div>

    {/* Termination */}
    <div className="space-y-4">
      <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <span className="w-8 h-px bg-indigo-500"></span> 1.5 Right to Terminate
      </h3>
      <p>
        UniHaven reserves the absolute right to suspend or delete any account found violating community standards, including but not limited to: harassment of students, fraudulent listings, or bypassing platform security.
      </p>
    </div>

  </div>
</div>

            {/* 2. PRIVACY POLICY */}
            <div id="privacy" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800"><Lock size={20} className="text-indigo-500" /></div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Privacy Policy</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <Fingerprint className="text-indigo-500 mb-4" />
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Encryption</h4>
                  <p className="text-xs leading-relaxed">All student identification data is encrypted using AES-256 standards before storage.</p>
                </div>
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <Eye className="text-emerald-500 mb-4" />
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Usage</h4>
                  <p className="text-xs leading-relaxed">We collect behavioral data solely to improve your hostel matching algorithm.</p>
                </div>
              </div>
            </div>

            {/* 3. COOKIE POLICY */}
            <div id="cookies" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800"><Cookie size={20} className="text-indigo-500" /></div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Cookie Policy</h2>
              </div>
              <div className="text-sm leading-relaxed space-y-4">
                <p>We use cookies to keep you logged in and remember your campus preferences. You can manage these in your browser settings, but some features like "Saved Hostels" may not work without them.</p>
                <div className="bg-slate-900/20 p-4 border-l-2 border-indigo-600 italic">
                  "UniHaven does not use third-party tracking cookies for advertising."
                </div>
              </div>
            </div>

            {/* 4. USER RIGHTS */}
            {/* 4. USER RIGHTS - DETAILED DATA GOVERNANCE */}
<div id="rights" className="scroll-mt-32 space-y-10">
  <div className="flex items-center gap-4 text-white border-b border-white/5 pb-6">
    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
      <UserCheck size={24} className="text-[#6366F1]" />
    </div>
    <div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">User Rights</h2>
      <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-[0.3em] mt-2">Data Sovereignty & Control</p>
    </div>
  </div>

  <div className="space-y-8 text-[13px] leading-relaxed">
    <p className="text-slate-400">
      Under the <span className="text-white font-bold italic underline decoration-indigo-500/50">Kenya Data Protection Act</span>, you are the owner of your data. UniHaven is merely the custodian. You have the following enforceable rights:
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Right to Access */}
      <div className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Eye size={18} className="text-indigo-500" />
        </div>
        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Right to Access</h4>
        <p className="text-[11px] text-slate-500">You may request a full copy of all personal data we hold, including search history and profile metadata, delivered in a machine-readable format.</p>
      </div>

      {/* Right to Rectification */}
      <div className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <FileText size={18} className="text-indigo-500" />
        </div>
        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Right to Rectification</h4>
        <p className="text-[11px] text-slate-500">If any information (such as your student ID or property location) is inaccurate, you have the right to demand immediate correction.</p>
      </div>

      {/* Right to Erasure */}
      <div className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-rose-500/30 transition-all">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <ShieldCheck size={18} className="text-rose-500" />
        </div>
        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2 text-rose-500">Right to be Forgotten</h4>
        <p className="text-[11px] text-slate-500">You can request the permanent deletion of your account. We will purge your data from our active servers within 30 days, except where retention is legally required.</p>
      </div>

      {/* Right to Object */}
      <div className="group p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <AlertCircle size={18} className="text-indigo-500" />
        </div>
        <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Right to Object</h4>
        <p className="text-[11px] text-slate-500">You may opt-out of automated hostel matching or any direct marketing communication at any time via your dashboard settings.</p>
      </div>
    </div>

    {/* Deletion Workflow */}
    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2rem] space-y-4">
      <h3 className="text-white font-black uppercase text-xs tracking-widest italic">How to Exercise Your Rights:</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Self-Service</p>
          <p className="text-[11px]">Navigate to <span className="text-white italic">Settings &gt; Privacy</span> to download your data or initiate account closure.</p>
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Direct Request</p>
          <p className="text-[11px]">Email our Data Protection Officer at <span className="text-white italic">privacy@unihaven.com</span> with the subject line "Data Request".</p>
        </div>
      </div>
    </div>
  </div>
</div>

            {/* CTA SECTION */}
            <div className="relative p-1 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500">
              <div className="bg-[#030712] rounded-[2.4rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Need Clarification?</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Our legal team is available for student consultations.</p>
                </div>
                <a href="mailto:legal@unihaven.com" className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2 group">
                  Contact Legal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Legal;