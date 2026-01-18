import React, { useMemo, useState } from 'react';
import { MapPin, Star, ShieldCheck, ArrowUpRight, Bed, Loader2, Layers, Wifi, Zap, Waves, Lock, Car, Dumbbell, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetHostelReviewsQuery } from '../../features/Apis/Review.Api';
import { useListAmenitiesByHostelQuery } from '../../features/Apis/Amenities.Api';

// Icon mapping to render Lucide icons based on amenity name
const iconMap: Record<string, React.ReactNode> = {
  Wifi: <Wifi size={14} />,
  Electricity: <Zap size={14} />,
  Water: <Waves size={14} />,
  Security: <Lock size={14} />,
  Parking: <Car size={14} />,
  Gym: <Dumbbell size={14} />,
  Kitchen: <Coffee size={14} />,
};

interface HostelCardProps {
  id: string;
  name: string;
  address: string;
  campus: string;
  price?: number | null;
  image?: string;
  policy?: string;
  isVerified?: boolean;
  isLoadingPrice?: boolean;
}

const HostelCard: React.FC<HostelCardProps> = ({
  id,
  name,
  address,
  campus,
  price,
  image,
  policy,
  isVerified,
  isLoadingPrice
}) => {
  const [hoveredAmenity, setHoveredAmenity] = useState<string | null>(null);

  // 1. FETCH DATA
  const { data: reviewData, isLoading: isLoadingReviews } = useGetHostelReviewsQuery(id);
  const { data: hostelAmenities } = useListAmenitiesByHostelQuery(id);

  // 2. LOGIC
  const averageRating = useMemo(() => {
    const rawRating = reviewData?.stats?.averageRating;
    if (!rawRating || Number(rawRating) === 0) return "New";
    return Number(rawRating).toFixed(1);
  }, [reviewData]);

  const displayImage = image || "https://images.unsplash.com/photo-1555854817-5b2247a8175f?auto=format&fit=crop&w=600&q=75";

  return (
    <div className="group bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 shadow-xl hover:shadow-indigo-500/10 h-full flex flex-col">
      
      {/* IMAGE SECTION */}
      <div className="relative h-60 overflow-hidden shrink-0">
        <img 
          src={displayImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* TOP BADGES */}
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

        {/* FLOATING RATING BADGE */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
          {isLoadingReviews ? (
            <Loader2 size={12} className="text-indigo-500 animate-spin" />
          ) : (
            <>
              <Star 
                size={12} 
                className={averageRating === "New" ? "text-slate-500" : "fill-indigo-500 text-indigo-500"} 
              />
              <span className="text-white text-xs font-bold tracking-tighter">
                {averageRating}
                {(reviewData?.stats?.totalReviews ?? 0) > 0 && (
                  <span className="text-[10px] text-slate-500 ml-1 font-medium">
                    ({reviewData?.stats?.totalReviews})
                  </span>
                )}
              </span>
            </>
          )}
        </div>

        {/* 3. DYNAMIC AMENITY BAR (Floating over Image) */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 z-30">
          <div className="flex -space-x-2 overflow-visible p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl group-hover:space-x-1.5 transition-all duration-500">
            {hostelAmenities?.slice(0, 4).map((amenity: any) => (
              <div 
                key={amenity.id} 
                onMouseEnter={() => setHoveredAmenity(amenity.name)}
                onMouseLeave={() => setHoveredAmenity(null)}
                className="relative w-8 h-8 flex items-center justify-center bg-indigo-600 border-2 border-slate-900 rounded-xl text-white transition-all hover:scale-110 cursor-help"
              >
                 {iconMap[amenity.name] || <Layers size={12} />}
                 
                 {/* TOOLTIP */}
                 {hoveredAmenity === amenity.name && (
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none whitespace-nowrap z-50">
                      {amenity.name}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                   </div>
                 )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6 space-y-5 flex-grow">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin size={14} className="text-indigo-500 shrink-0" />
            <span className="text-xs font-medium truncate">{address || "Location pending..."}</span>
          </div>
        </div>

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