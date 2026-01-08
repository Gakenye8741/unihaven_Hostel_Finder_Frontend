import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Building, Loader2, Compass, ArrowRight } from 'lucide-react';
// 1. Import the API hook
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api';

// Made props optional with '?' to fix the TS2739 error
interface CampusSliderProps {
  activeCampus?: string;
  setActiveCampus?: (campus: string) => void;
}

const CampusSlider: React.FC<CampusSliderProps> = ({ 
  activeCampus = "All", 
  setActiveCampus = () => {} 
}) => {
  const navigate = useNavigate();
  
  // 2. Fetch hostels
  const { data: hostels, isLoading } = useGetAllHostelsQuery({});

  // 3. Extract unique campuses and their counts
  const campusCounts = hostels?.reduce((acc: Record<string, number>, hostel: any) => {
    acc[hostel.campus] = (acc[hostel.campus] || 0) + 1;
    return acc;
  }, {});

  const uniqueCampuses = [
    "All", 
    ...Array.from(new Set(hostels?.map((h: any) => h.campus))).filter(Boolean) as string[]
  ];

  const handleCampusClick = (campusName: string) => {
    setActiveCampus(campusName);
    
    if (campusName === "All") {
      navigate('/hostels');
    } else {
      navigate(`/campus/${encodeURIComponent(campusName)}`);
    }
  };

  return (
    <section className="py-20 bg-[#0F172A] border-b border-slate-800/50 relative overflow-hidden">
      {/* Visual background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-indigo-500"></div>
                <p className="text-indigo-400 text-[10px] uppercase font-black tracking-[0.4em]">
                    University Hubs
                </p>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight leading-none">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-500">Institution</span>
            </h3>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-4 rounded-2xl hidden lg:block">
            <p className="text-slate-400 text-[11px] font-bold leading-relaxed max-w-[240px]">
              We have partnered with properties across <span className="text-white">{uniqueCampuses.length - 1} campuses</span> to ensure student safety.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-6 py-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="h-24 min-w-[220px] bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-6 overflow-x-auto pb-10 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
            {uniqueCampuses.map((campusName, index) => (
              <button
                key={index}
                onClick={() => handleCampusClick(campusName)}
                className={`group relative flex flex-col items-start gap-4 p-7 rounded-[2.5rem] border transition-all duration-500 whitespace-nowrap snap-center min-w-[240px] ${
                  activeCampus === campusName
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-2xl shadow-indigo-500/30 -translate-y-2"
                    : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:border-indigo-500/40 hover:bg-slate-800/40"
                }`}
              >
                {/* Icon & Count Badge */}
                <div className="w-full flex justify-between items-start">
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${
                      activeCampus === campusName ? "bg-white/10" : "bg-slate-800 group-hover:bg-indigo-500/10"
                  }`}>
                    {campusName === "All" ? (
                      <Building size={24} className={activeCampus === campusName ? "text-white" : "text-indigo-400"} />
                    ) : (
                      <School size={24} className={activeCampus === campusName ? "text-white" : "text-indigo-400"} />
                    )}
                  </div>
                  
                  {campusName !== "All" && (
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black border ${
                      activeCampus === campusName 
                        ? "bg-indigo-500 border-indigo-400 text-white" 
                        : "bg-slate-900 border-slate-700 text-slate-500"
                    }`}>
                      {campusCounts?.[campusName] || 0} HOSTELS
                    </div>
                  )}
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col items-start mt-2">
                    <span className="text-sm font-black tracking-tight mb-1">
                        {campusName}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          activeCampus === campusName ? "text-indigo-200" : "text-slate-500"
                        }`}>
                            {campusName === "All" ? "View Everything" : "View Neighborhood"}
                        </span>
                        <ArrowRight size={10} className={`transition-transform duration-300 group-hover:translate-x-1 ${
                          activeCampus === campusName ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`} />
                    </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default CampusSlider;