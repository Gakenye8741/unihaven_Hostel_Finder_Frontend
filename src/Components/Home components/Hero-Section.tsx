import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, University, Loader2, Check, ChevronDown, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useGetAllHostelsQuery } from '../../features/Apis/Hostel.Api'; 

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<'campus' | 'location' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [searchParams, setSearchParams] = useState({
    campus: "",
    location: ""
  });

  // 1. Live data for the count
  const { data: hostels, isFetching } = useGetAllHostelsQuery({
      campus: searchParams.campus || undefined,
      address: searchParams.location || undefined
  });

  // 2. Data for dropdown lists
  const { data: allHostels } = useGetAllHostelsQuery({}); 
  const uniqueCampuses = Array.from(new Set(allHostels?.map((h: any) => h.campus))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(allHostels?.map((h: any) => h.address))).filter(Boolean);

  const isSearching = searchParams.campus.trim() !== "" || searchParams.location.trim() !== "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFinalSearch = () => {
    const query = new URLSearchParams();
    if (searchParams.campus) query.append("campus", searchParams.campus);
    if (searchParams.location) query.append("address", searchParams.location);
    navigate(`/hostels?${query.toString()}`);
  };

  return (
    <section className="relative bg-[#0F172A] pt-36 pb-24 px-4 overflow-hidden min-h-[750px] flex flex-col items-center justify-center">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.08),transparent_50%)]"></div>
      <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-[10%] -left-[5%] w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
          <Sparkles size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kenya's #1 Student Housing Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6">
          Find Your Perfect <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Campus Home</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Book verified hostels near your university with zero stress. 
          Transparent pricing and secure stays for the modern student.
        </p>

        {/* THE SEARCH BOX (Logic preserved exactly as requested) */}
        <div ref={dropdownRef} className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl p-3 rounded-[2.5rem] border border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-3 relative">
          
          {/* Campus Segment */}
          <div className="flex-1 relative w-full group">
            <div className={`flex items-center gap-4 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-slate-800/50 transition-all ${activeDropdown === 'campus' ? 'bg-slate-800/40 rounded-2xl' : ''}`}>
              <University size={22} className="text-indigo-500" />
              <div className="flex flex-col items-start w-full">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-0.5">University</label>
                <input 
                  type="text" 
                  placeholder="Which Campus?" 
                  value={searchParams.campus}
                  onFocus={() => setActiveDropdown('campus')}
                  onChange={(e) => setSearchParams({...searchParams, campus: e.target.value})}
                  className="bg-transparent border-none outline-none text-white text-sm w-full font-bold placeholder:text-slate-600 placeholder:font-medium"
                />
              </div>
              <ChevronDown size={16} className={`text-slate-600 transition-transform ${activeDropdown === 'campus' ? 'rotate-180' : ''}`} />
            </div>

            {activeDropdown === 'campus' && (
              <div className="absolute top-[110%] left-0 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95">
                <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                  {uniqueCampuses.map((c: any, i) => (
                    <button key={i} 
                      onClick={() => { setSearchParams({...searchParams, campus: c}); setActiveDropdown(null); }}
                      className="w-full px-5 py-4 text-left text-slate-300 text-sm hover:bg-indigo-600 hover:text-white rounded-2xl transition-all flex items-center justify-between group">
                      <span className="font-semibold">{c}</span>
                      <Check size={16} className={searchParams.campus === c ? "opacity-100" : "opacity-0"} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Segment */}
          <div className="flex-1 relative w-full group">
            <div className={`flex items-center gap-4 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-slate-800/50 transition-all ${activeDropdown === 'location' ? 'bg-slate-800/40 rounded-2xl' : ''}`}>
              <MapPin size={22} className="text-indigo-500" />
              <div className="flex flex-col items-start w-full">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-0.5">Location</label>
                <input 
                  type="text" 
                  placeholder="Area / Estate" 
                  value={searchParams.location}
                  onFocus={() => setActiveDropdown('location')}
                  onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                  className="bg-transparent border-none outline-none text-white text-sm w-full font-bold placeholder:text-slate-600 placeholder:font-medium"
                />
              </div>
              <ChevronDown size={16} className={`text-slate-600 transition-transform ${activeDropdown === 'location' ? 'rotate-180' : ''}`} />
            </div>

            {activeDropdown === 'location' && (
              <div className="absolute top-[110%] left-0 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95">
                <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                  {uniqueLocations.map((l: any, i) => (
                    <button key={i} 
                      onClick={() => { setSearchParams({...searchParams, location: l}); setActiveDropdown(null); }}
                      className="w-full px-5 py-4 text-left text-slate-300 text-sm hover:bg-indigo-600 hover:text-white rounded-2xl transition-all flex items-center justify-between group">
                      <span className="font-semibold">{l}</span>
                      <Check size={16} className={searchParams.location === l ? "opacity-100" : "opacity-0"} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contextual Action Button */}
          <button 
            onClick={handleFinalSearch}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 min-w-[240px] shadow-xl shadow-indigo-500/20 active:scale-95 group"
          >
            {isFetching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="group-hover:scale-110 transition-transform" />}
            
            <span>
                {isSearching && hostels && hostels.length > 0 
                  ? `${hostels.length} Hostels Found` 
                  : "Search Hostels"}
            </span>
          </button>
        </div>

        {/* Trending Searches Tags */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trending:</span>
          {['JKUAT', 'Strathmore', 'Madaraka', 'Juja'].map((tag) => (
            <button 
              key={tag}
              onClick={() => setSearchParams({ ...searchParams, campus: tag })}
              className="px-4 py-1.5 rounded-full bg-slate-800/40 border border-slate-700 text-slate-400 text-[10px] font-bold hover:border-indigo-500 hover:text-white transition-all"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto border-t border-slate-800/50 pt-16">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold text-sm">Vetted Properties</h4>
              <p className="text-slate-500 text-xs">All hostels are physically verified.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Zap size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold text-sm">Instant Booking</h4>
              <p className="text-slate-500 text-xs">Secure your room in minutes.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Check size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold text-sm">Zero Booking Fees</h4>
              <p className="text-slate-500 text-xs">Students pay strictly the rent.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;