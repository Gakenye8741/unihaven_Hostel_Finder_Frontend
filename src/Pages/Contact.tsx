import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  Globe,
  Instagram,
  Twitter
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Contact: React.FC = () => {
  return (
    <div className="bg-[#030712] min-h-screen text-slate-300 selection:bg-indigo-500">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:pt-48 lg:pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6">
            <MessageSquare size={14} className="text-indigo-500" />
            <span className="text-indigo-500 font-black uppercase tracking-[0.3em] text-[9px]">Get In Touch</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
            Contact <span className="text-indigo-600">The Team</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
            Have a question or a business inquiry? We are here to help.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* CONTACT INFO CARDS */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-6">
                  <Mail size={20} />
                </div>
                <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">Email Us</h4>
                <p className="text-slate-400 text-xs font-bold">hello@unihaven.com</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-6">
                  <Phone size={20} />
                </div>
                <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">Call Us</h4>
                <p className="text-slate-400 text-xs font-bold">+254 700 000 000</p>
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-800 p-8 rounded-[2.5rem] space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase italic tracking-tight mb-1">Our Headquarters</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Nairobi Business District, Westlands Heights, 4th Floor, Kenya.</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase italic tracking-tight mb-1">Office Hours</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium uppercase tracking-wider">Mon - Fri: 8:00 AM - 6:00 PM<br/>Sat: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-slate-900/40 border border-slate-800 p-8 lg:p-12 rounded-[3rem]">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-indigo-600 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-indigo-600 transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Subject</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-indigo-600 transition-all appearance-none">
                  <option>General Inquiry</option>
                  <option>Property Listing Help</option>
                  <option>Report a Scammer</option>
                  <option>Technical Issue</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Message</label>
                <textarea rows={5} placeholder="How can we help you?" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-indigo-600 transition-all resize-none"></textarea>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                Send Message <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;