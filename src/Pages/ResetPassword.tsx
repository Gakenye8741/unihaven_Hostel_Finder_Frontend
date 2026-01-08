import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

// Layout Components
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; msg: string }>({ type: null, msg: '' });
  const [loading, setLoading] = useState(false);

  // --- Password Strength Logic ---
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthColors = ['bg-gray-800', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
  const strengthLabels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', msg: 'Missing secure token. Please request a new link via email.' });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 2) return setStatus({ type: 'error', msg: 'Please use a stronger password.' });
    if (password !== confirmPassword) return setStatus({ type: 'error', msg: 'Passwords do not match.' });

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Credentials updated! Redirecting to login...' });
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setStatus({ type: 'error', msg: 'Link expired. Please request a new password reset.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Server connection error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0F1A] min-h-screen flex flex-col font-sans text-white">
      {/* 1. FIXED NAVBAR */}
      <Navbar />

      {/* 2. MAIN CONTENT AREA */}
      {/* Added pt-24 to prevent the fixed navbar from overlapping content */}
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20 relative overflow-hidden">
        
        {/* Background Decorative Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full z-10">
          <div className="bg-[#161B26]/80 backdrop-blur-xl border border-gray-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/50">
            
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 rounded-2xl text-indigo-400 mb-6 border border-indigo-500/20 ring-4 ring-indigo-500/5">
                <ShieldCheck size={36} strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
              <p className="text-gray-400 text-sm">Secure your Unihaven account with a new password.</p>
            </div>

            {/* Status Messages */}
            {status.msg && (
              <div className={`mb-8 flex items-start p-4 rounded-2xl text-sm border animate-in zoom-in-95 duration-300 ${
                status.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="mr-3 mt-0.5 shrink-0" size={18} /> : <AlertCircle className="mr-3 mt-0.5 shrink-0" size={18} />}
                <span className="leading-relaxed font-medium">{status.msg}</span>
              </div>
            )}

            {!token ? (
              <Link to="/forgot-password" className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all font-semibold group">
                <ArrowLeft size={18} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Support
              </Link>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Input: New Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-[#0B0F1A]/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-12 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-600"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Visualizer */}
                  <div className="mt-4 px-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-600">Strength: {strengthLabels[strength]}</span>
                    </div>
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((box) => (
                        <div key={box} className={`flex-1 rounded-full transition-all duration-700 ${box <= strength ? strengthColors[strength] : 'bg-gray-800'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input: Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 ml-1">Confirm Identity</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-[#0B0F1A]/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-gray-600"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={loading || status.type === 'success'}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4.5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex justify-center items-center h-14"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Save New Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
};

export default ResetPassword;