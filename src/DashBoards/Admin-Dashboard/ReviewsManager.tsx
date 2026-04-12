import React, { useState, useMemo } from 'react';
import { 
  useGetAllReviewsQuery, 
  useDeleteReviewMutation,
  useReplyToReviewMutation 
} from '../../features/Apis/Review.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Star, Trash2, Search, MessageSquare, 
  Building2, AlertCircle, Loader2,
  Quote, ShieldAlert, Send, X,
  ChevronLeft, ChevronRight, Filter,
  CheckCircle2, Clock, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewManager: React.FC = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'replied' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // --- API HOOKS ---
  const { data, isLoading: reviewsLoading } = useGetAllReviewsQuery(); 
  const { data: hostels } = useGetAllHostelsQuery({});
  
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [submitReply, { isLoading: isReplying }] = useReplyToReviewMutation();

  // --- FILTER LOGIC ---
  const filteredReviews = useMemo(() => {
    return data?.reviews?.filter(review => {
      const matchesSearch = 
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      
      const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'replied' ? !!review.ownerReply : !review.ownerReply;

      return matchesSearch && matchesRating && matchesStatus;
    }) || [];
  }, [data, searchTerm, filterRating, filterStatus]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ACTIONS ---
  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review purged from system");
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await submitReply({ id, ownerReply: replyText }).unwrap();
      toast.success("Reply posted successfully");
      setReplyId(null);
      setReplyText('');
    } catch (err) {
      toast.error("Failed to post reply");
    }
  };

  const getHostelName = (id: string) => hostels?.find((h: any) => h.id === id)?.name || "Unknown Property";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-3 sm:p-6 lg:p-10 font-sans pb-24">
      
      {/* HEADER & FILTER BAR */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-10">
        <div className="bg-slate-900/40 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="p-3 sm:p-4 bg-rose-600 rounded-2xl sm:rounded-3xl shadow-lg shadow-rose-500/20">
                <ShieldAlert size={24} className="text-white sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                  Moderation<span className="text-rose-500 not-italic">Hub</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        {filteredReviews.length} Records Detected
                    </p>
                </div>
              </div>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-rose-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* SECONDARY FILTERS - DROPDOWN VISIBILITY FIXED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5">
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    <Filter size={14} className="text-rose-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Rating</span>
                </div>
                <select 
                  value={filterRating} 
                  onChange={(e) => {setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1);}}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-24 pr-10 text-xs font-bold text-white outline-none cursor-pointer appearance-none focus:border-rose-500/40"
                >
                  <option value="all" className="bg-[#020617] text-white">All Stars</option>
                  {[5,4,3,2,1].map(num => <option key={num} value={num} className="bg-[#020617] text-white">{num} Stars</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
             </div>

             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    <Clock size={14} className="text-rose-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Status</span>
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => {setFilterStatus(e.target.value as any); setCurrentPage(1);}}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-24 pr-10 text-xs font-bold text-white outline-none cursor-pointer appearance-none focus:border-rose-500/40"
                >
                  <option value="all" className="bg-[#020617] text-white">Every Status</option>
                  <option value="replied" className="bg-[#020617] text-white">Already Replied</option>
                  <option value="pending" className="bg-[#020617] text-white">Needs Attention</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="max-w-7xl mx-auto">
        {reviewsLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="animate-spin text-rose-500" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 animate-pulse">Establishing Secure Uplink...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem] p-16 sm:p-24 text-center">
            <div className="p-6 bg-slate-950 inline-block rounded-full mb-6 border border-white/5">
                <X size={40} className="text-slate-800" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Zero matches found in current sector</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
              {paginatedReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-slate-900/50 border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 hover:border-rose-500/30 transition-all group flex flex-col h-full relative overflow-hidden"
                >
                  {/* CARD HEADER */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 max-w-[65%]">
                      <div className="p-1.5 bg-rose-500/10 rounded-lg">
                        <Building2 size={12} className="text-rose-500" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">
                        {getHostelName(review.hostelId)}
                      </span>
                    </div>
                    {review.ownerReply ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                        <CheckCircle2 size={10} />
                        <span className="text-[8px] font-black uppercase">Replied</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                        <Clock size={10} />
                        <span className="text-[8px] font-black uppercase">Pending</span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />
                    ))}
                  </div>
                  <h3 className="text-white font-bold text-sm mb-4 leading-tight">{review.title || "User Feedback"}</h3>

                  <div className="relative mb-6 flex-grow">
                    <Quote size={20} className="absolute -top-2 -left-2 text-white/5" />
                    <p className="text-xs text-slate-400 italic leading-relaxed pl-4 border-l-2 border-white/5">
                      {review.comment}
                    </p>
                  </div>

                  {/* ADMIN RESPONSE BOX */}
                  {review.ownerReply && (
                    <div className="mb-8 p-4 bg-slate-950/50 rounded-2xl border border-white/5 relative">
                        <div className="absolute -top-2 left-4 px-2 bg-[#020617] border border-white/5 rounded text-[7px] font-black text-emerald-500 uppercase">Management</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                            {review.ownerReply}
                        </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-rose-500 shadow-lg">
                        {review.userId.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="text-[10px] font-bold text-slate-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setReplyId(review.id); setReplyText(review.ownerReply || ''); }}
                        className="p-3 bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all border border-white/5"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(review.id)}
                        className="p-3 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* INLINE REPLY OVERLAY */}
                  {replyId === review.id && (
                    <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md z-30 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Send size={14} className="text-rose-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">System Response</h4>
                        </div>
                        <button onClick={() => setReplyId(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={18} /></button>
                      </div>
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type official response..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-2xl p-5 text-xs text-white outline-none focus:border-rose-500/50 resize-none mb-6 shadow-inner"
                      />
                      <button 
                        onClick={() => handleReply(review.id)}
                        disabled={isReplying}
                        className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-600/20"
                      >
                        {isReplying ? <Loader2 className="animate-spin" size={14} /> : <>Post Response</>}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* MOBILE-OPTIMIZED PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-12">
                <div className="flex items-center gap-4">
                    <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-4 bg-slate-900 border border-white/10 rounded-2xl text-slate-500 hover:text-rose-500 disabled:opacity-20 transition-all active:scale-95"
                    >
                    <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`h-11 w-11 sm:h-12 sm:w-12 rounded-2xl text-[10px] font-black transition-all border ${
                            currentPage === i + 1 
                            ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                            : 'bg-slate-950 border-white/5 text-slate-500 hover:border-rose-500/40'
                        }`}
                        >
                        {i + 1}
                        </button>
                    ))}
                    </div>

                    <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-4 bg-slate-900 border border-white/10 rounded-2xl text-slate-500 hover:text-rose-500 disabled:opacity-20 transition-all active:scale-95"
                    >
                    <ChevronRight size={20} />
                    </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* FULLSCREEN DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-slate-950 border border-white/10 p-10 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
                <AlertCircle size={40} />
            </div>
            <h4 className="text-white font-black uppercase italic text-2xl mb-4 tracking-tighter">Execute Purge?</h4>
            <p className="text-slate-500 text-[10px] font-bold leading-relaxed mb-10 uppercase tracking-widest px-4">
              This will permanently delete the feedback. This action is irreversible.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all border border-white/5">Abort</button>
              <button onClick={() => handleDelete(deleteConfirmId)} disabled={isDeleting} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/30">
                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;