import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, User, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { useRegisterUserMutation } from "../features/Apis/Auth.Api"; // Adjust path
import Navbar from "../Components/Navbar";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    passwordHash: "",
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // --- Password Strength Logic ---
  const strength = useMemo(() => {
    const pw = formData.passwordHash;
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }, [formData.passwordHash]);

  const strengthColors = ['bg-gray-800', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadingToast = toast.loading("CREATING YOUR PROFILE...");

    try {
      await registerUser(formData).unwrap();
      toast.success("ACCOUNT CREATED! CHECK YOUR EMAIL.", { id: loadingToast });
      
      // Navigate to verify-email page so they can enter the OTP
      setTimeout(() => navigate("/verify-email", { state: { email: formData.email } }), 2000);
    } catch (err: any) {
      const msg = err.data?.message || "REGISTRATION FAILED";
      toast.error(msg.toUpperCase(), { id: loadingToast });
    }
  };

  const sideImageUrl = "https://images.unsplash.com/photo-1523240715630-991c2e8113e2?auto=format&fit=crop&q=80&w=1200";

  return (
    <main className="bg-[#0B0F1A] min-h-screen w-full relative flex flex-col font-sans">
      <Toaster position="top-right" />
      
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Navbar />
      </div>

      <div className="flex flex-1 w-full pt-20">
        {/* Left Side: Branding */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={sideImageUrl} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
            alt="University Students"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/50 to-transparent z-20"></div>
          
          <div className="absolute bottom-16 left-16 z-30 max-w-lg">
            <div className="flex items-center gap-3 text-[#6366F1] mb-6">
              <ShieldCheck size={28} />
              <span className="font-black tracking-[0.4em] text-[11px] uppercase text-white">Security First</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Start your <br />
              <span className="text-indigo-500">Unihaven Experience</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join thousands of students finding safe, affordable housing. One account, endless possibilities.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative overflow-y-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-full max-w-md space-y-6 bg-slate-900/30 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/60 shadow-2xl z-10 my-8">
            <header>
              <div className="w-12 h-12 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#6366F1]/20">
                <UserPlus className="text-[#6366F1]" size={26} />
              </div>
              <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Create Account</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold font-mono">Step 1: Personal Details</p>
            </header>

            <form className="space-y-4" onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest block ml-1">Full Name</label>
                <div className="relative flex items-center group">
                  <User className="absolute left-4 text-slate-600 group-focus-within:text-[#6366F1]" size={16} />
                  <input 
                    name="fullName"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0B0F1A]/60 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#6366F1] transition-all"
                    placeholder="Ndiritu Gakenye"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest block ml-1">Username</label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-slate-600 text-sm font-bold">@</span>
                  <input 
                    name="username"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0B0F1A]/60 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#6366F1] transition-all"
                    placeholder="wantam"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest block ml-1">Email Address</label>
                <div className="relative flex items-center group">
                  <Mail className="absolute left-4 text-slate-600 group-focus-within:text-[#6366F1]" size={16} />
                  <input 
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0B0F1A]/60 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#6366F1] transition-all"
                    placeholder="ndiritu@gmail.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest block ml-1">Secure Password</label>
                <div className="relative flex items-center group">
                  <Lock className="absolute left-4 text-slate-600 group-focus-within:text-[#6366F1]" size={16} />
                  <input 
                    name="passwordHash"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0B0F1A]/60 border border-slate-700 rounded-xl py-3 pl-11 pr-12 text-sm text-white outline-none focus:border-[#6366F1] transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-600 hover:text-white">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength Meter */}
                <div className="flex gap-1.5 mt-2 px-1">
                   {[1, 2, 3, 4].map(step => (
                     <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step <= strength ? strengthColors[strength] : 'bg-slate-800'}`} />
                   ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6366F1] hover:bg-[#4f46e5] text-white font-black py-4 rounded-xl uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3 mt-4"
              >
                {isLoading ? "CREATING ACCOUNT..." : (
                  <>
                    <span>JOIN UNIHAVEN</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-6 border-t border-slate-800/50">
              <p className="text-slate-500 text-[10px] mb-3">Already have an account?</p>
              <Link to="/login" className="text-white font-black uppercase text-[10px] tracking-widest hover:text-[#6366F1] transition-all">
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;