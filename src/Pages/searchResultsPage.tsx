import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { 
  Loader2, SearchX, SlidersHorizontal, ShieldCheck 
} from 'lucide-react';
import HostelCard from '../Components/Home components/HostelCard';

// API Imports
import { useGetAllHostelsQuery } from '../features/Apis/Hostel.Api';
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const campus = searchParams.get("campus") || "";
  const address = searchParams.get("address") || "";

  const { data: hostels, isLoading, isError } = useGetAllHostelsQuery({ 
    campus: campus || undefined, 
    address: address || undefined 
  });

  return (
    <div className="bg-[#0B0F1A] min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Market <span className="text-[#6366F1]">Scout</span>
            </h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {hostels?.length || 0} Listings Found
            </p>
          </div>
          <button className="group flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-indigo-500/50 transition-all shadow-2xl">
            <SlidersHorizontal size={16} className="text-[#6366F1]" /> Refine Parameters
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-slate-800/50 rounded-[4rem]">
            <Loader2 className="text-[#6366F1] animate-spin mb-6" size={56} strokeWidth={1} />
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.5em] font-black italic">Synchronizing Marketplace Data...</p>
          </div>
        )}

        {/* ERROR OR EMPTY STATE */}
        {!isLoading && (isError || !hostels || hostels.length === 0) && (
          <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-[4rem] p-24 text-center">
            <SearchX size={44} className="text-slate-600 mx-auto mb-8" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">Zero Match Found</h3>
            <button 
              onClick={() => window.history.back()}
              className="px-10 py-5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all shadow-xl"
            >
              Adjust Parameters
            </button>
          </div>
        )}

        {/* RESULTS GRID */}
        {!isLoading && hostels && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hostels.map((hostel: any) => (
              <HostelCardWrapper key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// COMPONENT: WRAPPER FOR RICH DATA FETCHING
const HostelCardWrapper: React.FC<{ hostel: any }> = ({ hostel }) => {
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(hostel.id);
  const { data: gallery } = useGetHostelGalleryQuery(hostel.id);

  const roomDetails = useMemo(() => {
    if (!rooms || rooms.length === 0) return { price: null, types: [] };
    return { 
      price: rooms[0].price ? Number(rooms[0].price) : null, 
      types: Array.from(new Set(rooms.map((r: any) => r.type).filter(Boolean))) 
    };
  }, [rooms]);

  const displayImage = useMemo(() => {
    const thumb = gallery?.find((m: any) => m.isThumbnail === true);
    return thumb ? thumb.url : hostel.image;
  }, [gallery, hostel.image]);

  return (
    <div className="relative group bg-[#0F172A] border border-slate-800/60 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-indigo-500/50 hover:shadow-[0_0_80px_rgba(99,102,241,0.15)] h-full flex flex-col">
      
      {/* 1. TOP LEFT BADGE (Verified Only) */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-3 pointer-events-none">
        {hostel.isVerified && (
          <div className="bg-indigo-600/20 backdrop-blur-xl border border-indigo-500/40 p-2.5 rounded-2xl text-indigo-400">
            <ShieldCheck size={18} />
          </div>
        )}
      </div>

      {/* 2. TOP RIGHT TAGS (Room Types) */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
        {!roomsLoading && roomDetails.types.slice(0, 1).map((type: any) => (
          <div key={type} className="bg-slate-950/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-indigo-500/30 shadow-2xl">
            <span className="text-[10px] font-black uppercase text-indigo-400 italic tracking-widest">{type}</span>
          </div>
        ))}
      </div>

      <HostelCard 
        id={hostel.id} 
        name={hostel.name} 
        address={hostel.address}
        campus={hostel.campus} 
        policy={hostel.policy}
        image={displayImage} 
        price={roomDetails.price} 
        isLoadingPrice={roomsLoading}
      />
    </div>
  );
};

export default SearchResultsPage;