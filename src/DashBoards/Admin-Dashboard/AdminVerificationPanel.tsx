import React, { useState } from 'react';
import { 
  useGetPendingVerificationsQuery, 
  useVerifyUserIdentityMutation 
} from '../../features/Apis/Users.Api';
import { 
  ShieldCheck, Eye, CheckCircle, XCircle, Loader2, 
  User, Fingerprint, Mail, ShieldAlert, Info, Edit3, Briefcase,
  MessageSquare, AlertTriangle, ExternalLink,
  History, Phone, Globe, Smartphone, UserCircle, Menu, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '../../Components/Navbar';

const AdminVerificationPanel: React.FC = () => {
  const { data: pendingUsers, isLoading } = useGetPendingVerificationsQuery({});
  const [verifyUser, { isLoading: isProcessing }] = useVerifyUserIdentityMutation();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [remarks, setRemarks] = useState("Documents verified against national database.");
  const [targetRole, setTargetRole] = useState("Caretaker");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedUser) return;

    const payload = {
      id: selectedUser.id,
      status: status,
      targetRole: targetRole,
      remarks: remarks 
    };

    const toastId = toast.loading(`Processing ${status} status...`);
    
    try {
      const response = await verifyUser(payload).unwrap();
      toast.success(response.message || `Status updated to ${status} ✅`, { id: toastId });
      setSelectedUser(null);
      setRemarks("Documents verified against national database.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Internal Audit Failure", { id: toastId });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      <Navbar />
      
      <div className="max-w-[1800px] mx-auto pt-24 md:pt-32 pb-12 px-4 md:px-12">
        {/* TOP STATUS BAR */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              Identity <span className="text-indigo-500">Audit</span>
            </h1>
            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">Biometric & Registry Comparison Suite</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/40 p-4 md:p-6 rounded-3xl border border-slate-800">
             <div className="text-right hidden md:block">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Queue</p>
               <p className="text-xl font-black text-white italic">{pendingUsers?.length || 0} Pending</p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                <ShieldCheck size={20} />
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
          {/* QUEUE SIDEBAR - Responsive Toggle for Mobile */}
          <div className={`${selectedUser ? 'hidden lg:block' : 'block'} lg:col-span-3 space-y-4`}>
            <div className="flex items-center justify-between px-2 mb-4">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Queue</p>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
              {pendingUsers?.map((user: any) => (
                <button 
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-5 rounded-[2rem] border transition-all duration-300 ${
                    selectedUser?.id === user.id 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-indigo-400">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="font-black text-white text-xs uppercase italic truncate">{user.username}</p>
                      <p className="text-[9px] text-slate-500 tracking-widest truncate">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN COMPARISON WORKSPACE */}
          <div className={`${!selectedUser ? 'hidden lg:block' : 'block'} lg:col-span-9`}>
            {selectedUser ? (
              <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] overflow-hidden flex flex-col">
                {/* MOBILE BACK BUTTON */}
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="lg:hidden m-6 flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400"
                >
                  <X size={16}/> Close Audit
                </button>

                <div className="grid xl:grid-cols-2">
                  {/* LEFT: REGISTRY & DOCUMENTS (Comparison Core) */}
                  <div className="p-6 md:p-10 border-b xl:border-b-0 xl:border-r border-slate-800 space-y-8">
                    <div>
                      <SectionTitle icon={<UserCircle size={16}/>} text="Registry Comparison" />
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DataCard label="Full Legal Name" value={selectedUser.fullName} highlight />
                        <DataCard label="Account Email" value={selectedUser.email} />
                        <DataCard label="Primary Phone" value={selectedUser.phone} />
                        <DataCard label="WhatsApp" value={selectedUser.whatsappPhone} />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <SectionTitle icon={<Eye size={16}/>} text="Document Inspection" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ComparisonImage label="ID Front" url={selectedUser.idFrontImageUrl} />
                        <ComparisonImage label="ID Back" url={selectedUser.idBackImageUrl} />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: DECISION & REMARKS */}
                  <div className="p-6 md:p-10 bg-slate-950/30 space-y-8 flex flex-col">
                    <SectionTitle icon={<Edit3 size={16}/>} text="Audit Decision" />
                    
                    <div className="space-y-6 flex-grow">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Promotion Designation</label>
                        <select 
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm font-black text-white focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Caretaker">Promote to Caretaker</option>
                          <option value="Owner">Promote to Owner</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Remarks</label>
                        <textarea 
                          rows={6}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none resize-none"
                          placeholder="Add manual verification notes here..."
                        />
                      </div>

                      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex gap-4">
                        <AlertTriangle className="text-indigo-400 shrink-0" size={20} />
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">
                          The system will update <span className="text-white">{selectedUser.username}</span> to the status of <span className="text-white">APPROVED</span> or <span className="text-rose-500">REJECTED</span> based on your selection.
                        </p>
                      </div>
                    </div>

                    {/* ACTION PANEL */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleDecision("REJECTED")}
                        className="flex-1 px-8 py-5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        Reject Submission
                      </button>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleDecision("APPROVED")}
                        className="flex-1 px-8 py-5 rounded-2xl bg-white text-slate-950 hover:bg-indigo-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl"
                      >
                        Approve & Promote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[4rem] text-center p-12 bg-slate-900/10">
                <ShieldAlert className="text-slate-800 mb-4" size={56} />
                <h2 className="text-xl font-black text-slate-600 uppercase italic">Awaiting Selection</h2>
                <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Choose a user from the queue to start comparison</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT HELPERS ---

const SectionTitle = ({ icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-3 text-indigo-400">
    <div className="p-2 bg-indigo-500/10 rounded-lg">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{text}</span>
  </div>
);

const DataCard = ({ label, value, highlight }: any) => (
  <div className={`p-5 rounded-2xl border ${highlight ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-slate-950 border-slate-800'}`}>
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-sm font-bold truncate ${highlight ? 'text-indigo-400' : 'text-slate-200'}`}>{value || "---"}</p>
  </div>
);

const ComparisonImage = ({ label, url }: any) => (
  <div className="space-y-3 group">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-indigo-400"><ExternalLink size={14}/></a>
    </div>
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <img src={url} alt={label} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);

export default AdminVerificationPanel;