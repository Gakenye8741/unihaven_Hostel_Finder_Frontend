import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, RotateCcw, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { useVerifyEmailMutation, useResendVerificationMutation } from '../features/Apis/Auth.Api'; 
import toast from 'react-hot-toast';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the email from the previous page or local storage
  const email = location.state?.email || localStorage.getItem('user_email_to_verify') || "";

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // API Hooks
  const [verifyEmail, { isLoading: isVerifying, isSuccess: isVerified }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  // --- SIMPLE THEMED TOASTS ---
  const notify = {
    success: (msg: string) => toast.success(msg, {
      style: { background: '#0F172A', color: '#10b981', border: '1px solid #10b98133', fontSize: '12px', fontWeight: 'bold' },
    }),
    error: (msg: string) => toast.error(msg, {
      style: { background: '#0F172A', color: '#f43f5e', border: '1px solid #f43f5e33', fontSize: '12px', fontWeight: 'bold' },
    }),
  };

  // Timer for the resend button
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verification
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = otp.join('');
    
    if (code.length < 6) {
      notify.error("Please enter all 6 digits.");
      return;
    }

    try {
      await verifyEmail({ email, confirmationCode: code }).unwrap();
      notify.success("Email Verified Successfully!");
      localStorage.removeItem('user_email_to_verify');
    } catch (err: any) {
      // THIS DISPLAYS YOUR SERVER ERROR: "Invalid or expired verification code."
      const serverMessage = err.data?.message || "Something went wrong. Try again.";
      notify.error(serverMessage);
      
      // Clear the boxes if it fails
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // Automatically check when 6 digits are typed
  useEffect(() => {
    if (otp.join('').length === 6) handleVerify();
  }, [otp]);

  const handleResend = async () => {
    try {
      await resendVerification({ email }).unwrap();
      setTimer(60);
      notify.success("A new code has been sent.");
    } catch (err: any) {
      notify.error(err.data?.message || "Could not send code.");
    }
  };

  // Screen shown after successful verification
  if (isVerified) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0F172A] border border-emerald-500/20 rounded-3xl p-10 text-center space-y-6">
          <CheckCircle size={60} className="mx-auto text-emerald-500" />
          <h2 className="text-2xl font-bold text-white">Success!</h2>
          <p className="text-slate-400 text-sm">Your email is now verified. you can now log in.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <header className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-500 mb-4">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-sm text-slate-500 mt-2">
            We sent a code to: <br />
            <span className="text-indigo-400">{email || "your email"}</span>
          </p>
        </header>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e) }
                className="w-12 h-14 text-center bg-slate-950 border border-slate-800 rounded-xl text-xl font-bold text-white focus:border-indigo-500 outline-none transition-all"
                disabled={isVerifying}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.some(v => v === '')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {isVerifying ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-500">Didn't get a code?</p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className="mt-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 disabled:text-slate-700 transition-colors flex items-center justify-center mx-auto gap-2"
          >
            {isResending ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </button>
        </footer>

      </div>
    </div>
  );
};

export default VerifyEmail;