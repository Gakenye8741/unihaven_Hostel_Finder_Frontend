import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, MessageSquare, Trash2, Edit3, 
  MapPin, Building2, Calendar, Quote, 
  UserCheck, ThumbsUp, ChevronRight, 
  Check, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { 
  useGetMyReviewsQuery, // Updated: Now uses the personal vault hook
  useDeleteReviewMutation,
  useUpdateReviewMutation 
} from '../../features/Apis/Review.Api';
import { useGetHostelByIdQuery } from '../../features/Apis/Hostel.Api';

/**
 * SUB-COMPONENT: ReviewCard
 * Fully synchronized with the updated RTK Query tag system
 */
const ReviewCard: React.FC<{ review: any; onDelete: (id: string) => void }> = ({ review, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    rating: review.rating, 
    title: review.title || "", 
    comment: review.comment 
  });
  
  const { data: hostel, isLoading: hostelLoading } = useGetHostelByIdQuery(review.hostelId, {
    skip: !review.hostelId
  });

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const handleUpdate = async () => {
    if (!editForm.comment.trim()) {
      return toast.error("Comment cannot be empty");
    }

    try {
      await updateReview({ 
        id: review.id, 
        title: editForm.title.trim() || "Updated Entry",
        rating: editForm.rating,
        comment: editForm.comment.trim() 
      }).unwrap();
      
      setIsEditing(false);
      toast.success("ENTRY UPDATED SUCCESSFULLY");
    } catch (err: any) {
      toast.error(err?.data?.error || "Update Failed");
    }
  };

  return (
    <div className={`group relative bg-[#020617] border rounded-[3rem] overflow-hidden transition-all duration-700 ${isEditing ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-white/[0.05] hover:border-indigo-500/30'}`}>
      <div className="flex flex-col md:flex-row min-h-[320px]">
        
        {/* SIDEBAR - HOSTEL CONTEXT */}
        <div className="md:w-80 bg-white/[0.01] p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.04]">
          <div className="space-y-6">
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              {hostelLoading ? (
                <div className="h-6 w-32 bg-white/5 animate-pulse rounded-full" />
              ) : (
                <h4 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-none mb-3 group-hover:text-indigo-400 transition-colors">
                  {hostel?.name || "Archived Unit"}
                </h4>
              )}
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">{hostel?.address || "Verified Asset"}</span>
              </div>
            </div>
          </div>
          <Link to={`/hostels/${review.hostelId}`} className="flex items-center justify-between group/link">
            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] group-hover/link:translate-x-1 transition-transform">Audit Log</span>
            <ChevronRight size={14} className="text-indigo-500" />
          </Link>
        </div>

        {/* MAIN INTERACTION ZONE */}
        <div className="flex-1 p-10 md:p-14 flex flex-col justify-between">
          {isEditing ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setEditForm({ ...editForm, rating: star })}>
                    <Star size={24} fill={star <= editForm.rating ? "#F59E0B" : "none"} className={star <= editForm.rating ? "text-amber-500" : "text-slate-700"} />
                  </button>
                ))}
              </div>
              <input 
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Review Title"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-black uppercase tracking-widest text-[11px] outline-none focus:border-indigo-500/50"
              />
              <textarea 
                value={editForm.comment}
                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-slate-300 text-lg italic outline-none focus:border-indigo-500/50 min-h-[140px]"
              />
              <div className="flex gap-3">
                <button onClick={handleUpdate} disabled={isUpdating} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50">
                  {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} Patch Data
                </button>
                <button onClick={() => setIsEditing(false)} className="bg-white/5 text-slate-400 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Abort
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < review.rating ? "#F59E0B" : "none"} className={i < review.rating ? "text-amber-500" : "text-white/[0.05]"} />
                      ))}
                    </div>
                    <h5 className="text-white text-[11px] font-black uppercase tracking-[0.25em] opacity-80">{review.title || "User Verified Review"}</h5>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditing(true)} className="p-4 bg-white/[0.03] text-slate-500 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all border border-white/[0.05]"><Edit3 size={20} /></button>
                    <button onClick={() => onDelete(review.id)} className="p-4 bg-white/[0.03] text-slate-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-white/[0.05]"><Trash2 size={20} /></button>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-8 -left-8 text-indigo-500/10" size={64} />
                  <p className="text-slate-300 text-xl font-medium leading-relaxed italic relative z-10 pl-4 border-l-2 border-indigo-500/20">"{review.comment}"</p>
                </div>

                {/* Management Response Display */}
                {review.ownerReply && (
                  <div className="mt-8 p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Management Response</span>
                    </div>
                    <p className="text-slate-400 text-sm italic">"{review.ownerReply}"</p>
                  </div>
                )}
              </div>

              <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/[0.04]">
                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest italic">
                  <div className="flex items-center gap-2 text-indigo-400"><ThumbsUp size={14} /> {review.helpfulCount || 0} Peer Endorsements</div>
                  <div className="flex items-center gap-2 text-slate-600"><Calendar size={14} /> {new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MyReviews: React.FC = () => {
  // Uses the specialized hook for the current user's reviews
  const { data, isLoading, refetch } = useGetMyReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("PERMANENTLY REMOVE THIS DATA?")) return;
    try {
      await deleteReview(id).unwrap();
      toast.success("ENTRY EXPUNGED");
      refetch();
    } catch (err: any) { 
      toast.error(err?.data?.error || "DELETION FAILED"); 
    }
  };

  if (isLoading) return (
    <div className="h-[75vh] flex flex-col items-center justify-center">
      <div className="w-24 h-24 border-[3px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]" />
      <p className="mt-10 text-slate-500 text-[11px] font-black uppercase tracking-[0.6em]">Syncing Archive Vault...</p>
    </div>
  );

  return (
    <section className="max-w-6xl mx-auto space-y-16 pb-40 px-4 md:px-0 animate-in fade-in duration-1000">
      <div className="pb-14 border-b border-white/[0.04] flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <UserCheck size={14} className="text-indigo-400" />
            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">Contributor: {data?.reviews?.[0]?.isVerified ? "Verified Elite" : "Active"}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
            My <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Vault</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-14">
        {data?.reviews && data.reviews.length > 0 ? (
          data.reviews.map((r: any) => (
            <ReviewCard key={r.id} review={r} onDelete={handleDelete} />
          ))
        ) : (
          <div className="py-40 border-2 border-dashed border-white/[0.05] rounded-[4rem] flex flex-col items-center justify-center bg-white/[0.01]">
            <MessageSquare size={72} className="text-slate-800 mb-10" strokeWidth={1} />
            <h4 className="text-white font-black uppercase italic tracking-tighter text-4xl opacity-40">Archive Empty</h4>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyReviews;