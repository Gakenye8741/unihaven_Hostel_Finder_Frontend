import React, { useState } from 'react';
import { 
  useClaimCaretakerMutation,
  useGetMyStaffQuery, 
} from '../../features/Apis/Users.Api';
import { 
  Users, Mail, Plus, Loader2, ShieldCheck, 
  Search, UserMinus, ExternalLink, Hash, 
  Activity, MoreVertical, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const StaffManagement: React.FC = () => {
  const [claimEmail, setClaimEmail] = useState('');
  
  // Queries & Mutations
  const { data: staffList, isLoading: isFetching, refetch } = useGetMyStaffQuery({});
  const [claimStaff, { isLoading: isClaiming }] = useClaimCaretakerMutation();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimEmail) return toast.error("Please enter a worker's email");

    try {
      await claimStaff({ email: claimEmail }).unwrap();
      toast.success("Worker node linked successfully");
      setClaimEmail('');
    } catch (err: any) {
      toast.error(err.data?.message || "Verification failed: User not found");
    }
  };

  if (isFetching) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="max-w-full min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- HEADER & CLAIM CONTROL --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              <Users className="text-indigo-500" size={32} /> 
              Staff <span className="text-indigo-500">Network</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">
              Authorized Caretaker Nodes: {staffList?.length || 0}
            </p>
          </div>

          <form onSubmit={handleClaim} className="flex items-center gap-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input 
                type="email"
                placeholder="Enter caretaker email..."
                value={claimEmail}
                onChange={(e) => setClaimEmail(e.target.value)}
                className="bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white focus:border-indigo-500/40 outline-none w-full sm:w-72 transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isClaiming}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all"
            >
              {isClaiming ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Link
            </button>
          </form>
        </div>

        {/* --- STAFF GRID --- */}
        {staffList?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((worker: any) => (
              <div key={worker.id} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                
                {/* Status Indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`h-2 w-2 rounded-full ${worker.accountStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-xl font-black text-indigo-400 group-hover:scale-110 transition-transform">
                    {worker.username.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight truncate max-w-[150px]">
                      {worker.fullName || worker.username}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium italic flex items-center gap-1">
                      <AtSign size={10} /> {worker.username}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                    <Mail size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-mono truncate">{worker.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[8px] font-black text-indigo-400 uppercase">
                         {worker.role || 'Caretaker'}
                       </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                      Since {new Date().getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex gap-2">
                  <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    <ExternalLink size={12} /> Profile
                  </button>
                  <button className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 text-rose-500 rounded-xl transition-colors">
                    <UserMinus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="py-20 flex flex-col items-center justify-center bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem]">
            <div className="p-6 bg-slate-900 rounded-full text-slate-700 mb-4">
               <Users size={48} />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest">No Staff Linked</h3>
            <p className="text-xs text-slate-500 mt-2">Enter an email above to authorize a new caretaker node.</p>
          </div>
        )}

        {/* --- SYSTEM LOG --- */}
        <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Access Control Protocol</p>
              <p className="text-[9px] text-slate-500 uppercase font-medium">All staff nodes are subject to UniHaven security audits.</p>
            </div>
          </div>
          <Activity size={20} className="text-indigo-500/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// Internal icon component for cleaner code
const AtSign = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
);

export default StaffManagement;