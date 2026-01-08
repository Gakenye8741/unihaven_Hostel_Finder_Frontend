import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import Navbar from '../Components/Navbar';

import { Loader2, SearchX, SlidersHorizontal } from 'lucide-react';
import HostelCard from '../Components/Home components/HostelCard';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Extract params from URL (e.g., ?campus=JKUAT&address=Juja)
  const campus = searchParams.get("campus") || "";
  const address = searchParams.get("address") || "";

  // 1. USE THE API HOOK with the parameters from the URL
  const { data: hostels, isLoading, isError } = useGetAllHostelsQuery({ 
    campus: campus || undefined, 
    address: address || undefined 
  });

  return (
    <div className="bg-[#0B0F1A] min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Search <span className="text-[#6366F1]">Results</span>
            </h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">
              Showing hostels for: {campus || "All Campuses"} {address && `in ${address}`}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#6366F1]/50 transition-all">
            <SlidersHorizontal size={14} className="text-[#6366F1]" /> Filter Results
          </button>
        </div>

        {/* 2. LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="text-[#6366F1] animate-spin mb-4" size={40} />
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black">Syncing with Marketplace...</p>
          </div>
        )}

        {/* 3. ERROR OR EMPTY STATE */}
        {!isLoading && (isError || !hostels || hostels.length === 0) && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-20 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <SearchX size={40} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No Hostels Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">We couldn't find any verified listings matching your specific search criteria.</p>
            <button 
              onClick={() => window.history.back()}
              className="text-[#6366F1] text-[10px] font-black uppercase tracking-widest border-b border-[#6366F1]/30 hover:border-[#6366F1]"
            >
              Adjust Search
            </button>
          </div>
        )}

        {/* 4. RESULTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hostels?.map((hostel: any) => (
            <HostelCard key={hostel.id} {...hostel} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResultsPage;