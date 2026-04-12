import React, { useState, useEffect, useMemo } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Loader2, User, Home } from 'lucide-react';
import { useGetAllReviewsQuery } from '../../features/Apis/Review.Api';
import { useGetUserProfileQuery } from '../../features/Apis/Users.Api'; 
import { useGetHostelByIdQuery } from '../../features/Apis/Hostel.Api';

/**
 * SUB-COMPONENT: ReviewIdentity
 * Fetches specific names using IDs and logs the results
 */
const ReviewIdentity: React.FC<{ uId: string; hId: string }> = ({ uId, hId }) => {
  const { data: userData, isLoading: userLoading } = useGetUserProfileQuery(uId, { skip: !uId });
  const { data: hostelData, isLoading: hostelLoading } = useGetHostelByIdQuery(hId, { skip: !hId });

  // Console logs to debug the fetching process
  useEffect(() => {
    if (uId) console.log(`🔍 Fetching User Profile for ID: ${uId}`);
    if (hId) console.log(`🔍 Fetching Hostel Details for ID: ${hId}`);
  }, [uId, hId]);

  useEffect(() => {
    if (userData) console.log("✅ User Data Received:", userData);
    if (hostelData) console.log("✅ Hostel Data Received:", hostelData);
  }, [userData, hostelData]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-indigo-900 flex items-center justify-center text-white mb-6 shadow-xl border border-white/10 transform -rotate-3 transition-transform">
        <User size={28} />
      </div>
      
      {/* Display User Name */}
      <h4 className="text-white font-black text-2xl uppercase tracking-tighter italic">
        {userLoading ? (
          <span className="animate-pulse text-slate-500">Loading User...</span>
        ) : (
          userData?.name || "Verified Student"
        )}
      </h4>

      {/* Display Hostel Name */}
      <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
        <Home size={12} className="text-emerald-400" />
        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">
          {hostelLoading ? (
            "Loading Hostel..."
          ) : (
            `Resident @ ${hostelData?.name || "Premium Residence"}`
          )}
        </span>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { data, isLoading, isError } = useGetAllReviewsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. DATA PROCESSING
  const processedReviews = useMemo(() => {
    const reviewsArray = data?.reviews && Array.isArray(data.reviews) ? data.reviews : [];
    
    console.log("📦 Total Reviews Found in API:", reviewsArray.length);
    
    if (reviewsArray.length === 0) return [];

    return [...reviewsArray].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [data]);

  // 2. SLIDER NAVIGATION
  const nextSlide = () => {
    if (processedReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % processedReviews.length);
  };

  const prevSlide = () => {
    if (processedReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + processedReviews.length) % processedReviews.length);
  };

  useEffect(() => {
    if (processedReviews.length <= 1) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [processedReviews.length, currentIndex]);

  if (isLoading) {
    return (
      <div className="py-32 bg-[#020617] flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-[#6366F1]" size={40} />
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Gathering Community Voice</p>
      </div>
    );
  }

  if (isError || processedReviews.length === 0) {
    console.error("❌ Error fetching reviews or Reviews array is empty.");
    return null;
  }

  const currentReview = processedReviews[currentIndex];

  /**
   * EXTRACTION LOGIC
   * We log these to make sure your DB keys (userId vs hostelId) are correct
   */
  console.log("Current Review Object:", currentReview);
  
  const extractedUserId = currentReview.userId || (currentReview as any).user;
  const extractedHostelId = currentReview.hostelId || (currentReview as any).hostel;

  return (
    <section className="py-24 bg-[#020617] border-t border-white/[0.03] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366F1]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#6366F1]" />
            <span className="text-[#6366F1] text-[10px] uppercase tracking-[0.6em] font-black">Testimonials</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#6366F1]" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Student Stories<span className="text-[#6366F1]">.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] md:rounded-[5rem] p-10 md:p-24 transition-all duration-700 hover:border-[#6366F1]/20 min-h-[500px] flex flex-col justify-center relative overflow-hidden">
              <Quote className="absolute -top-4 -right-4 text-white/[0.02] pointer-events-none" size={280} />
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Rating Display */}
                <div className="flex gap-2 mb-10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={`${
                        i < (currentReview?.rating || 0) 
                        ? "fill-[#6366F1] text-[#6366F1]" 
                        : "text-white/10"
                      } drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]`} 
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-white text-2xl md:text-3xl font-bold italic leading-tight tracking-tight mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                  "{currentReview?.comment}"
                </blockquote>

                {/* Identity & Hostel Information via APIs */}
                <ReviewIdentity 
                  uId={extractedUserId} 
                  hId={extractedHostelId} 
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 -left-16 -translate-y-1/2 p-5 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-full text-slate-500 hover:text-white hover:border-[#6366F1] transition-all hidden xl:block"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 -right-16 -translate-y-1/2 p-5 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-full text-slate-500 hover:text-white hover:border-[#6366F1] transition-all hidden xl:block"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-12 gap-3">
            {processedReviews.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-700 rounded-full ${
                  idx === currentIndex ? "w-12 bg-[#6366F1]" : "w-3 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;