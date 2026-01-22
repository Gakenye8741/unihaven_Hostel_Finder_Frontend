import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetUserProfileQuery, 
  useUpdateMyProfileMutation 
} from '../../features/Apis/Users.Api';
// Import the password mutation from your Auth API
import { useChangePasswordMutation } from '../../features/Apis/Auth.Api';
import { 
  User, Mail, Phone, ShieldCheck, Fingerprint, 
  AtSign, Save, Loader2, Info, BadgeCheck, 
  Smartphone, Hash, ShieldAlert, Activity,
  Globe, Calendar, MapPin, Copy, CheckCircle2,
  Lock, KeyRound, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfileManager: React.FC = () => {
  const { user: authUser } = useSelector((state: any) => state.auth);
  const userId = authUser?.id || authUser?._id;

  const { data: profile, isLoading: isFetching } = useGetUserProfileQuery(userId);
  const [updateMe, { isLoading: isUpdatingMe }] = useUpdateMyProfileMutation();
  
  // --- PASSWORD STATE & MUTATION ---
  const [changePassword, { isLoading: isChangingPass }] = useChangePasswordMutation();
  const [showPass, setShowPass] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    gender: '',
    phone: '',
    whatsappPhone: '',
    role: '',
    email: '',
    accountStatus: '',
    identityStatus: '',
    idNumber: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        phone: profile.phone || '',
        whatsappPhone: profile.whatsappPhone || '',
        role: profile.role || 'User',
        email: profile.email || '',
        accountStatus: profile.accountStatus || 'ACTIVE',
        identityStatus: profile.identityVerificationStatus || 'NOT_SUBMITTED',
        idNumber: profile.idNumber || 'NOT_SET'
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyId = () => {
    navigator.clipboard.writeText(userId);
    toast.success("ID Copied to clipboard");
  };

  const handleUpdateProfile = async () => {
    try {
      await updateMe({
        username: formData.username,
        fullName: formData.fullName,
        bio: formData.bio,
        gender: formData.gender,
        phone: formData.phone,
        whatsappPhone: formData.whatsappPhone
      }).unwrap();
      toast.success("Profile Node Synchronized");
    } catch (err) {
      toast.error("Sync Failed");
    }
  };

  // --- PASSWORD UPDATE HANDLER ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passData.currentPassword || !passData.newPassword) {
      return toast.error("Please fill all password fields");
    }
    try {
      await changePassword(passData).unwrap();
      toast.success("Security Credentials Updated");
      setPassData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err.data?.message || "Password change failed");
    }
  };

  if (isFetching) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Decrypting Identity...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-full overflow-hidden bg-[#020617] text-slate-300 p-4 lg:p-8 font-sans min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- SECTION 1: IDENTITY HEADER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Avatar & Basic Info Card */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Fingerprint size={120} />
            </div>
            <div className="relative shrink-0">
              <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                {formData.username.substring(0, 1)}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2.5 bg-slate-950 border border-white/10 rounded-xl text-indigo-400">
                <BadgeCheck size={18} />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left z-10">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase italic truncate max-w-[300px]">
                {formData.fullName || formData.username}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  {formData.role}
                </span>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {formData.accountStatus}
                </span>
              </div>
              <p className="mt-3 text-[11px] text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2 italic">
                <Mail size={12} /> {formData.email}
              </p>
            </div>
          </div>

          {/* System ID Card */}
          <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">System UID</span>
               <button onClick={copyId} className="p-2 hover:bg-indigo-500/20 rounded-xl transition-colors text-indigo-400">
                  <Copy size={14} />
               </button>
            </div>
            <div className="bg-slate-950/50 border border-white/5 p-3 rounded-xl mb-4">
              <p className="text-[10px] font-mono text-slate-400 break-all">{userId}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[70%]" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 uppercase">Trust Score: 70%</span>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: EDITABLE CORE & SIDEBAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Edit Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-6 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><User size={18} /></div>
                <h2 className="text-white font-black uppercase text-xs tracking-[0.3em]">Identity Profile</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Account ID Name</label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400" size={16} />
                    <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/40 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400" size={16} />
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/40 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct Phone</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400" size={16} />
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+254..." className="w-full bg-slate-950 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/40 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp Comm</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400" size={16} />
                    <input name="whatsappPhone" value={formData.whatsappPhone} onChange={handleChange} placeholder="+254..." className="w-full bg-slate-950 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/40 outline-none transition-all" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 text-sm text-white focus:border-indigo-500/40 outline-none transition-all resize-none" />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingMe}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
                >
                  {isUpdatingMe ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Card */}
            <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6">
               <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-amber-500" size={18} />
                <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Compliance</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Verification Status", val: formData.identityStatus.replace('_', ' '), color: "text-amber-500" },
                  { label: "ID Number", val: formData.idNumber, color: "text-slate-400" },
                  { label: "Account Scope", val: "Global", color: "text-indigo-400" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{item.label}</span>
                    <span className={`text-[10px] font-bold uppercase ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- NEW SECURITY PROTOCOL (PASSWORD CHANGE) --- */}
            <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><Lock size={16} /></div>
                <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Security Protocol</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                    <input 
                      type={showPass ? "text" : "password"}
                      placeholder="Current Password"
                      value={passData.currentPassword}
                      onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:border-rose-500/40 outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                    <input 
                      type={showPass ? "text" : "password"}
                      placeholder="New Password"
                      value={passData.newPassword}
                      onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-11 pr-11 text-xs text-white focus:border-rose-500/40 outline-none" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {isChangingPass ? <Loader2 className="animate-spin" size={14} /> : "Update Security Key"}
                </button>
              </form>
            </div>

            {/* Verification Tip */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 rounded-[2.5rem] p-6 relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-400" /> Identity Boost
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Your identity is currently <span className="text-indigo-400">Not Verified</span>. Upload your documents to access premium hostel management features.
                  </p>
                  <button className="mt-4 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4">
                    Begin Verification →
                  </button>
               </div>
            </div>

          </div>
        </div>
        
        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-white/5">
           <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em]">UniHaven Sentinel Protocol v1.0.2</p>
           <div className="flex gap-6 text-[9px] font-bold text-slate-700 uppercase tracking-widest">
              <span className="hover:text-indigo-500 cursor-pointer transition-colors">Security Policy</span>
              <span className="hover:text-indigo-500 cursor-pointer transition-colors">Audit Logs</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManager;