import React, { useState } from 'react';
import { 
  useGetPendingVerificationsQuery, 
  useVerifyUserIdentityMutation 
} from '../../features/Apis/Users.Api';
import { 
  ShieldCheck, Eye, CheckCircle, XCircle, Loader2, 
  User, Fingerprint, Mail, ShieldAlert, Info, Edit3, Briefcase,
  MessageSquare, AlertTriangle, ExternalLink,
  History, Phone, Globe, Smartphone, UserCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '../../Components/Navbar';

const AdminVerificationPanel: React.FC = () => {
  // Syncs with AdminQueue tag in your API
  const { data: pendingUsers, isLoading } = useGetPendingVerificationsQuery({});
  const [verifyUser, { isLoading: isProcessing }] = useVerifyUserIdentityMutation();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [remarks, setRemarks] = useState("Documents verified against national database.");
  const [targetRole, setTargetRole] = useState("Caretaker");

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedUser) return;

    // Matches your PATCH structure perfectly
    const payload = {
      id: selectedUser.id,
      status: status,
      targetRole: targetRole, // API handles whether to apply this based on status
      remarks: remarks
    };

    const toastId = toast.loading(`Executing ${status} workflow...`);
    
    try {
      const response = await verifyUser(payload).unwrap();
      toast.success(response.message || `Verification ${status} successfully ✅`, { id: toastId });
      
      // Clear selection to return to the empty state/queue
      setSelectedUser(null);
      setRemarks("Documents verified against national database.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Critical API Failure", { id: toastId });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />
      
      <div className="max-w-[1600px] mx-auto py-32 px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
              Identity <br /> <span className="text-indigo-500">Governance</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">System Audit Authorization Level 4</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <History size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Queue Status</p>
              <p className="text-xl font-black text-white italic">{pendingUsers?.length || 0} AWAITING AUDIT</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* QUEUE SIDEBAR */}
          <div className="lg:col-span-3 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar pr-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-4">Pending Applications</p>
            {pendingUsers?.map((user: any) => (
              <button 
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-6 rounded-[2.5rem] border transition-all duration-300 ${
                  selectedUser?.id === user.id 
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${selectedUser?.id === user.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {user.username.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="font-black text-white text-sm uppercase italic truncate">{user.username}</h3>
                    <p className="text-[10px] text-slate-500 tracking-widest truncate">{user.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* AUDIT WORKSPACE */}
          <div className="lg:col-span-9">
            {selectedUser ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-[4rem] p-10">
                <div className="grid lg:grid-cols-3 gap-10">
                  
                  {/* COLUMN 1: REGISTRY DATA */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <UserCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry Data</span>
                    </div>

                    <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
                       <ComparisonField icon={<User size={14}/>} label="Registration Name" value={selectedUser.fullName || "None"} />
                       <ComparisonField icon={<Mail size={14}/>} label="Account Email" value={selectedUser.email} />
                       <ComparisonField icon={<Smartphone size={14}/>} label="Primary Phone" value={selectedUser.phone} />
                       <ComparisonField icon={<Globe size={14}/>} label="WhatsApp Contact" value={selectedUser.whatsappPhone} />
                       <ComparisonField icon={<Fingerprint size={14}/>} label="System Role" value={selectedUser.role} />
                       <ComparisonField icon={<Info size={14}/>} label="Gender" value={selectedUser.gender} />
                    </div>

                    <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                       <p className="text-[10px] text-indigo-300 font-bold leading-relaxed italic">
                         "Check if the name on the ID assets matches '<strong>{selectedUser.fullName}</strong>' exactly."
                       </p>
                    </div>
                  </div>

                  {/* COLUMN 2: ASSET INSPECTION */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <Eye size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Asset Inspection</span>
                    </div>

                    <div className="space-y-4">
                       <ImagePreview label="ID Front" url={selectedUser.idFrontImageUrl} />
                       <ImagePreview label="ID Back" url={selectedUser.idBackImageUrl} />
                       {selectedUser.passportImageUrl && (
                         <ImagePreview label="Passport" url={selectedUser.passportImageUrl} />
                       )}
                    </div>
                  </div>

                  {/* COLUMN 3: DECISION SUITE */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <Edit3 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decision Suite</span>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Briefcase size={12}/> Target Designation
                        </label>
                        <select 
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm font-black text-white focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="Caretaker">Caretaker Promotion</option>
                          <option value="Owner">Owner Promotion</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={12}/> Audit Remarks
                        </label>
                        <textarea 
                          rows={6}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-[2rem] flex items-start gap-3">
                         <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                         <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                           Rejection maintains <span className="text-white">Student</span> status. Approval grants <span className="text-white">{targetRole}</span> clearance.
                         </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WORKFLOW BAR */}
                <div className="mt-12 pt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex gap-4 w-full sm:w-auto ml-auto">
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleDecision("REJECTED")}
                      className="flex-1 sm:flex-none px-12 py-5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                    >
                      Reject Audit
                    </button>
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleDecision("APPROVED")}
                      className="flex-1 sm:flex-none px-12 py-5 rounded-2xl bg-white text-slate-950 hover:bg-indigo-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl disabled:opacity-50"
                    >
                      Verify & Promote
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[65vh] flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[4rem] text-center p-12">
                <ShieldAlert className="text-slate-800 mb-4" size={56} />
                <h2 className="text-xl font-black text-slate-500 uppercase italic">Awaiting Audit Selection</h2>
                <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-bold">Select a user to begin data comparison</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPERS ---

const ComparisonField = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="border-b border-slate-900 pb-4 last:border-0">
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
      <span className="text-indigo-500/50">{icon}</span> {label}
    </p>
    <p className="text-sm font-bold text-slate-200 truncate">{value || "N/A"}</p>
  </div>
);

const ImagePreview = ({ label, url }: any) => (
  <div className="space-y-2 group">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors">
        <ExternalLink size={14}/>
      </a>
    </div>
    <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 group-hover:border-indigo-500/30 transition-all">
      <img src={url} alt={label} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);

export default AdminVerificationPanel;