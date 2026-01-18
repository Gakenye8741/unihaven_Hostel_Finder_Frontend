import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSubmitIdentityDocsMutation, useGetUserProfileQuery } from '../features/Apis/Users.Api';
import { toast } from 'react-hot-toast';
import { 
  ShieldCheck, Upload, ChevronLeft, FileText, Camera, 
  CheckCircle2, Loader2, AlertCircle, ArrowRight, X, Clock,
  Fingerprint, Sparkles, ShieldAlert, LayoutDashboard, AlertTriangle, RefreshCcw, Lock
} from 'lucide-react';
import type { RootState } from '../App/store';
import Navbar from '../Components/Navbar'; // Ensure path is correct

const ApplyOwnerPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Refetch is used to sync UI with the latest database status (NOT_SUBMITTED, PENDING, etc.)
  const { data: profile, isLoading: profileLoading, refetch } = useGetUserProfileQuery(user?.id, {
    skip: !user?.id // Prevent query execution if no user is logged in
  });
  const [submitDocs, { isLoading: isSubmitting }] = useSubmitIdentityDocsMutation();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    idNumber: user?.id || "", 
    idFrontImageUrl: "",
    idBackImageUrl: "",
    passportImageUrl: ""
  });

  // --- LOGIC: VERIFICATION STATUS ENUM ---
  const verificationStatus = profile?.identityVerificationStatus || "NOT_SUBMITTED";
  
  const isRejected = useMemo(() => verificationStatus === "REJECTED", [verificationStatus]);
  const isPending = useMemo(() => verificationStatus === "PENDING", [verificationStatus]);
  const isApproved = useMemo(() => verificationStatus === "APPROVED", [verificationStatus]);

  // Guard: Only lock the screen if the audit is currently in progress or already approved
  const isLocked = useMemo(() => isPending || isApproved, [isPending, isApproved]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof formData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const CLOUDINARY_UPLOAD_PRESET = "unihaven"; 
    const CLOUDINARY_CLOUD_NAME = "dc7dvxjkx";

    setUploadingField(fieldName);
    setUploadProgress(0);
    const toastId = toast.loading(`Encrypting ${fieldName.replace('ImageUrl', '').toUpperCase()}...`);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFormData(prev => ({ ...prev, [fieldName]: response.secure_url }));
          toast.success("Document Vaulted Successfully ✅", { id: toastId });
        } else {
          toast.error("Upload failed", { id: toastId });
        }
        setUploadingField(null);
      };

      xhr.send(uploadData);
    } catch (error) {
      toast.error("Process failed", { id: toastId });
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Authentication required.");
    if (isPending) return toast.error("Application already under review.");
    if (isApproved) return toast.error("Identity already verified.");
    
    if (!formData.idFrontImageUrl || !formData.idBackImageUrl) {
      return toast.error("Please provide both front and back ID images.");
    }

    try {
      await submitDocs(formData).unwrap();
      setShowSuccessModal(true);
      refetch(); // Forces UI to switch to LockedState (PENDING)
    } catch (err: any) {
      toast.error(err?.data?.message || "Internal submission error.");
    }
  };

  if (profileLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} onHome={() => navigate('/')} />}

      <div className="relative z-10 max-w-6xl mx-auto py-32 px-6 lg:px-8">
        
        {/* NAV HEADER */}
        <div className="flex justify-between items-center mb-16">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
              <ChevronLeft size={16} />
            </div>
            Exit Verification
          </button>
          <div className="flex items-center gap-4">
             {user && <StatusBadge status={verificationStatus} />}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: INFORMATION ARCHITECTURE */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all border ${isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'}`}>
                <ShieldCheck size={40} strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-[0.9] mb-4 uppercase">
                Owner <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Credentials</span>
              </h1>
              <p className="text-slate-400 font-medium leading-relaxed max-w-md">
                Unihaven mandates a one-time cryptographic identity audit for all hostel managers to maintain ecosystem trust.
              </p>
            </div>

            <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-slate-800" />
              <RoadmapStep number="01" title="Visual Identity" desc="High-resolution captures of National ID." active={!isLocked && !!user} />
              <RoadmapStep number="02" title="Biometric Sync" desc="Admin cross-references data with profile." active={isPending} />
              <RoadmapStep number="03" title="Access Granted" desc="Dashboard unlocking & listing privileges." active={isApproved} />
            </div>
          </div>

          {/* RIGHT: DYNAMIC CONTENT */}
          <div className="lg:col-span-7">
            {!user ? (
              <UnauthenticatedState onLogin={() => navigate('/login')} />
            ) : isApproved ? (
              <ApprovedState user={user?.username} onDashboard={() => navigate('/owner-dashboard')} />
            ) : isPending ? (
              <LockedState user={user?.username} onReturn={() => navigate('/')} />
            ) : (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[4rem] p-8 md:p-14 shadow-3xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
                
                {isRejected && (
                  <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
                    <AlertTriangle className="text-rose-500 shrink-0" size={24} />
                    <div className="space-y-1">
                      <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest">Verification Rejected</p>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">Your documents did not meet our security standards. Please re-upload clearer, valid images.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3">
                        <Fingerprint size={14} /> System ID Reference
                      </label>
                    </div>
                    <input 
                      type="text" readOnly
                      className="w-full bg-slate-950/60 border border-slate-800/80 rounded-3xl px-8 py-6 text-slate-500 cursor-not-allowed font-bold italic"
                      value={formData.idNumber}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <UploadCard label="Identity Front" field="idFrontImageUrl" url={formData.idFrontImageUrl} isUploading={uploadingField === 'idFrontImageUrl'} progress={uploadProgress} onFileChange={handleFileUpload} />
                      <UploadCard label="Identity Back" field="idBackImageUrl" url={formData.idBackImageUrl} isUploading={uploadingField === 'idBackImageUrl'} progress={uploadProgress} onFileChange={handleFileUpload} />
                    </div>
                    <UploadCard label="Secondary Passport (Optional)" field="passportImageUrl" url={formData.passportImageUrl} isUploading={uploadingField === 'passportImageUrl'} progress={uploadProgress} onFileChange={handleFileUpload} />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || uploadingField !== null}
                    className="group w-full relative overflow-hidden bg-white hover:bg-indigo-50 text-[#0F172A] font-black py-8 rounded-[2.5rem] uppercase text-[11px] tracking-[0.4em] transition-all disabled:opacity-30 shadow-2xl"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                        <>{isRejected ? 'Resubmit for Audit' : 'Establish Partnership'} <Sparkles size={18} /></>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const UnauthenticatedState = ({ onLogin }: { onLogin: () => void }) => (
  <div className="bg-slate-900/40 border border-indigo-500/20 rounded-[4rem] p-16 text-center shadow-3xl animate-in fade-in zoom-in-95 duration-700">
     <div className="bg-indigo-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 text-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.1)]">
        <Lock size={44} strokeWidth={1.5} />
     </div>
     <h3 className="text-3xl font-black text-white italic tracking-tight mb-4 uppercase">Identity Locked</h3>
     <p className="text-slate-400 mb-12 text-sm leading-relaxed px-10">
       You must establish a secure session before initiating the identity vaulting process. Authentication is required to link credentials.
     </p>
     <button onClick={onLogin} className="bg-white text-[#0F172A] px-12 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
       Sign In to Begin <ArrowRight size={16} />
     </button>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    NOT_SUBMITTED: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${styles[status]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'PENDING' ? 'animate-ping bg-amber-500' : 'bg-current'}`} />
      <span className="text-[9px] font-black uppercase tracking-widest">Status: {status.replace('_', ' ')}</span>
    </div>
  );
};

const ApprovedState = ({ user, onDashboard }: any) => (
  <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[4rem] p-16 text-center shadow-3xl animate-in zoom-in-95 duration-500">
     <div className="bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <CheckCircle2 size={48} strokeWidth={2.5} />
     </div>
     <h3 className="text-3xl font-black text-white italic tracking-tight mb-4 uppercase">Verified Partner</h3>
     <p className="text-slate-400 mb-12 text-sm leading-relaxed px-10">
       Congratulations <span className="text-white font-bold underline">@{user}</span>, your identity audit is complete. You now have full listing and management privileges.
     </p>
     <button onClick={onDashboard} className="bg-emerald-500 text-white px-12 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
       <LayoutDashboard size={16} /> Enter Owner Portal
     </button>
  </div>
);

const RoadmapStep = ({ number, title, desc, active = false }: any) => (
  <div className={`flex gap-8 transition-all duration-500 ${active ? 'opacity-100 translate-x-2' : 'opacity-20'}`}>
    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 font-black italic text-xs ${active ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/40' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
      {number}
    </div>
    <div>
      <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1.5 italic">{title}</h4>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[200px]">{desc}</p>
    </div>
  </div>
);

const UploadCard = ({ label, field, url, isUploading, progress, onFileChange }: any) => (
  <div className="space-y-4 group/card">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 ml-2 transition-colors group-hover/card:text-indigo-400">
      <Camera size={12} /> {label}
    </label>
    <div className={`relative h-56 rounded-[3rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center overflow-hidden 
      ${url ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-950/40 hover:border-indigo-500/40 hover:bg-slate-900/60'}`}>
      
      {url ? (
        <div className="absolute inset-0 p-3 group/preview">
          <img src={url} alt="Vaulted" className="w-full h-full object-cover rounded-[2.2rem] opacity-60 group-hover/preview:opacity-40 transition-opacity duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
             <div className="bg-white p-3 rounded-full shadow-2xl scale-125">
                <CheckCircle2 className="text-indigo-600" size={24} strokeWidth={3} />
             </div>
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 px-4 py-1.5 rounded-full shadow-xl">Vaulted</span>
          </div>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => onFileChange(e, field)} />
        </div>
      ) : isUploading ? (
        <div className="w-full px-12 space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 italic">Syncing...</span>
            <span className="text-xs font-black text-white">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 group/btn">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl text-slate-600 group-hover/btn:text-indigo-400 group-hover/btn:border-indigo-500/50 group-hover/btn:bg-indigo-500/5 transition-all duration-500 shadow-xl">
            <Upload size={32} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover/btn:text-slate-200 transition-colors">Capture Asset</p>
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => onFileChange(e, field)} />
        </div>
      )}
    </div>
  </div>
);

const SuccessModal = ({ onClose, onHome }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500">
    <div className="bg-[#0F172A] border border-indigo-500/30 w-full max-w-xl rounded-[4rem] p-12 text-center relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)]">
      <div className="bg-indigo-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-400">
        <Clock size={48} className="animate-pulse" />
      </div>
      <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4">AUDIT IN PROGRESS</h2>
      <p className="text-slate-400 font-medium mb-10 leading-relaxed px-6 text-sm">
        Your credentials have been securely transmitted to the Unihaven Governance Team. We cross-verify all documents within 24 hours.
      </p>
      <div className="flex flex-col gap-4">
        <button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-3xl uppercase text-[10px] tracking-[0.3em] transition-all shadow-xl shadow-indigo-600/20">
          Track Verification Status
        </button>
        <button onClick={onHome} className="w-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-black py-6 rounded-3xl uppercase text-[10px] tracking-[0.3em] transition-all">
          Return to Hub
        </button>
      </div>
    </div>
  </div>
);

const LockedState = ({ user, onReturn }: any) => (
  <div className="bg-slate-900/40 border border-amber-500/20 rounded-[4rem] p-16 text-center shadow-3xl">
     <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-10 text-amber-500">
        <Clock size={40} className="animate-pulse" />
     </div>
     <h3 className="text-3xl font-black text-white italic tracking-tight mb-4 uppercase">Audit In Progress</h3>
     <p className="text-slate-400 mb-12 text-sm leading-relaxed px-10">
       Partner <span className="text-white font-bold underline">@{user}</span>, our team is currently auditing your identity assets. This usually takes less than 24 hours.
     </p>
     <button onClick={onReturn} className="bg-amber-500 text-[#0F172A] px-12 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all">
       Back to Dashboard
     </button>
  </div>
);

export default ApplyOwnerPage;