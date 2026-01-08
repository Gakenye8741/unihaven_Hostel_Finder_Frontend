import React, { useState, useMemo } from 'react';
import { 
  useGetHostelReviewsQuery, // Use this for specific hostel moderation
  useDeleteReviewMutation,
  useReplyToReviewMutation 
} from '../../features/Apis/Review.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Star, Trash2, Search, MessageSquare, 
  Building2, AlertCircle, Loader2,
  Quote, ShieldAlert, Send, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewManager: React.FC = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // --- API HOOKS ---
  // Note: Usually Admin needs a "GetAllReviews" endpoint. 
  // If you only have "GetByHostel", you'll need to pass a hostelId or create a Global Admin endpoint.
  // Assuming we are moderating a specific hostel or you've added a 'useGetAllReviewsQuery'
  const { data, isLoading: reviewsLoading } = useGetHostelReviewsQuery("f6c76b57-e6ea-40ef-b23d-cb098365af38"); 
  const { data: hostels } = useGetAllHostelsQuery({});
  
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [submitReply, { isLoading: isReplying }] = useReplyToReviewMutation();

  // --- LOGIC ---
  const filteredReviews = useMemo(() => {
    return data?.reviews?.filter(review => {
      const matchesSearch = 
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      return matchesSearch && matchesRating;
    });
  }, [data, searchTerm, filterRating]);

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
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-10">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-rose-600 rounded-3xl shadow-lg shadow-rose-500/20">
              <ShieldAlert size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                Moderation<span className="text-rose-500 not-italic">Hub</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">System Sentiment Control</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search titles or comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-rose-500/50 transition-all"
              />
            </div>
            <select 
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-950 border border-white/10 rounded-2xl py-3 px-6 text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="all">All Ratings</option>
              {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {reviewsLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-rose-500" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Syncing with review database...</p>
          </div>
        ) : filteredReviews?.length === 0 ? (
          <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
            <MessageSquare size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">No matching feedback found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReviews?.map((review) => (
              <div 
                key={review.id} 
                className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:border-rose-500/30 transition-all group relative"
              >
                {/* HOSTEL LABEL */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                      {getHostelName(review.hostelId)}
                    </span>
                  </div>
                  {review.ownerReply && (
                    <span className="text-[8px] px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full font-black uppercase tracking-tighter">
                      Replied
                    </span>
                  )}
                </div>

                {/* STARS & TITLE */}
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />
                  ))}
                </div>
                <h3 className="text-white font-bold text-sm mb-3 truncate">{review.title || "Untitled Review"}</h3>

                {/* COMMENT */}
                <div className="relative mb-8">
                  <Quote size={24} className="absolute -top-3 -left-2 text-white/5" />
                  <p className="text-xs text-slate-400 italic leading-relaxed relative z-10">
                    "{review.comment}"
                  </p>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-rose-500">
                      {review.userId.substring(0, 2).toUpperCase()}
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setReplyId(review.id); setReplyText(review.ownerReply || ''); }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(review.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* INLINE REPLY AREA */}
                {replyId === review.id && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-20 rounded-[2.5rem] p-8 flex flex-col animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Management Response</h4>
                      <button onClick={() => setReplyId(null)}><X size={16} /></button>
                    </div>
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your response..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-rose-500/50 resize-none mb-4"
                    />
                    <button 
                      onClick={() => handleReply(review.id)}
                      disabled={isReplying}
                      className="w-full py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2"
                    >
                      {isReplying ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Send Reply</>}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL (Same as before) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={32} />
            </div>
            <h4 className="text-white font-black uppercase italic text-xl mb-3 tracking-tighter">Confirm Purge</h4>
            <p className="text-slate-400 text-[10px] font-medium leading-relaxed mb-8 uppercase tracking-widest">
              Remove this review from the public domain?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} disabled={isDeleting} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20">
                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;