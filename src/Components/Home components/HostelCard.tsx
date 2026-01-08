import React from 'react';
import { MapPin, Star, ShieldCheck, ArrowUpRight, Bed, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HostelCardProps {
  id: string;
  name: string;
  address: string;      // Changed from 'location' to 'address' to match your API
  campus: string;
  price?: number | null; // Changed to number to handle calculated average
  rating?: number;
  image?: string;
  policy?: string;
  isVerified?: boolean;
  isLoadingPrice?: boolean; // Added to show a loader while Room API fetches
}

const HostelCard: React.FC<HostelCardProps> = ({
  id,
  name,
  address,
  campus,
  price,
  rating = 4.8,
  image,
  policy,
  isVerified,
  isLoadingPrice
}) => {
  // Fallback image
  const displayImage = image || "https://images.unsplash.com/photo-1555854817-5b2247a8175f?auto=format&fit=crop&w=600&q=75";

  return (
    <div className="group bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 shadow-xl hover:shadow-indigo-500/10">
      
      {/* 1. IMAGE SECTION */}
      <div className="relative h-60 overflow-hidden">
        <img 
          src={displayImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* BADGES */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isVerified && (
            <div className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
              <ShieldCheck size={12} /> Verified
            </div>
          )}
          {policy && (
            <div className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/10">
              {policy}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
          <Star size={12} className="fill-indigo-500 text-indigo-500" />
          <span className="text-white text-xs font-bold">{rating}</span>
        </div>
      </div>

      {/* 2. CONTENT SECTION */}
      <div className="p-6 space-y-5">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
              {name}
            </h3>
          </div>
          
          {/* ADDRESS DISPLAY */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin size={14} className="text-indigo-500 shrink-0" />
            <span className="text-xs font-medium truncate">
              {address || "Location pending..."}
            </span>
          </div>
        </div>

        {/* CAMPUS TAG */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-xl w-fit">
          <Bed size={14} className="text-indigo-400" />
          <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider">{campus}</span>
        </div>

        {/* PRICE SECTION */}
        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black tracking-widest text-slate-500">Avg. Rate</span>
            <div className="flex items-center gap-2">
              {isLoadingPrice ? (
                <Loader2 size={16} className="text-indigo-500 animate-spin" />
              ) : (
                <span className="text-xl font-black text-white">
                  {price ? `KES ${price.toLocaleString()}` : "TBD"}
                </span>
              )}
              {!isLoadingPrice && <span className="text-[10px] text-slate-500 font-bold">/SEM</span>}
            </div>
          </div>

          <Link 
            to={`/hostels/${id}`}
            className="flex items-center justify-center h-12 w-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-90"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;