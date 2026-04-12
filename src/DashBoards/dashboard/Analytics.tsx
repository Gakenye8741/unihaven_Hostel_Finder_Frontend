import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, TrendingUp, ShieldAlert, 
  MessageSquare, ThumbsUp, Clock, Zap, Award,
  LayoutGrid, Trash2, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

import { 
  useGetMyReviewsQuery, 
  useGetUserReviewStatsQuery,
  useDeleteReviewMutation 
} from '../../features/Apis/Review.Api';

const StudentDashboard: React.FC = () => {
  // 1. DATA HOOKS
  const { data: statsData, isLoading: statsLoading, isFetching: statsFetching } = useGetUserReviewStatsQuery();
  const { data: reviewsData, isLoading: reviewsLoading } = useGetMyReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  // 2. LOGIC: Formatting the Peak Activity Hour
  const formatPeakHour = (hour: number | null | undefined) => {
    if (hour === null || hour === undefined) return "N/A";
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  // 3. HANDLERS
  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirm permanent deletion of this log?")) return;
    try {
      await deleteReview(id).unwrap();
      toast.success("Log Purged Successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Deletion Failed");
    }
  };

  // 4. LOADING STATE
  if (statsLoading || reviewsLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-6">
      <Zap className="animate-bounce text-indigo-500" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-500 animate-pulse">
        Synchronizing User Vault...
      </p>
    </div>
  );

  const stats = statsData?.stats;
  const reviews = reviewsData?.reviews || [];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 space-y-16 animate-in fade-in duration-1000">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/[0.05] pb-12 gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">System Status: Verified</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
            User <span className="text-indigo-500">Vault</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
          {statsFetching ? <RefreshCcw className="animate-spin" size={12} /> : <Activity size={12} />}
          {statsFetching ? "Updating Telemetry..." : "Data Synchronized"}
        </div>
      </div>

      {/* --- KPI METRICS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Logs', value: stats?.totalReviews, icon: MessageSquare, color: 'text-indigo-400', desc: 'Total reviews made' },
          { label: 'Like Count', value: stats?.totalHelpful, icon: ThumbsUp, color: 'text-blue-400', desc: 'Total peer helpfulness' },
          { label: 'Reported', value: stats?.reportedCount, icon: ShieldAlert, color: 'text-rose-500', desc: 'Active system flags' },
          { label: 'Peak Action', value: formatPeakHour(stats?.peakHour), icon: Clock, color: 'text-amber-400', desc: 'Most active window' },
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[3rem] hover:border-indigo-500/40 transition-all group relative overflow-hidden">
             <div className="absolute -right-4 -top-4 text-white/[0.01] group-hover:text-white/[0.03] transition-colors">
                <item.icon size={120} />
             </div>
             <div className={`mb-8 p-4 rounded-2xl bg-white/[0.02] inline-block ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
             </div>
             <div className="space-y-1 relative z-10">
                <h3 className="text-5xl font-black italic tracking-tighter">{item.value ?? 0}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="text-[8px] font-bold text-slate-700 uppercase">{item.desc}</p>
             </div>
          </div>
        ))}
      </div>

      {/* --- IMPACT CHART --- */}
      <div className="bg-white/[0.01] border border-white/[0.05] rounded-[4rem] p-10 md:p-14">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
            <TrendingUp className="text-indigo-500" size={24} /> Impact Velocity
          </h2>
          <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Temporal Contribution Analytics</span>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reviews.map(r => ({ d: new Date(r.createdAt).toLocaleDateString(), v: r.helpfulCount })).reverse()}>
              <defs>
                <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="d" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px' }}
                itemStyle={{ color: '#818cf8', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#impactGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- RECENT ACTIVITY LIST --- */}
      <div className="space-y-12 pb-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <LayoutGrid className="text-indigo-500" size={20} />
             <h2 className="text-white text-[11px] font-black uppercase tracking-[0.4em]">Activity Log</h2>
          </div>
          <div className="flex-1 h-[1px] bg-white/[0.05]" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="bg-white/[0.01] border border-white/[0.05] p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white/[0.02] transition-colors">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-indigo-400 text-[10px] font-black">
                    ★ {review.rating}.0
                  </span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">{review.comment}</h4>
              </div>
              <button 
                onClick={() => handleDelete(review.id)}
                className="p-4 rounded-2xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div className="py-32 text-center border-2 border-dashed border-white/[0.03] rounded-[3rem]">
              <p className="text-slate-600 font-black uppercase tracking-widest italic">No Data Records Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;