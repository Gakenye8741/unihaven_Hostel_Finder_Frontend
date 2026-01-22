import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetHostelGalleryQuery, 
  useUploadMediaMutation, 
  useUpdateMediaMutation, 
  useDeleteMediaMutation 
} from '../../features/Apis/Media.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Plus, Trash2, X, Loader2, Image as ImageIcon, Video, 
  Star, ExternalLink, Building2, UploadCloud, PlayCircle, 
  Camera, CheckCircle2, Zap, FileText, Globe, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerMediaManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const adminName = user?.username?.split(' ')[0] || 'Admin';
  const userId = user?.id || user?._id;

  // --- UI & UPLOAD STATE ---
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isCloudinaryLoading, setIsCloudinaryLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- API HOOKS ---
  const { data: allHostels } = useGetAllHostelsQuery({});
  
  // --- OWNER-ONLY FILTER ---
  const ownedHostels = useMemo(() => {
    if (!allHostels) return [];
    if (user?.role === 'SuperAdmin') return allHostels;
    return allHostels.filter((h: any) => h.owner === userId || h.ownerId === userId);
  }, [allHostels, userId, user?.role]);

  const { data: gallery, isLoading: isGalleryLoading } = useGetHostelGalleryQuery(selectedHostelId, { 
    skip: !selectedHostelId 
  });
  
  const [uploadMedia, { isLoading: isBackendRegistering }] = useUploadMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const verifyOwnership = () => ownedHostels.some((h: any) => h.id === selectedHostelId);

  const handleCreateMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!verifyOwnership()) return toast.error("Unauthorized infrastructure access.");
    if (!file || !selectedHostelId) return;

    const CLOUDINARY_UPLOAD_PRESET = "unihaven"; 
    const CLOUDINARY_CLOUD_NAME = "dc7dvxjkx";

    setIsCloudinaryLoading(true);
    setUploadProgress(10);
    const toastId = toast.loading("Uploading to Cloud Vault...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${file.type.includes('video') ? 'video' : 'image'}/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          await uploadMedia({
            hostelId: selectedHostelId,
            mediaItems: [{
              url: response.secure_url,
              type: file.type.includes('video') ? 'Video' : 'Image',
              isThumbnail: gallery?.length === 0
            }]
          }).unwrap();
          toast.success("Asset Vaulted Successfully", { id: toastId });
          setIsUploadPanelOpen(false);
          setUploadProgress(0);
        } else {
          toast.error("Upload rejected", { id: toastId });
        }
        setIsCloudinaryLoading(false);
      };
      xhr.send(formData);
    } catch (error) {
      toast.error("Process failed", { id: toastId });
      setIsCloudinaryLoading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput) return;
    if (!verifyOwnership()) return toast.error("Action Prohibited.");

    try {
      await uploadMedia({
        hostelId: selectedHostelId,
        mediaItems: [{ 
            url: urlInput, 
            type: urlInput.match(/\.(mp4|webm|ogg)$/i) ? 'Video' : 'Image', 
            isThumbnail: gallery?.length === 0 
        }]
      }).unwrap();
      toast.success("Remote asset synced");
      setUrlInput('');
      setIsUploadPanelOpen(false);
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-indigo-400/80">Asset Management System</p>
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Media<span className="text-indigo-500 font-light not-italic">Vault</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-2">Welcome back, <span className="text-slate-300">{adminName}</span>. Manage your property's visual identity.</p>
        </div>

        {/* --- ACTIONS BAR (New Column/Row) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-900/40 p-3 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="lg:col-span-8 relative group">
            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <select 
              value={selectedHostelId} 
              onChange={(e) => setSelectedHostelId(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-5 pl-16 pr-10 text-xs font-bold uppercase tracking-widest text-white appearance-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all cursor-pointer"
            >
              <option value="">{ownedHostels.length > 0 ? "Identify Property Infrastructure..." : "No Linked Properties Found"}</option>
              {ownedHostels?.map((h: any) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
               <Search size={18} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <button 
              onClick={() => setIsUploadPanelOpen(true)}
              disabled={!selectedHostelId}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 py-5 rounded-3xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-500/20"
            >
              <UploadCloud size={20} /> Ingest New Asset
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto">
        {!selectedHostelId ? (
          <EmptyState icon={<Camera size={60}/>} label="Selection Required: Access Property Vault" />
        ) : isGalleryLoading ? (
          <LoadingState />
        ) : gallery?.length === 0 ? (
          <EmptyState icon={<ImageIcon size={60}/>} label="Empty Vault: No Visuals Logged" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gallery?.map((item: any) => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onDelete={() => deleteMedia({ hostelId: selectedHostelId, mediaId: item.id })}
                onSetCover={() => updateMedia({ mediaId: item.id, hostelId: selectedHostelId, isThumbnail: true })}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- UPLOAD DRAWER --- */}
      {isUploadPanelOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" onClick={() => setIsUploadPanelOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0F172A] border-l border-white/5 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 border-b border-white/5 bg-slate-950/40 relative overflow-hidden">
               <Zap size={150} className="absolute -right-10 -bottom-10 text-indigo-500/[0.03] -rotate-12 pointer-events-none" />
               <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Ingest Asset</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Cloudinary Direct Uplink</p>
                </div>
                <button onClick={() => setIsUploadPanelOpen(false)} className="p-4 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-2xl transition-all border border-white/5"><X size={24} /></button>
              </div>
            </div>

            <div className="p-10 flex-1 space-y-12 overflow-y-auto no-scrollbar">
                <div className="space-y-6">
                    <SectionTitle icon={<UploadCloud size={16}/>} title="Direct Local Ingest" />
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-[3rem] bg-slate-950/50 hover:bg-indigo-500/[0.02] hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden shadow-inner">
                        {isCloudinaryLoading ? (
                            <div className="flex flex-col items-center gap-6 z-10">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{uploadProgress}%</span>
                                </div>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] animate-pulse">Streaming to Cloud...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-6 bg-indigo-500/10 rounded-full group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500"><UploadCloud size={32} className="text-indigo-500" /></div>
                                <div className="text-center">
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Drop Visuals Here</p>
                                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">High-Res JPG, PNG or MP4</p>
                                </div>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleCreateMedia} disabled={isCloudinaryLoading} />
                        <div className="absolute bottom-0 left-0 h-1.5 bg-indigo-600 transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
                    </label>
                </div>

                <div className="relative py-4 flex items-center justify-center">
                    <span className="bg-[#0F172A] px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] z-10">System Bypass</span>
                    <div className="absolute w-full border-t border-white/5"></div>
                </div>

                <div className="space-y-6">
                    <SectionTitle icon={<Globe size={16}/>} title="Remote Asset Proxy" />
                    <div className="relative group">
                        <ExternalLink size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="Direct URL (CDN, S3, Unsplash)"
                            className="w-full bg-slate-950/50 border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>
                    <button 
                        onClick={handleUrlUpload}
                        disabled={!urlInput || isBackendRegistering}
                        className="w-full py-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30 border border-white/5"
                    >
                        Register Remote Link
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- REFINED SUB-COMPONENTS ---
const MediaCard = ({ item, onDelete, onSetCover }: any) => (
  <div className="group relative bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden aspect-[4/5] hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
    {item.type === 'Video' ? (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
        <video src={item.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute p-5 bg-indigo-600/20 backdrop-blur-md rounded-full text-white group-hover:scale-125 transition-transform duration-500 border border-indigo-500/30">
           <PlayCircle size={32} />
        </div>
      </div>
    ) : (
      <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ease-out" />
    )}
    
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
    
    {item.isThumbnail && (
      <div className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-600 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-lg border border-indigo-400/30">
        <Star size={12} fill="currentColor" /> Main Cover
      </div>
    )}

    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
      <div className="flex gap-3">
        {!item.isThumbnail && (
          <button onClick={onSetCover} className="p-4 bg-white/10 hover:bg-indigo-600 backdrop-blur-md rounded-2xl transition-all border border-white/10 text-white"><Star size={16} /></button>
        )}
        <button onClick={onDelete} className="p-4 bg-rose-500/10 hover:bg-rose-600 backdrop-blur-md text-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20"><Trash2 size={16} /></button>
      </div>
      <div className="px-5 py-4 bg-black/40 backdrop-blur-md rounded-2xl text-[9px] font-black text-white tracking-[0.2em] uppercase border border-white/5">
        {item.type}
      </div>
    </div>
  </div>
);

const SectionTitle = ({ icon, title }: any) => (
    <div className="flex items-center gap-3 mb-2">
        <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">{icon}</span>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
    </div>
);

const EmptyState = ({ icon, label }: any) => (
    <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[4rem] bg-slate-950/30 shadow-inner">
        <div className="p-10 bg-slate-900/80 rounded-full mb-8 text-slate-700 shadow-2xl ring-1 ring-white/5">{icon}</div>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs text-center px-6">{label}</p>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-32">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500/50" size={20} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Decrypting Vault Contents...</p>
    </div>
);

export default OwnerMediaManager;