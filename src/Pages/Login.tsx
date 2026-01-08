import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, Home, ArrowRight } from "lucide-react";
import { useLoginUserMutation } from "../features/Apis/Auth.Api";
import Navbar from "../Components/Navbar";
import { setCredentials } from "../features/Auth/Auth.slice";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({ email: "", passwordHash: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanData = (data: any) => {
    try {
      if (typeof data === "string" && (data.startsWith("{") || data.startsWith("\""))) {
        return JSON.parse(data);
      }
      return data;
    } catch (e) {
      return data;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("VERIFYING ACCOUNT...", {
      style: {
        borderRadius: '12px',
        background: '#1E293B',
        color: '#fff',
        fontSize: '12px',
        border: '1px solid #6366F120'
      },
    });

    try {
      const response = await loginUser(formData).unwrap();
      const user = cleanData(response.user);
      const token = cleanData(response.token);
      const role = cleanData(response.role);

      dispatch(setCredentials({
        user,
        token,
        role: role || user?.role || "Student"
      }));
      
      toast.success("WELCOME TO UNIHAVEN", {
        id: loadingToast,
        duration: 3000,
        style: {
          borderRadius: '12px',
          background: '#0F172A',
          color: '#6366F1',
          fontSize: '12px',
          fontWeight: 'bold',
          border: '1px solid #6366F1'
        },
      });

      setTimeout(() => navigate("/"), 1500);

    } catch (err: any) {
      let errorMessage = "AUTHENTICATION FAILED";
      if (err.data?.error) {
        errorMessage = Array.isArray(err.data.error) 
          ? err.data.error[0].message 
          : err.data.error;
      }

      toast.error(errorMessage.toUpperCase(), {
        id: loadingToast,
        style: {
          borderRadius: '12px',
          background: '#0F172A',
          color: '#ff4b4b',
          fontSize: '12px',
          border: '1px solid #ff4b4b40'
        },
      });
    }
  };

  const hostelImageUrl = "https://images.unsplash.com/photo-1555854817-5b2247a8175f?auto=format&fit=crop&q=80&w=1200";

  return (
    <main className="bg-[#0B0F1A] min-h-screen w-full relative flex flex-col font-sans selection:bg-[#6366F1]/30">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* 1. FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Navbar />
      </div>

      <div className="flex flex-1 w-full pt-20"> 
        {/* Left Side: Branding & Trust */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={hostelImageUrl} 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale"
            alt="UniHaven Life"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/60 to-transparent z-20"></div>
          
          <div className="absolute bottom-16 left-16 z-30 max-w-lg">
            <div className="flex items-center gap-3 text-[#6366F1] mb-6 animate-pulse">
              <div className="p-2 bg-[#6366F1]/10 rounded-lg border border-[#6366F1]/20">
                <ShieldCheck size={24} />
              </div>
              <span className="font-black tracking-[0.4em] text-[11px] uppercase">Identity Secured</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              Access your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-indigo-400">Student Portal</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Manage your bookings, chat with hosts, and explore vetted hostels near your campus.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden">
          
          {/* Background Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-slate-800/60 shadow-2xl z-10 transition-all">
            <header>
              <div className="w-12 h-12 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#6366F1]/20">
                <Home className="text-[#6366F1]" size={28} />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.25em] font-bold">Secure Gateway to Unihaven</p>
            </header>

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest block ml-1 group-focus-within:text-[#6366F1] transition-colors">
                  Registered Email
                </label>
                <input 
                  name="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0B0F1A]/70 border border-slate-700 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all placeholder:text-slate-700"
                  placeholder="name@university.ac.ke"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest block ml-1 group-focus-within:text-[#6366F1] transition-colors">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input 
                    name="passwordHash"
                    type={showPassword ? "text" : "password"} 
                    required
                    value={formData.passwordHash}
                    onChange={handleChange}
                    className="w-full bg-[#0B0F1A]/70 border border-slate-700 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 text-slate-600 hover:text-[#6366F1] transition-colors z-20"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link - FIXED Z-INDEX & CURSOR */}
              <div className="flex justify-end pr-1 relative z-30">
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-black text-[#6366F1] uppercase tracking-widest hover:text-white transition-all cursor-pointer relative py-1"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6366F1] hover:bg-[#4f46e5] text-white font-black py-4 rounded-2xl uppercase text-[12px] tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-8 border-t border-slate-800/50">
              <p className="text-slate-500 text-[11px] mb-3">New student in town?</p>
               <button 
                type="button"
                onClick={() => navigate("/register")} 
                className="text-white font-black uppercase text-[11px] tracking-[0.2em] hover:text-[#6366F1] transition-all flex items-center justify-center gap-2 mx-auto"
               >
                Create Account
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;