import React, { useState } from 'react';
import { 
  useGetAllUsersQuery, 
  useAdminUpdateUserMutation,
  useVerifyUserIdentityMutation,
  useUpdateAccountStatusMutation,
  useGetSystemUserStatsQuery,
  useDeleteUserMutation 
} from '../../features/Apis/Users.Api'; 
import { 
  User, Loader2, X, UserX, UserCog, Search, ExternalLink, 
  ShieldAlert, ShieldCheck, Ban, AlertCircle, Clock, Trash2,
  Activity, Image as ImageIcon, FileWarning, AtSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManager: React.FC = () => {
  // --- API HOOKS (Using your provided API) ---
  const { data: users, isLoading, isError } = useGetAllUsersQuery({});
  const { data: stats } = useGetSystemUserStatsQuery({});
  const [adminUpdateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();
  const [verifyIdentity, { isLoading: isVerifying }] = useVerifyUserIdentityMutation();
  const [updateAccountStatus, { isLoading: isStatusChanging }] = useUpdateAccountStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // --- UI STATE ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'verify' | 'security'>('edit');
  const [searchTerm, setSearchTerm] = useState('');

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    username: '', fullName: '', phone: '', whatsappPhone: '',
    gender: 'male', bio: '', idNumber: '', visibility: 'PUBLIC'
  });

  const [verifyData, setVerifyData] = useState({
    status: 'APPROVED' as 'APPROVED' | 'REJECTED',
    targetRole: 'Owner',
    remarks: ''
  });

  // --- HANDLERS ---
  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      fullName: user.fullName || '',
      phone: user.phone || '',
      whatsappPhone: user.whatsappPhone || '',
      gender: user.gender || 'male',
      bio: user.bio || '',
      idNumber: user.idNumber || '',
      visibility: user.visibility || 'PUBLIC'
    });
    setVerifyData({ 
      status: 'APPROVED',
      targetRole: user.role === 'Student' ? 'Owner' : user.role,
      remarks: user.verificationRemarks || ''
    });
    setActiveTab('edit');
    setIsPanelOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    const targetId = selectedUser?.id || selectedUser?._id;
    if (!targetId) return toast.error("IDENTITY ERROR: Invalid Node Reference");
    
    try {
      await updateAccountStatus({ userId: targetId, status: newStatus }).unwrap();
      toast.success(`Protocol Updated: Identity is now ${newStatus}`);
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Internal Protocol Error");
    }
  };

  const handleDeleteUser = async () => {
    const targetId = selectedUser?.id || selectedUser?._id;
    if (!targetId) return;
    try {
      await deleteUser(targetId).unwrap();
      toast.success("Identity successfully purged from system");
      setIsDeleteModalOpen(false);
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Purge Protocol Failed");
    }
  };

  const handleSyncUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminUpdateUser({ id: selectedUser.id || selectedUser._id, ...formData }).unwrap();
      toast.success("Profile Identity Synchronized");
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Internal Sync Error");
    }
  };

  const handleVerifyPromotion = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await verifyIdentity({ 
        id: selectedUser.id || selectedUser._id, 
        status: status,
        targetRole: verifyData.targetRole,
        remarks: verifyData.remarks 
      }).unwrap();
      toast.success(status === 'APPROVED' ? `Node promoted to ${verifyData.targetRole}` : "Identity Rejected");
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Protocol Refused");
    }
  };

  // Filter users based on your list
  const filteredUsers = users?.filter((u: any) => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IdentityCard = ({ label, url }: { label: string, url: string | null }) => (
    <div className="space-y-2">
      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{label}</p>
      {url ? (
        <div className="relative group aspect-video rounded-2xl overflow-hidden border border-white/5 bg-slate-950">
          <img src={url} alt={label} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600/20 backdrop-blur-sm">
            <a href={url} target="_blank" rel="noreferrer" className="p-3 bg-white text-black rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded-2xl border border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-2">
          <FileWarning className="text-slate-800" size={24} />
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Null Data Node</span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 animate-pulse">Scanning Matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 md:p-6 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* STATS OVERVIEW (Using your Stats endpoint) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats?.map((stat: any, index: number) => (
            <div key={index} className="bg-[#0F172A] border border-slate-800 p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{stat.role}s</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white italic tracking-tighter">{stat.count}</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Nodes Active</span>
              </div>
            </div>
          ))}
        </div>

        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase leading-none">
              User<span className="text-indigo-500 font-light not-italic">Matrix</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-bold flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Identity Management
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={14} />
            <input 
               type="text" 
               placeholder="Search by name, email or handle..." 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)} 
               className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none focus:border-indigo-500/50 transition-all text-white" 
            />
          </div>
        </header>

        {/* --- MAIN USER TABLE --- */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Node Role</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">System Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredUsers?.map((u: any) => (
                  <tr key={u.id || u._id} className="hover:bg-indigo-500/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                          <User className="text-slate-600 group-hover:text-indigo-400 transition-all" size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase italic tracking-tighter">{u.username}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
                        u.role === 'Admin' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                        u.role === 'Owner' ? 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' : 
                        'text-slate-400 border-slate-700 bg-slate-800/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          u.accountStatus === 'ACTIVE' ? 'bg-emerald-500' : 
                          u.accountStatus === 'SUSPENDED' ? 'bg-amber-500' : 
                          u.accountStatus === 'DEACTIVATED' ? 'bg-slate-500' :
                          'bg-rose-500 animate-pulse'
                        }`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          u.accountStatus === 'ACTIVE' ? 'text-emerald-500' : 
                          u.accountStatus === 'SUSPENDED' ? 'text-amber-500' : 
                          u.accountStatus === 'DEACTIVATED' ? 'text-slate-500' :
                          'text-rose-500'
                        }`}>
                          {u.accountStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleOpenEdit(u)} 
                        className="p-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:text-white text-slate-500 rounded-xl transition-all"
                      >
                        <UserCog size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- SIDE PANEL (EDIT/VERIFY/SECURITY) --- */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsPanelOpen(false)} />
          <div className="relative w-full md:max-w-md bg-[#0F172A] border-l border-white/5 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-white/5 bg-slate-950/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1 block">Reference: {(selectedUser?.id || selectedUser?._id)?.slice(-12)}</span>
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tighter truncate">{selectedUser?.username}</h2>
                </div>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-lg transition-all"><X size={18} /></button>
              </div>

              <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
                {(['edit', 'verify', 'security'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${
                      activeTab === tab 
                        ? (tab === 'security' ? 'bg-rose-600 text-white' : tab === 'verify' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white') 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {activeTab === 'edit' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Handle</label>
                      <input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:border-indigo-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Gender</label>
                      <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Legal Name</label>
                    <input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone</label>
                      <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">ID Number</label>
                      <input value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Biography</label>
                    <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:border-indigo-500 transition-all outline-none resize-none" />
                  </div>
                </div>
              )}

              {activeTab === 'verify' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-emerald-500" size={14} />
                      <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Verification Node Assets</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <IdentityCard label="National ID / Front" url={selectedUser?.idFrontImageUrl} />
                      <IdentityCard label="National ID / Back" url={selectedUser?.idBackImageUrl} />
                      <IdentityCard label="Passport Document" url={selectedUser?.passportImageUrl} />
                    </div>
                  </div>

                  <hr className="border-white/5" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Promote To</label>
                      <select value={verifyData.targetRole} onChange={(e) => setVerifyData({...verifyData, targetRole: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 px-4 text-xs text-white outline-none focus:border-emerald-500 transition-all">
                        <option value="Owner">Owner</option>
                        <option value="Caretaker">Caretaker</option>
                        <option value="Admin">Admin</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Review Remarks</label>
                      <textarea value={verifyData.remarks} onChange={(e) => setVerifyData({...verifyData, remarks: e.target.value})} placeholder="Log review observations..." className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 px-4 text-xs text-white focus:border-emerald-500 outline-none h-32 resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-8 bg-slate-950 border border-white/5 rounded-[2.5rem] text-center space-y-4">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border transition-colors ${
                      selectedUser?.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      selectedUser?.accountStatus === 'SUSPENDED' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      <ShieldAlert size={40} />
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase text-lg tracking-tighter italic">Security Protocol</h3>
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Current State: {selectedUser?.accountStatus}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {['ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'BANNED'].map((status) => (
                      <button 
                        key={status}
                        disabled={isStatusChanging || selectedUser?.accountStatus === status} 
                        onClick={() => handleStatusUpdate(status)}
                        className="w-full p-5 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between group transition-all"
                      >
                         <div className="flex items-center gap-4 text-left">
                          <div className={`p-2.5 rounded-xl ${status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {status === 'ACTIVE' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                          </div>
                          <p className="text-[10px] font-black text-white uppercase">{status}</p>
                        </div>
                        {isStatusChanging ? <Loader2 className="animate-spin" size={14} /> : null}
                      </button>
                    ))}

                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="w-full p-5 bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 rounded-2xl flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-4 text-left text-rose-500">
                        <Trash2 size={18} />
                        <p className="text-[10px] font-black uppercase">Hard Delete Node</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-slate-950/40">
              {activeTab === 'edit' && (
                <button disabled={isUpdating} onClick={handleSyncUpdate} className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20">
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : null} Save Identity
                </button>
              )}
              {activeTab === 'verify' && (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleVerifyPromotion('REJECTED')} className="py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase">Reject</button>
                  <button onClick={() => handleVerifyPromotion('APPROVED')} className="py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase">Approve</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative max-w-sm w-full bg-[#0F172A] border border-rose-500/20 rounded-[2.5rem] p-8 text-center space-y-6">
            <AlertCircle size={40} className="text-rose-500 mx-auto animate-pulse" />
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Purge Protocol</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
              Permanent removal of <span className="text-rose-500">@{selectedUser?.username}</span> from the system. This cannot be undone.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button disabled={isDeleting} onClick={handleDeleteUser} className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase">
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Confirm Deletion"}
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-slate-900 text-slate-500 rounded-2xl text-[10px] font-black uppercase">Abort Mission</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;