import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Switched from local state to Redux
import { 
  useGetAllHostelsQuery, 
  useCreateHostelMutation, 
  useUpdateHostelMutation, 
  useDeleteHostelMutation 
} from '../../features/Apis/Hostel.Api';
import { 
  Plus, Edit, Trash2, Search, X, Loader2, 
  ShieldAlert, Building2, MapPin, 
  ShieldCheck, Globe, Info, ChevronLeft, ChevronRight, 
  Users, School, LayoutGrid, Terminal, CheckCircle2,
  FileText, Zap, ShieldQuestion
} from 'lucide-react';
import toast from 'react-hot-toast';

const HostelManager: React.FC = () => {
  // --- REDUX STATE ---
  // Accessing username from your auth slice
  const { user } = useSelector((state: any) => state.auth); 
  const adminFirstName = user?.username ? user.username.split(' ')[0] : 'Admin';

  // --- API HOOKS ---
  const { data: hostels, isLoading } = useGetAllHostelsQuery({});
  const [createHostel, { isLoading: isCreating }] = useCreateHostelMutation();
  const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();
  const [deleteHostel] = useDeleteHostelMutation();

  // --- UI STATE ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- FILTER & PAGINATION STATE ---
  const [policyFilter, setPolicyFilter] = useState('All');
  const [verifyFilter, setVerifyFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    campus: '',
    address: '',
    description: '',
    policy: 'Mixed'
  });

  // --- HANDLERS ---
  const handleOpenPanel = (hostel: any = null) => {
    if (hostel) {
      setEditingId(hostel.id);
      setFormData({
        name: hostel.name, campus: hostel.campus,
        address: hostel.address, description: hostel.description || '',
        policy: hostel.policy
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', campus: '', address: '', description: '', policy: 'Mixed' });
    }
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateHostel({ id: editingId, ...formData }).unwrap();
        toast.success("Hostel updated successfully");
      } else {
        await createHostel(formData).unwrap();
        toast.success("New hostel registered");
      }
      setIsPanelOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Operation failed");
    }
  };

  const handleToggleVerification = async (hostel: any) => {
    try {
      await updateHostel({ id: `verify/${hostel.id}`, status: !hostel.isVerified }).unwrap();
      toast.success(`Verification ${!hostel.isVerified ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error("Admin privileges required");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this hostel? This action is permanent.")) {
      try {
        await deleteHostel(id).unwrap();
        toast.success("Hostel deleted");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // --- FILTERING LOGIC ---
  const filteredHostels = hostels?.filter((h: any) => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         h.campus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPolicy = policyFilter === 'All' || h.policy === policyFilter;
    const matchesVerify = verifyFilter === 'All' || 
                         (verifyFilter === 'Verified' ? h.isVerified : !h.isVerified);
    return matchesSearch && matchesPolicy && matchesVerify;
  });

  const totalPages = Math.ceil((filteredHostels?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHostels = filteredHostels?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-6 selection:bg-indigo-500/30">
      
      {/* GREETING & HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800/50 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Control Protocol / {adminFirstName}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Hostel<span className="text-indigo-500 font-light not-italic">Vault</span>
            </h1>
            <p className="text-xs text-slate-500 mt-4 max-w-2xl leading-relaxed">
              Welcome to the central management hub. This interface provides <span className="text-slate-200">administrative oversight</span> for the entire property network. You can register new facilities, audit location data, and <span className="text-indigo-400">verify security compliance</span> across all partner campuses.
            </p>
          </div>
          <button 
            onClick={() => handleOpenPanel()}
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> Register Property
          </button>
        </div>

        {/* SYSTEM OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-slate-800/60 transition-all hover:bg-[#0F172A]/60">
            <Terminal size={18} className="text-indigo-500 mb-3" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Audit Control</h3>
            <p className="text-[10px] text-slate-500 leading-normal">Deep-edit property metadata, GPS mapping, and contact info.</p>
          </div>
          <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-slate-800/60 transition-all hover:bg-[#0F172A]/60">
            <ShieldCheck size={18} className="text-emerald-500 mb-3" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Verify Engine</h3>
            <p className="text-[10px] text-slate-500 leading-normal">Toggle trust badges for properties passing official safety inspections.</p>
          </div>
          <div className="bg-[#0F172A]/40 p-5 rounded-2xl border border-slate-800/60 transition-all hover:bg-[#0F172A]/60">
            <LayoutGrid size={18} className="text-pink-500 mb-3" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Policy Sync</h3>
            <p className="text-[10px] text-slate-500 leading-normal">Manage gender segregation and facility-specific house rules.</p>
          </div>
        </div>

        {/* FILTERS BAR */}
        <div className="mt-8 flex flex-wrap items-center gap-3 bg-slate-900/20 p-2 rounded-xl border border-slate-800/40">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input 
              type="text" 
              placeholder="Search by name or campus..." 
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-[11px] focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5">
            <Users size={12} className="text-indigo-500" />
            <select value={policyFilter} onChange={(e) => setPolicyFilter(e.target.value)} className="bg-transparent text-[10px] font-black uppercase text-slate-400 outline-none cursor-pointer">
              <option value="All">All Policies</option>
              <option value="Mixed">Mixed</option>
              <option value="Male Only">Male Only</option>
              <option value="Female Only">Female Only</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5">
            <ShieldCheck size={12} className="text-indigo-500" />
            <select value={verifyFilter} onChange={(e) => setVerifyFilter(e.target.value)} className="bg-transparent text-[10px] font-black uppercase text-slate-400 outline-none cursor-pointer">
              <option value="All">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto bg-[#0F172A] border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/50">
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Property Identity</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Status</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i} className="animate-pulse h-16 bg-slate-900/10"></tr>)
              ) : paginatedHostels?.map((hostel: any) => (
                <tr key={hostel.id} className="hover:bg-indigo-500/[0.03] transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-center">
                        <Building2 className="text-indigo-400" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">{hostel.name}</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-indigo-500" /> {hostel.campus} — {hostel.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={() => handleToggleVerification(hostel)}
                      className={`mx-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase transition-all ${
                        hostel.isVerified ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-800/40 border-slate-700 text-slate-500 hover:border-indigo-500/50"
                      }`}
                    >
                      {hostel.isVerified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      {hostel.isVerified ? 'Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenPanel(hostel)} className="p-2.5 bg-slate-800/50 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(hostel.id)} className="p-2.5 bg-slate-800/50 hover:bg-rose-600 text-white rounded-xl transition-all shadow-md">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-slate-900/50 px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-800">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Showing <span className="text-white">{startIndex + 1}</span> - <span className="text-white">{Math.min(startIndex + itemsPerPage, filteredHostels?.length || 0)}</span> of {filteredHostels?.length}
          </p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 hover:bg-indigo-600 hover:text-white transition-all">
              <ChevronLeft size={16} />
            </button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="p-2 rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 hover:bg-indigo-600 hover:text-white transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* REDESIGNED DATA ENTRY PANEL */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setIsPanelOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-[#0F172A] border-l border-white/5 h-full shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-500">
            
            {/* Panel Header */}
            <div className="p-8 border-b border-white/5 bg-slate-950/40 relative overflow-hidden">
               <Building2 size={120} className="absolute -right-8 -bottom-8 text-white/[0.02] -rotate-12 pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 bg-indigo-500/20 rounded text-indigo-400"><Zap size={12} /></span>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500">Inventory Module</span>
                  </div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {editingId ? 'Modify Record' : 'Add Property'}
                  </h2>
                </div>
                <button onClick={() => setIsPanelOpen(false)} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Panel Form Body */}
            <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-8 no-scrollbar">
              
              {/* Group 1: Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-indigo-500 pl-3">
                  <FileText size={14} className="text-slate-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Identity Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Official Name</label>
                    <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Hostel Branding" className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Assigned Campus</label>
                    <input required value={formData.campus} onChange={(e) => setFormData({...formData, campus: e.target.value})} placeholder="Primary Campus Location" className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* Group 2: Geography & Policy */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-emerald-500 pl-3">
                  <MapPin size={14} className="text-slate-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Logistics & Policy</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Street Address</label>
                    <input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Exact Location" className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Gender Policy</label>
                    <select value={formData.policy} onChange={(e) => setFormData({...formData, policy: e.target.value})} className="w-full bg-slate-900/60 border border-white/5 rounded-xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none cursor-pointer">
                      <option value="Mixed">Mixed Housing</option>
                      <option value="Female Only">Female Only</option>
                      <option value="Male Only">Male Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Group 3: Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-pink-500 pl-3">
                  <Info size={14} className="text-slate-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Marketing & Info</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Description</label>
                  <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe amenities, Wi-Fi speed, or water availability..." className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 px-5 text-xs focus:border-indigo-500/50 outline-none transition-all resize-none" />
                </div>
              </div>

              {/* Guidance Note */}
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3 items-start">
                 <ShieldQuestion size={18} className="text-indigo-400 mt-0.5" />
                 <div>
                    <p className="text-[10px] font-bold text-indigo-200 uppercase">Pro Tip</p>
                    <p className="text-[9px] text-indigo-300/60 mt-1">Verification badges must be toggled manually after the hostel record is published to ensure safety audits have been completed.</p>
                 </div>
              </div>
            </form>

            {/* Panel Footer */}
            <div className="p-8 border-t border-white/5 bg-slate-950/40 flex gap-4">
              <button type="button" onClick={() => setIsPanelOpen(false)} className="flex-1 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                Discard Changes
              </button>
              <button onClick={handleSubmit} disabled={isCreating || isUpdating} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                {isCreating || isUpdating ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {editingId ? 'Push Update' : 'Execute Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelManager;