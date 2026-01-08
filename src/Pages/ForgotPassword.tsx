import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2, ShieldQuestion } from 'lucide-react';
 // Adjust path to your RTK Query file

// Layout Components
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useForgotPasswordMutation } from '../features/Apis/Auth.Api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; msg: string }>({ type: null, msg: '' });

  // RTK Query Hook
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus({ type: null, msg: '' });

  try {
    // WRAP the email in an object: { email: email }
    await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
    setSubmitted(true);
    toast.success("RESET LINK SENT");
  } catch (err: any) {
    // If it fails here, the backend might be looking for a different key 
    // like "userEmail" or "identifier"
    setStatus({ 
      type: 'error', 
      msg: err.data?.message || 'Email not found in our secure records.' 
    });
  }
};

  return (
    <div className="bg-[#0B0F1A] min-h-screen flex flex-col font-sans text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full z-10">
          <div className="bg-[#161B26]/80 backdrop-blur-xl border border-gray-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/50">
            
            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 rounded-2xl text-indigo-400 mb-6 border border-indigo-500/20">
                    <ShieldQuestion size={36} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Forgot Password?</h1>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Don't worry, it happens. Enter your email and we'll send you a link to reset your security credentials.
                  </p>
                </div>

                {status.type === 'error' && (
                  <div className="mb-6 flex items-center p-4 rounded-2xl text-sm border bg-rose-500/10 border-rose-500/30 text-rose-400 animate-in fade-in zoom-in-95">
                    <span className="leading-relaxed font-medium">{status.msg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        required
                        className="w-full bg-[#0B0F1A]/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-600"
                        placeholder="ndiritugakenye@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4.5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex justify-center items-center h-14"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                      <div className="flex items-center gap-2">
                        <span>Send Reset Link</span>
                        <Send size={18} />
                      </div>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full text-emerald-400 mb-6 border border-emerald-500/20">
                  <CheckCircle2 size={44} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  We've sent a recovery link to <br />
                  <span className="text-indigo-400 font-semibold">{email}</span>. <br />
                  The link will expire in 60 minutes.
                </p>
                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 mb-8">
                  <p className="text-xs text-gray-500">
                    Did not receive the email? Check your spam folder or wait a few minutes.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-all group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return to Login
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;