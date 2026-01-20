import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  MessageCircle, 
  ArrowRight,
  Search,
  Users,
  Building2,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Students",
      question: "Is UniHaven free to use for students?",
      answer: "Yes! UniHaven is 100% free for students. We do not charge you to search, view, or contact hostel owners. We are here to simplify your housing search without extra costs."
    },
    {
      category: "Students",
      question: "How do I book a room through UniHaven?",
      answer: "Once you find a hostel you like, use the contact details provided to reach out to the owner or caretaker directly. You can then arrange a viewing and finalize the booking with them."
    },
    {
      category: "Security",
      question: "What if the hostel doesn't match the photos?",
      answer: "We strive for 100% accuracy through our verification process. If you visit a hostel and it significantly differs from the photos, please use the 'Report' button on the listing so our team can investigate."
    },
    {
      category: "Owners",
      question: "How do I list my property on UniHaven?",
      answer: "Click the 'List Your Property' button in the menu, fill out the application form, and our team will contact you for a physical verification visit before your listing goes live."
    },
    {
      category: "General",
      question: "Does UniHaven handle rent payments?",
      answer: "Currently, UniHaven is a discovery and verification platform. All payments are made directly to the hostel owners. We strongly advise against paying anything before physically seeing the room."
    }
  ];

  return (
    <div className="bg-[#030712] min-h-screen text-slate-300 selection:bg-indigo-600">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:pt-48 lg:pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6">
            <HelpCircle size={14} className="text-indigo-500" />
            <span className="text-indigo-500 font-black uppercase tracking-[0.3em] text-[9px]">Help Center</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
            Frequently Asked <span className="text-indigo-600">Questions</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Everything you need to know about UniHaven</p>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-6 mb-32">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border transition-all duration-300 rounded-3xl overflow-hidden ${
                openIndex === i ? "bg-slate-900/40 border-indigo-500/40 shadow-xl shadow-indigo-500/5" : "bg-slate-900/10 border-slate-800 hover:border-slate-700"
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 lg:p-8 text-left"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">{faq.category}</span>
                  <h3 className="text-white font-bold text-sm lg:text-base tracking-tight">{faq.question}</h3>
                </div>
                <div className={`p-2 rounded-xl transition-all ${openIndex === i ? "bg-indigo-600 text-white rotate-180" : "bg-slate-800 text-slate-400"}`}>
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-8 pb-8 text-slate-400 text-xs lg:text-sm leading-loose border-t border-slate-800/50 pt-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Still have questions?</h2>
            <p className="text-slate-500 text-sm max-w-sm font-medium">Can't find the answer you're looking for? Reach out to our support team.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <a href="mailto:support@unihaven.com" className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                Contact Support <MessageCircle size={16} />
             </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;