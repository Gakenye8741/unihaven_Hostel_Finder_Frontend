import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllUsersQuery } from '../../features/Apis/Users.Api';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, Home, MapPin, ShieldCheck, LayoutDashboard, 
  UserCheck, Briefcase, GraduationCap, Zap, Activity,
  TrendingUp, Globe, ClipboardList, Trophy, Search, Clock
} from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- CORE DATA FETCH ---
  const { data: allUsers, isLoading: loadingUsers } = useGetAllUsersQuery({});
  const { data: hostels, isLoading: loadingHostels } = useGetAllHostelsQuery({});

  // --- CALCULATED ANALYTICS ---
  const analytics = useMemo(() => {
    if (!allUsers || !hostels) return null;

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Velocity Tracking
    const newUsers24h = allUsers.filter((u: any) => new Date(u.createdAt) > twentyFourHoursAgo).length;
    const newHostels24h = hostels.filter((h: any) => new Date(h.createdAt) > twentyFourHoursAgo).length;

    const students = allUsers.filter((u: any) => u.role === 'Student').length;
    const owners = allUsers.filter((u: any) => u.role === 'Owner').length;
    const staff = allUsers.filter((u: any) => u.role === 'Staff' || u.role === 'Caretaker').length;
    const admins = allUsers.filter((u: any) => u.role === 'Admin').length;

    const campusMap = hostels.reduce((acc: any, h: any) => {
      acc[h.campus] = (acc[h.campus] || 0) + 1;
      return acc;
    }, {});

    const campusData = Object.entries(campusMap).map(([name, value]) => ({ name, value }));

    const leaderboard = Object.entries(campusMap)
      .map(([name, count]: any) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const verifiedCount = allUsers.filter((u: any) => u.isIdentityVerified).length;
    const verificationRate = ((verifiedCount / allUsers.length) * 100).toFixed(1);
    const staffRatio = (students / (staff || 1)).toFixed(0);

    return { 
        students, owners, staff, admins, campusData, 
        leaderboard, verificationRate, staffRatio,
        newUsers24h, newHostels24h
    };
  }, [allUsers, hostels]);

  const filteredLeaderboard = analytics?.leaderboard.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  if (loadingUsers || loadingHostels) return <LoadingState />;

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVars}
      className="min-h-screen bg-[#020617] text-slate-300 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <motion.div variants={itemVars} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/60 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-2 w-2 bg-indigo-500 rounded-full" 
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Live Command Center</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
              Admin<span className="text-indigo-500 not-italic font-thin">Pulse</span>
            </h1>
            <div className="flex gap-4 mt-2">
               <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                  <Clock size={10} className="text-emerald-500"/> 24h Users: <span className="text-white">+{analytics?.newUsers24h}</span>
               </div>
               <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                  <Home size={10} className="text-indigo-400"/> 24h Hostels: <span className="text-white">+{analytics?.newHostels24h}</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-3xl border border-slate-800 shadow-2xl">
             <div className="text-center px-4 border-r border-slate-800">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Support Ratio</p>
                <p className="text-2xl font-black text-white italic">{analytics?.staffRatio}:1</p>
             </div>
             <div className="text-center px-4">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Trust Score</p>
                <p className="text-2xl font-black text-indigo-500 italic">{analytics?.verificationRate}%</p>
             </div>
          </div>
        </motion.div>

        {/* PRIMARY IDENTITY CARDS */}
        <motion.div variants={containerVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<GraduationCap />} label="Students" value={analytics?.students} color="indigo" />
          <StatCard icon={<Briefcase />} label="Hostel Owners" value={analytics?.owners} color="purple" />
          <StatCard icon={<UserCheck />} label="Caretakers" value={analytics?.staff} color="emerald" />
          <StatCard icon={<ShieldCheck />} label="Super Admins" value={analytics?.admins} color="amber" />
        </motion.div>

        {/* GEOGRAPHIC & SYSTEM TILES */}
        <motion.div variants={containerVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<MapPin />} label="Campus Zones" value={analytics?.campusData.length} color="rose" />
          <StatCard icon={<Globe />} label="Hostel Capacity" value={hostels?.length} color="pink" />
          <StatCard icon={<ClipboardList />} label="Verification" value={allUsers?.filter((u:any)=>u.isIdentityVerified).length} color="blue" />
          <StatCard icon={<Activity />} label="Uptime" value="99.9%" color="teal" />
        </motion.div>

        {/* ANALYTICS VISUALIZATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.div variants={itemVars}>
            <ChartBox title="User Distribution" subtitle="Node allocation by account role">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Students', value: analytics?.students },
                      { name: 'Owners', value: analytics?.owners },
                      { name: 'Staff', value: analytics?.staff },
                      { name: 'Admins', value: analytics?.admins },
                    ]}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {COLORS.map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                     itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>
          </motion.div>

          {/* SEARCHABLE CAMPUS LEADERBOARD */}
          <motion.div variants={itemVars}>
            <ChartBox title="Campus Leaderboard" subtitle="Regional dominance ranking">
               <div className="relative mb-4 mt-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search campus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-indigo-500 outline-none transition-all"
                  />
               </div>
               <div className="space-y-4 h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode='popLayout'>
                    {filteredLeaderboard?.map((campus: any, idx: number) => (
                        <motion.div 
                          layout
                          key={campus.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 group hover:border-indigo-500/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-400'}`}>
                                    {idx === 0 ? <Trophy size={14} /> : idx + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{campus.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{campus.count} Hostels</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-indigo-400">{hostels ? ((campus.count / hostels.length) * 100).toFixed(0) : '0'}%</p>
                            </div>
                        </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </ChartBox>
          </motion.div>

          <motion.div variants={itemVars}>
            <ChartBox title="Regional Cluster" subtitle="Hostel density per campus location">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={analytics?.campusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#1e293b', opacity: 0.3}} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={45}>
                     {analytics?.campusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </motion.div>

          <motion.div variants={itemVars}>
            <ChartBox title="Trust Integrity" subtitle="Identity verification ratio">
               <div className="flex flex-col items-center justify-center h-[320px] space-y-6">
                  <div className="relative flex items-center justify-center">
                      <svg className="w-48 h-48 transform -rotate-90">
                          <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                          <motion.circle 
                              cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" 
                              strokeDasharray={502}
                              initial={{ strokeDashoffset: 502 }}
                              animate={{ strokeDashoffset: 502 - (502 * Number(analytics?.verificationRate)) / 100 }}
                              transition={{ duration: 2, ease: "easeOut" }}
                              className="text-indigo-500" strokeLinecap="round" 
                          />
                      </svg>
                      <div className="absolute text-center">
                          <motion.span 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="text-4xl font-black text-white italic"
                          >
                            {analytics?.verificationRate}%
                          </motion.span>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Verified</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="text-center p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                          <p className="text-[8px] text-slate-500 font-black uppercase">Secured</p>
                          <p className="text-lg font-black text-emerald-500">{allUsers?.filter((u:any)=>u.isIdentityVerified).length}</p>
                      </div>
                      <div className="text-center p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                          <p className="text-[8px] text-slate-500 font-black uppercase">Pending</p>
                          <p className="text-lg font-black text-rose-500">{allUsers?.length - allUsers?.filter((u:any)=>u.isIdentityVerified).length}</p>
                      </div>
                  </div>
               </div>
            </ChartBox>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENTS ---

const StatCard = ({ icon, label, value, color }: any) => {
  const styles: any = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
      whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.4)' }}
      className="bg-[#0f172a] border border-slate-800/60 p-6 rounded-[2.5rem] relative group overflow-hidden transition-all duration-300 shadow-lg"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 ${styles[color]}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter">{value || 0}</h2>
        <TrendingUp size={14} className="text-emerald-500 opacity-50" />
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        {React.cloneElement(icon, { size: 120 })}
      </div>
    </motion.div>
  );
};

const ChartBox = ({ children, title, subtitle, className }: any) => (
  <div className={`bg-[#0f172a]/50 border border-slate-800/60 p-8 rounded-[3rem] backdrop-blur-sm h-full ${className}`}>
    <div className="mb-6">
      <h3 className="text-sm font-black text-white uppercase italic tracking-[0.1em]">{title}</h3>
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
    {children}
  </div>
);

const LoadingState = () => (
  <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full" 
    />
    <span className="text-indigo-500 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Syncing Control Center</span>
  </div>
);

export default AdminAnalytics;