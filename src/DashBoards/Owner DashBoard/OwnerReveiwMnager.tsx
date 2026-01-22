import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetHostelReviewsQuery, 
  useReplyToReviewMutation 
} from '../../features/Apis/Review.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  Star, MessageSquare, Building2, Loader2,
  Quote, Send, X, Flag, Search, Settings2,
  ShieldAlert, Sparkles, Inbox, Filter, ChevronDown,
  AlertCircle, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerReviewManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const userId = user?.id || user?._id;

  // --- STATE ---
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // --- API HOOKS ---
  const { data: allHostels } = useGetAllHostelsQuery({});
  
  const ownedHostels = useMemo(() => {
    return allHostels?.filter((h: any) => h.owner === userId || h.ownerId === userId) || [];
  }, [allHostels, userId]);

  useEffect(() => {
    if (ownedHostels.length > 0 && !selectedHostelId) {
      setSelectedHostelId(ownedHostels[0].id);
    }
  }, [ownedHostels, selectedHostelId]);

  const { data, isLoading: reviewsLoading } = useGetHostelReviewsQuery(selectedHostelId, {
    skip: !selectedHostelId
  });
  
  const [submitReply, { isLoading: isReplying }] = useReplyToReviewMutation();

  // --- REFINED FILTER LOGIC ---
  const filteredReviews = useMemo(() => {
    return data?.reviews?.filter(review => {
      const matchesSearch = 
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      return matchesSearch && matchesRating;
    });
  }, [data, searchTerm, filterRating]);

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await submitReply({ id, ownerReply: replyText }).unwrap();
      toast.success("Response published successfully");
      setReplyId(null);
      setReplyText('');
    } catch (err) {
      toast.error("Failed to post response");
    }
  };

  const handleRequestRemoval = (reviewId: string) => {
    toast.success("Moderation ticket generated", { icon: '🛡️' });
    const subject = encodeURIComponent(`Review Deletion Request: ${reviewId}`);
    const body = encodeURIComponent(`Hostel: ${ownedHostels.find(h => h.id === selectedHostelId)?.name}\nReview ID: ${reviewId}\n\nReason for deletion request: `);
    window.location.href = `mailto:admin@unihaven.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-10 font-sans">
      
      {/* --- UNIFIED COMMAND HUB --- */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-3 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            
            {/* Property Selector */}
            <div className="relative w-full lg:w-[300px]">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 z-10">
                <Building2 size={18} />
              </div>
              <select 
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-[10px] font-black uppercase tracking-widest text-white outline-none appearance-none cursor-pointer focus:border-indigo-500/50 transition-all"
              >
                {ownedHostels.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>

            {/* Rating Filter */}
            <div className="relative w-full lg:w-48">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 z-10">
                <Filter size={16} />
              </div>
              <select 
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none appearance-none cursor-pointer focus:border-indigo-500/50 transition-all"
              >
                <option value="all">All Ratings</option>
                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 w-full group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search feedback content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-sm text-slate-200 outline-none focus:bg-slate-950 focus:border-indigo-500/30 transition-all placeholder:text-slate-700 placeholder:text-[9px] placeholder:uppercase placeholder:tracking-[0.3em]"
              />
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {reviewsLoading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Fetching Sentiment Data...</p>
          </div>
        ) : filteredReviews?.length === 0 ? (
          <div className="bg-slate-900/10 border border-dashed border-white/5 rounded-[4rem] py-32 text-center">
            <Inbox size={64} className="mx-auto text-slate-800 mb-6 stroke-[1px]" />
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">No Reviews Found</h3>
            <p className="text-xs text-slate-600">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredReviews?.map((review) => (
              <div key={review.id} className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 hover:bg-slate-900/70 transition-all group relative flex flex-col shadow-2xl">
                
                <div className="flex justify-between items-center mb-8">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-black text-sm uppercase mb-4 tracking-tight group-hover:text-indigo-400 transition-colors">{review.title || "Guest Feedback"}</h3>
                  <div className="relative mb-8">
                    <Quote size={32} className="absolute -top-4 -left-4 text-white/[0.03]" />
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed italic pl-3 border-l-2 border-indigo-500/20">"{review.comment}"</p>
                  </div>
                </div>

                {review.ownerReply && (
                  <div className="mb-8 p-5 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20">
                    <p className="text-[9px] font-black text-indigo-400 uppercase mb-2 tracking-[0.2em]">Management Response</p>
                    <p className="text-[12px] text-slate-300 leading-snug italic font-medium">{review.ownerReply}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-xs font-black text-indigo-500 uppercase">{review.userId.substring(0, 2)}</div>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Student Guest</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setReplyId(review.id); setReplyText(review.ownerReply || ''); }}
                      className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      <MessageSquare size={14} /> Respond
                    </button>
                    <button onClick={() => handleRequestRemoval(review.id)} className="h-10 w-10 flex items-center justify-center bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all">
                      <Flag size={14} />
                    </button>
                  </div>
                </div>

                {/* --- REPLY OVERLAY --- */}
                {replyId === review.id && (
                  <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl z-20 rounded-[3rem] p-8 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Public Response</h4>
                      <button onClick={() => setReplyId(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
                    </div>
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-3xl p-6 text-sm text-white outline-none focus:border-indigo-500/50 resize-none mb-6"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setReplyId(null)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                      <button onClick={() => handleReply(review.id)} disabled={isReplying} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                        {isReplying ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Deploy</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- OWNER POLICY & DELETION MESSAGE --- */}
      <div className="max-w-7xl mx-auto mt-16 bg-slate-900/60 border border-white/5 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <ShieldAlert size={160} />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10">
          <div className="p-6 bg-indigo-600/10 rounded-[2.5rem] text-indigo-500 border border-indigo-500/10">
            <AlertCircle size={40} />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-black uppercase italic tracking-tighter text-2xl mb-4">
              Review Deletion & <span className="text-indigo-500 not-italic">Moderation Policy</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-3xl font-medium">
              At UniHaven, we value transparency. You cannot directly delete student reviews to maintain platform integrity. 
              However, if a review contains <span className="text-white">hate speech, spam, personal information, or is factually verifiable as fake</span>, 
              you may request a formal deletion.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => window.location.href='mailto:admin@unihaven.com?subject=Review Dispute Request'}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
              >
                <Flag size={16} /> Request Content Purge
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center gap-3">
                <HelpCircle size={16} /> View Moderation Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto mt-10 text-center pb-10 border-t border-white/5 pt-10">
        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em]">UniHaven Property Governance Module</p>
      </footer>
    </div>
  );
};

export default OwnerReviewManager;