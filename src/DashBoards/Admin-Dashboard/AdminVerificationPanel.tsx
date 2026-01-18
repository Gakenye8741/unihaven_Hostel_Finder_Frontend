import React, { useState } from 'react';
import { 
  useGetPendingVerificationsQuery, 
  useVerifyUserIdentityMutation 
} from '../../features/Apis/Users.Api';
import { 
  ShieldCheck, Eye, CheckCircle, XCircle, Loader2, 
  User, Fingerprint, Mail, ShieldAlert, Info, Edit3, Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '../../Components/Navbar';

const AdminVerificationPanel: React.FC = () => {
  const { data: pendingUsers, isLoading } = useGetPendingVerificationsQuery({});
  const [verifyUser, { isLoading: isProcessing }] = useVerifyUserIdentityMutation();
  
  // Local state for the decision form
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [remarks, setRemarks] = useState("Documents verified against national database.");
  const [targetRole, setTargetRole] = useState("Caretaker");

  const handleAction = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
    const toastId = toast.loading(`Submitting ${status} decision...`);
    try {
      // Matches your new PATCH structure
      await verifyUser({ 
        id: userId, 
        status: status,
        targetRole: status === 'APPROVED' ? targetRole : undefined,
        remarks: remarks 
      }).unwrap();
      
      toast.success(`User ${status.toLowerCase()} successfully`, { id: toastId });
      setSelectedUser(null);
      setRemarks("Documents verified against national database."); // Reset
    } catch (err: any) {
      toast.error(err?.data?.message || "Process failed", { id: toastId });
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
      <div className="max-w-[1600px] mx-auto py-32 px-6">
        
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Governance <span className="text-indigo-500">Audit Hub</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* QUEUE SIDEBAR */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Pending Review</p>
            {pendingUsers?.map((user: any) => (
              <button 
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-6 rounded-[2rem] border transition-all ${
                  selectedUser?.id === user.id 
                  ? 'bg-indigo-600/10 border-indigo-500' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-indigo-400">
                    {user.username.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase">{user.username}</h3>
                    <p className="text-[10px] text-slate-500 tracking-widest">{user.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* MAIN AUDIT INTERFACE */}
          <div className="lg:col-span-8">
            {selectedUser ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10">
                <div className="grid md:grid-cols-2 gap-12 mb-10">
                  {/* LEFT: INFO & VERIFICATION DATA */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <Info size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Assets</span>
                    </div>
                    <ImagePreview label="National ID Front" url={selectedUser.idFrontImageUrl} />
                    <ImagePreview label="National ID Back" url={selectedUser.idBackImageUrl} />
                  </div>

                  {/* RIGHT: DECISION FORM */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <Edit3 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Audit Decision</span>
                    </div>

                    {/* ROLE PROMOTION SECTOR */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={12}/> Target Designation
                      </label>
                      <select 
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-white focus:border-indigo-500 focus:outline-none appearance-none"
                      >
                        <option value="Caretaker">Caretaker</option>
                        <option value="Owner">Owner</option>
                        <option value="Manager">Manager</option>
                      </select>
                    </div>

                    {/* REMARKS FIELD */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Decision Remarks</label>
                      <textarea 
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                        placeholder="Provide reason for approval or rejection..."
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION FOOTER */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="text-slate-500 space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <User size={12}/> Auditing: {selectedUser.username}
                     </p>
                   </div>
                   
                   <div className="flex gap-4 w-full md:w-auto">
                     <button 
                       disabled={isProcessing}
                       onClick={() => handleAction(selectedUser.id, 'REJECTED')}
                       className="flex-1 px-8 py-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                     >
                       Reject
                     </button>
                     <button 
                       disabled={isProcessing}
                       onClick={() => handleAction(selectedUser.id, 'APPROVED')}
                       className="flex-1 px-8 py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                     >
                       Approve & Promote
                     </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[4rem] text-center">
                <ShieldAlert className="text-slate-800 mb-4" size={48} />
                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Select a user to begin audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImagePreview = ({ label, url }: any) => (
  <div className="space-y-2 group">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:underline">Full View</a>
    </div>
    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
      <img src={url} alt={label} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  </div>
);

export default AdminVerificationPanel;