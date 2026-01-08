import React, { useState, useRef } from 'react';
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
  Camera, CheckCircle2, Zap, FileText, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const MediaManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const adminName = user?.username?.split(' ')[0] || 'Admin';

  // --- UI & UPLOAD STATE ---
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isCloudinaryLoading, setIsCloudinaryLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- API HOOKS ---
  const { data: hostels } = useGetAllHostelsQuery({});
  const { data: gallery, isLoading: isGalleryLoading } = useGetHostelGalleryQuery(selectedHostelId, { skip: !selectedHostelId });
  
  const [uploadMedia, { isLoading: isBackendRegistering }] = useUploadMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  // --- CLOUDINARY LOGIC ---
  const handleCreateMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedHostelId) return;

    // Configuration - Move these to .env later
    const CLOUDINARY_UPLOAD_PRESET = "unihaven"; 
    const CLOUDINARY_CLOUD_NAME = "dc7dvxjkx";


    setIsCloudinaryLoading(true);
    setUploadProgress(10);
    const toastId = toast.loading("Syncing with Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // XHR for progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${file.type.includes('video') ? 'video' : 'image'}/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // Register with your Backend
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
          toast.error("Cloudinary rejection", { id: toastId });
        }
        setIsCloudinaryLoading(false);
      };

      xhr.send(formData);

    } catch (error) {
      toast.error("Upload process failed", { id: toastId });
      setIsCloudinaryLoading(false);
    }
  };

  // --- REMOTE URL HANDLER ---
  const handleUrlUpload = async () => {
    if (!urlInput) return;
    try {
      await uploadMedia({
        hostelId: selectedHostelId,
        mediaItems: [{ 
            url: urlInput, 
            type: urlInput.match(/\.(mp4|webm|ogg)$/i) ? 'Video' : 'Image', 
            isThumbnail: gallery?.length === 0 
        }]
      }).unwrap();
      toast.success("Remote link registered");
      setUrlInput('');
      setIsUploadPanelOpen(false);
    } catch (err) {
      toast.error("Link registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-6">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Visual Control / {adminName}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Media<span className="text-indigo-500 font-light not-italic">Vault</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
              <select 
                value={selectedHostelId} 
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-[11px] font-bold uppercase tracking-widest text-white appearance-none focus:border-indigo-500 outline-none min-w-[280px]"
              >
                <option value="">Select Hostel Infrastructure</option>
                {hostels?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <button 
              onClick={() => setIsUploadPanelOpen(true)}
              disabled={!selectedHostelId}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 shadow-2xl shadow-indigo-500/20"
            >
              <UploadCloud size={18} /> Add Asset
            </button>
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="max-w-7xl mx-auto">
        {!selectedHostelId ? (
          <EmptyState icon={<Camera size={48}/>} label="Awaiting Infrastructure Selection" />
        ) : isGalleryLoading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* UPLOAD PANEL */}
      {isUploadPanelOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsUploadPanelOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0F172A] border-l border-white/5 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-8 border-b border-white/5 bg-slate-950/40 relative overflow-hidden">
               <Zap size={120} className="absolute -right-8 -bottom-8 text-white/[0.02] -rotate-12 pointer-events-none" />
               <div className="flex items-center justify-between relative z-10">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Ingest Asset</h2>
                <button onClick={() => setIsUploadPanelOpen(false)} className="p-3 bg-white/5 hover:bg-rose-500/20 rounded-2xl transition-all"><X size={20} /></button>
              </div>
            </div>

            <div className="p-8 flex-1 space-y-10 overflow-y-auto no-scrollbar">
                {/* LOCAL UPLOAD SECTION */}
                <div className="space-y-4">
                    <SectionTitle icon={<UploadCloud size={14}/>} title="Cloudinary Direct Ingest" />
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/40 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all cursor-pointer group relative overflow-hidden">
                        {isCloudinaryLoading ? (
                            <div className="flex flex-col items-center gap-4 z-10">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{uploadProgress}%</span>
                                </div>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Streaming to Cloud...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform"><UploadCloud size={24} className="text-indigo-500" /></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Image or Video</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleCreateMedia} disabled={isCloudinaryLoading} />
                        
                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </label>
                </div>

                <div className="relative py-2 flex items-center justify-center">
                    <span className="bg-[#0F172A] px-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] z-10">OR</span>
                    <div className="absolute w-full border-t border-white/5"></div>
                </div>

                {/* REMOTE URL SECTION */}
                <div className="space-y-4">
                    <SectionTitle icon={<Globe size={14}/>} title="Remote Asset Proxy" />
                    <div className="relative">
                        <ExternalLink size={16} className="absolute left-5 top-5 text-indigo-500" />
                        <input 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="Paste direct URL (CDN / S3 / Unsplash)"
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleUrlUpload}
                        disabled={!urlInput || isBackendRegistering}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                    >
                        Register Link
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MediaCard = ({ item, onDelete, onSetCover }: any) => (
  <div className="group relative bg-[#0F172A] border border-white/5 rounded-[2rem] overflow-hidden aspect-[4/5] hover:border-indigo-500/40 transition-all">
    {item.type === 'Video' ? (
      <div className="w-full h-full bg-black flex items-center justify-center relative">
        <video src={item.url} className="w-full h-full object-cover opacity-50" />
        <PlayCircle size={48} className="absolute text-white/40 group-hover:text-indigo-500 transition-all group-hover:scale-110" />
      </div>
    ) : (
      <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
    )}
    
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
    
    {item.isThumbnail && (
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-indigo-600 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-full">
        <Star size={10} fill="currentColor" /> Main Cover
      </div>
    )}

    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
      <div className="flex gap-2">
        {!item.isThumbnail && (
          <button onClick={onSetCover} className="p-3 bg-white/10 hover:bg-indigo-500 backdrop-blur-md rounded-xl transition-all"><Star size={14} /></button>
        )}
        <button onClick={onDelete} className="p-3 bg-rose-500/20 hover:bg-rose-500 backdrop-blur-md text-rose-500 hover:text-white rounded-xl transition-all"><Trash2 size={14} /></button>
      </div>
      <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl text-[10px] font-bold text-white tracking-widest uppercase">
        {item.type}
      </div>
    </div>
  </div>
);

const SectionTitle = ({ icon, title }: any) => (
    <div className="flex items-center gap-2 mb-2">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
    </div>
);

const EmptyState = ({ icon, label }: any) => (
    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-950/20">
        <div className="p-6 bg-slate-900/50 rounded-full mb-6 text-slate-700">{icon}</div>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">{label}</p>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Retrieving Matrix Assets...</p>
    </div>
);

export default MediaManager;