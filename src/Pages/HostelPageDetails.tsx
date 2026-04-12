import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetHostelByIdQuery } from '../features/Apis/Hostel.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api'; 
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
import { useListAmenitiesByHostelQuery } from '../features/Apis/Amenities.Api';
import { 
  useGetHostelReviewsQuery, 
  useCreateReviewMutation,
  useMarkHelpfulMutation,
  useReportReviewMutation 
} from '../features/Apis/Review.Api';
import Navbar from '../Components/Navbar';
import { 
  MapPin, ShieldCheck, Loader2, CheckCircle2, DoorOpen, 
  Search, ChevronLeft, ChevronRight, LayoutGrid, Users, Hash, Share2, Mail, Star,
  ArrowRight, Phone, CreditCard, MessageSquare, Quote, UserCircle, X, Send, Plus,
  ChevronDown, MessageCircle, Layers, ThumbsUp, AlertTriangle, Flag, ShieldAlert,
  Wifi, Zap, Shield, Waves, Coffee, Monitor, Wind, Utensils, Bath, HardHat,
  Info, ExternalLink, Heart, Bookmark, Eye, Calendar, Sparkles,
  Clock,
  Maximize2,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '../App/store';

const HostelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // --- FILTER & PAGINATION STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Label");
  const roomsPerPage = 20; 

  // --- UI MODAL STATES ---
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [expandedReplyId, setExpandedReplyId] = useState<string | null>(null);

  // --- REPORT STATES ---
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportCategory, setReportCategory] = useState<string>("");
  const [reportReason, setReportReason] = useState<string>("");

  // --- API QUERIES & MUTATIONS ---
  const { data: hostel, isLoading: hostelLoading, isError: hostelError } = useGetHostelByIdQuery(id || '');
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(id || '');
  const { data: gallery, isLoading: galleryLoading } = useGetHostelGalleryQuery(id || '');
  const { data: reviewData, isLoading: reviewsLoading } = useGetHostelReviewsQuery(id || '');
  const { data: hostelAmenities, isLoading: amenitiesLoading } = useListAmenitiesByHostelQuery(id || '');
  
  const [createReview, { isLoading: isPosting }] = useCreateReviewMutation();
  const [markHelpful] = useMarkHelpfulMutation();
  const [reportReview, { isLoading: isReporting }] = useReportReviewMutation();

  const { user } = useSelector((state: RootState) => state.auth);
  const studentName = user?.username || "a student";

  // --- INTERACTION HANDLERS ---
  
  const handleLikeReview = async (reviewId: string) => {
    try {
      await markHelpful(reviewId).unwrap();
      toast.success("Marked as helpful!", { 
        icon: '👍',
        style: { borderRadius: '12px', background: '#0F172A', color: '#fff', fontSize: '10px', border: '1px solid #1E293B' }
      });
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleReportClick = (reviewId: string) => {
    setReportingReviewId(reviewId);
    setIsReportModalOpen(true);
  };

  const submitReport = async () => {
    if (!reportCategory || reportReason.length < 5) {
      return toast.error("Please select a category and provide details.");
    }

    try {
      const finalReason = `[${reportCategory}]: ${reportReason}`;
      await reportReview({ id: reportingReviewId!, reason: finalReason }).unwrap();
      
      toast.success("Incident flagged for moderator review", { 
        icon: '🛡️',
        style: { borderRadius: '15px', background: '#1E293B', color: '#fff', fontSize: '11px' }
      });
      
      setIsReportModalOpen(false);
      setReportCategory("");
      setReportReason("");
    } catch (err) {
      toast.error("Failed to submit report.");
    }
  };

  const handleReservation = () => {
    if (!selectedRoom) return toast.error("Please select a room first! 🏢");
    const whatsappNumber = hostel?.owner?.whatsappPhone;
    if (!whatsappNumber) return toast.error("Hostel owner hasn't provided a WhatsApp number. 📲");

    const message = `🌟 *NEW RESERVATION INQUIRY*\n\nHello, my name is *${studentName}*. I found your property, *${hostel?.name}*, on Unihaven.\n\nUnit: ${selectedRoom.label}\nType: ${selectedRoom.type}\nFloor: ${selectedRoom.floor}\nPrice: KES ${parseFloat(selectedRoom.price).toLocaleString()}\n\nIs this available?`;
    const cleanNumber = whatsappNumber.replace(/\D/g, ''); 
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallManager = () => {
    const phone = hostel?.owner?.phone;
    if (!phone) return toast.error("Contact details unavailable. 📞");
    window.open(`tel:${phone.replace(/[^\d+]/g, '')}`);
  };

  const handleEmailInquiry = () => {
    if (!selectedRoom) return toast.error("Select a room first! 📧");
    const email = hostel?.owner?.email;
    if (!email) return toast.error("Email not found. 📩");
    window.location.href = `mailto:${email}?subject=Inquiry: ${selectedRoom.label}&body=Hello, I'm interested in ${selectedRoom.label} at ${hostel?.name}.`;
  };

  const handleShareHostel = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: hostel?.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied! 📋");
      }
    } catch (err) {}
  };

  const handlePostReview = async () => {
    if (!reviewForm.title || !reviewForm.comment) return toast.error("Fill all fields");
    try {
      await createReview({ hostelId: id, ...reviewForm }).unwrap();
      toast.success("Published!");
      setIsCreateReviewOpen(false);
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch (err) { toast.error("Failed to post"); }
  };

  // --- DATA MEMOIZATION ---
  const selectedRoom = useMemo(() => rooms?.find((r: any) => r.id === selectedRoomId), [rooms, selectedRoomId]);

  const hostelImages = useMemo(() => {
    if (gallery && gallery.length > 0) {
      const imgs = gallery.filter((m: any) => m.type === 'Image').map((m: any) => m.url);
      if (imgs.length > 0) return imgs;
    }
    return ["https://images.unsplash.com/photo-1555854817-5b2247a8175f", "https://images.unsplash.com/photo-1522770179533-24471fcdba45"];
  }, [gallery]);

  const { filteredRooms, floors, roomTypes, typeBreakdown, roomMetrics } = useMemo(() => {
    if (!rooms) return { filteredRooms: [], floors: [], roomTypes: [], typeBreakdown: [], roomMetrics: { minPrice: "0" }};
    
    const prices = rooms.map((r: any) => parseFloat(r.price) || 0);
    const uniqueFloors = ["All", ...Array.from(new Set(rooms.map((r: any) => r.floor)))].filter(Boolean);
    const uniqueTypes = ["All", ...Array.from(new Set(rooms.map((r: any) => r.type)))].filter(Boolean);
    
    const breakdown = Array.from(new Set(rooms.map((r: any) => r.type))).map(type => {
      const typeRooms = rooms.filter((r: any) => r.type === type);
      return { 
        type, 
        count: typeRooms.length, 
        available: typeRooms.filter((r: any) => r.status !== 'Full').length, 
        price: typeRooms[0].price,
        amenities: typeRooms[0].amenities || []
      };
    });

    let filtered = rooms.filter((r: any) => 
      r.label.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (selectedFloor === "All" || r.floor === selectedFloor) && 
      (selectedType === "All" || r.type === selectedType)
    );

    if (sortBy === "Price (Low)") filtered.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === "Price (High)") filtered.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price));

    return { 
      filteredRooms: filtered, 
      floors: uniqueFloors, 
      roomTypes: uniqueTypes, 
      typeBreakdown: breakdown, 
      roomMetrics: { minPrice: prices.length > 0 ? Math.min(...prices).toString() : "0" }
    };
  }, [rooms, searchTerm, selectedFloor, selectedType, sortBy]);

  const paginatedRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'floor') setSelectedFloor(value);
    if (type === 'type') setSelectedType(value);
    if (type === 'search') setSearchTerm(value);
    if (type === 'sort') setSortBy(value);
    setCurrentPage(1);
  };

  // --- AMENITY ICON MAPPER ---
  const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi') || n.includes('internet')) return <Wifi size={14} />;
    if (n.includes('power') || n.includes('token') || n.includes('electricity')) return <Zap size={14} />;
    if (n.includes('security') || n.includes('cctv')) return <Shield size={14} />;
    if (n.includes('water') || n.includes('borehole')) return <Waves size={14} />;
    if (n.includes('study') || n.includes('desk')) return <Monitor size={14} />;
    if (n.includes('fan') || n.includes('ac')) return <Wind size={14} />;
    if (n.includes('kitchen')) return <Utensils size={14} />;
    if (n.includes('shower') || n.includes('bathroom')) return <Bath size={14} />;
    return <Sparkles size={14} />;
  };

  if (hostelLoading || roomsLoading || galleryLoading || reviewsLoading || amenitiesLoading) return (
    <div className="h-screen bg-[#0B0F1A] flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="text-[#6366F1] animate-spin mb-4" size={48} strokeWidth={1} />
        <div className="absolute inset-0 bg-[#6366F1]/10 blur-xl rounded-full"></div>
      </div>
      <p className="text-slate-500 text-[10px] uppercase tracking-[0.6em] font-black animate-pulse">Initializing Virtual Tour</p>
    </div>
  );

  if (hostelError || !hostel) return (
    <div className="h-screen bg-[#0B0F1A] flex flex-col items-center justify-center text-white p-8">
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-center max-w-sm">
        <AlertTriangle className="text-rose-500 mx-auto mb-4" size={40} />
        <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Inventory Locked</h2>
        <p className="text-slate-400 text-xs font-medium leading-relaxed">This property might have been unlisted or moved. Contact support if you believe this is an error.</p>
        <button onClick={() => navigate(-1)} className="mt-6 w-full bg-slate-800 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest">Return to Campus Map</button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0B0F1A] min-h-screen pb-52 selection:bg-indigo-500/30 font-sans text-slate-300">
      <Navbar />
      
     {/* --- UPDATED GALLERY SECTION --- */}
<section className="pt-24 px-4 max-w-7xl mx-auto">
  {/* MOBILE VIEW: High-Impact Single Card with Swipe Logic */}
  <div className="md:hidden relative group h-[400px] w-full rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
    {/* Background Image with subtle zoom */}
    <img 
      src={hostelImages[activeImageIndex]} 
      className="w-full h-full object-cover transition-all duration-700 ease-out" 
      alt="Hostel Preview" 
    />
    
    {/* Glassmorphic Top Bar: Status/Counter */}
    <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
        <Camera size={14} className="text-indigo-400" />
        <span className="text-white text-[10px] font-black uppercase tracking-widest">
          {activeImageIndex + 1} / {hostelImages.length}
        </span>
      </div>
      <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/20 px-4 py-2 rounded-2xl">
        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest italic">Verified Photos</span>
      </div>
    </div>

    {/* Center Navigation Arrows */}
    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        onClick={() => setActiveImageIndex(p => (p - 1 + hostelImages.length) % hostelImages.length)} 
        className="p-4 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-75 transition-all"
      >
        <ChevronLeft size={24}/>
      </button>
      <button 
        onClick={() => setActiveImageIndex(p => (p + 1) % hostelImages.length)} 
        className="p-4 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-75 transition-all"
      >
        <ChevronRight size={24}/>
      </button>
    </div>

    {/* Bottom Indicator Dots */}
    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
      {hostelImages.map((_: string, i: number) => (
        <div 
          key={i} 
          className={`h-1 rounded-full transition-all duration-500 ${i === activeImageIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`} 
        />
      ))}
    </div>
  </div>

  {/* DESKTOP VIEW: Cinematic Bento Grid */}
  <div className="hidden md:grid grid-cols-4 gap-4 h-[550px]">
    {/* Major Focus Image */}
    <div 
      className="md:col-span-2 rounded-[3.5rem] overflow-hidden border border-white/5 relative group cursor-pointer shadow-2xl" 
      onClick={() => setIsImageLightboxOpen(true)}
    >
      <img 
        src={hostelImages[0]} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out" 
        alt="Main View" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12">
        <h4 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-2 translate-y-4 group-hover:translate-y-0 transition-transform">Explore Atmosphere</h4>
        <span className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
          <Maximize2 size={16}/> Click to expand 360°
        </span>
      </div>
    </div>

    {/* Secondary Vertical Stack */}
    <div className="grid grid-rows-2 gap-4 md:col-span-1">
       <div className="rounded-[2.5rem] overflow-hidden border border-white/5 group cursor-pointer relative shadow-xl">
          <img 
            src={hostelImages[1] || hostelImages[0]} 
            className="w-full h-full object-cover group-hover:rotate-1 group-hover:scale-110 transition-transform duration-700" 
            alt="Interior" 
          />
          <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
       <div className="rounded-[2.5rem] overflow-hidden border border-white/5 group cursor-pointer relative shadow-xl">
          <img 
            src={hostelImages[2] || hostelImages[0]} 
            className="w-full h-full object-cover group-hover:-rotate-1 group-hover:scale-110 transition-transform duration-700" 
            alt="Amenities" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
       </div>
    </div>

    {/* Last Call-to-Action Grid Item */}
    <div 
      className="rounded-[2.5rem] overflow-hidden border border-white/5 relative group cursor-pointer shadow-xl"
      onClick={() => setIsImageLightboxOpen(true)}
    >
      <img 
        src={hostelImages[3] || hostelImages[0]} 
        className="w-full h-full object-cover group-hover:scale-125 blur-[1px] group-hover:blur-0 transition-all duration-1000" 
        alt="Gallery View" 
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617]/40 backdrop-blur-[4px] group-hover:backdrop-blur-none group-hover:bg-transparent transition-all duration-500">
        <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 group-hover:scale-90 group-hover:bg-indigo-600 transition-all shadow-2xl">
          <LayoutGrid size={32} className="text-white" />
        </div>
        <p className="mt-4 text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100">+{hostelImages.length - 4} More</p>
      </div>
    </div>
  </div>
</section>

      <main className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          
          {/* PRIMARY INFO */}
          <section>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-[#6366F1] bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
                <ShieldCheck size={14} strokeWidth={3} />
                <span className="font-black tracking-[0.2em] text-[9px] uppercase italic">Verified Partner</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={14} strokeWidth={3} />
                <span className="font-black tracking-[0.2em] text-[9px] uppercase italic">Inspected Housing</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-6">
                  {hostel.name}
                </h1>
                <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3 text-slate-400 group cursor-help">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-indigo-500/50 transition-colors"><MapPin size={18} className="text-[#6366F1]" /></div>
                        <span className="text-sm font-bold tracking-tight">{hostel.address}</span>
                    </div>
                    <div className="flex items-center gap-4 bg-amber-500/10 px-5 py-2 rounded-[1.2rem] border border-amber-500/20">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < Math.floor(reviewData?.stats.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-amber-900"} />
                          ))}
                        </div>
                        <div className="h-4 w-px bg-amber-500/20"></div>
                        <span className="text-[14px] font-black text-amber-300">{reviewData?.stats.averageRating || "0.0"}</span>
                        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">({reviewData?.stats.totalReviews} Students)</span>
                    </div>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-base leading-relaxed max-w-2xl font-medium border-l-2 border-indigo-500/30 pl-8 italic">
              {hostel.description || "Premium student accommodation offering secure living spaces, modern facilities, and a vibrant community atmosphere tailored for academic success."}
            </p>
          </section>

          {/* BUILDING AMENITIES - DYNAMIC LIST */}
          <section className="bg-slate-900/10 border border-slate-800/40 p-10 rounded-[3.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
              <Sparkles size={120} />
            </div>
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl"><Layers size={22} className="text-indigo-400" /></div>
                <div>
                  <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Building Amenities</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Facilities provided for all residents</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAmenitiesModalOpen(true)}
                className="text-[9px] font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-500/30 pb-1 hover:text-white transition-colors"
              >
                View Full Spec
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hostelAmenities && hostelAmenities.length > 0 ? (
                hostelAmenities.slice(0, 8).map((amenity: any, idx: number) => (
                  <div key={idx} className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
                    <div className="text-indigo-400 bg-indigo-500/10 p-3 rounded-full">
                      {getAmenityIcon(amenity.name)}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{amenity.name}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 text-center border-2 border-dashed border-slate-800/40 rounded-[2rem]">
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Amenities Data Loading...</p>
                </div>
              )}
            </div>
          </section>

          {/* UNIT CATEGORIES & AVAILABILITY */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {typeBreakdown.map((item, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden" onClick={() => setSelectedType(item.type)}>
                <div className="absolute -top-4 -right-4 bg-indigo-500/10 p-12 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-white font-black italic uppercase text-2xl mb-1 tracking-tight">{item.type}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.available > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.available} Units Available</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#6366F1] font-black italic text-2xl tracking-tighter">KES {parseFloat(item.price).toLocaleString()}</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase">/ Semester</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap gap-2 relative z-10">
                   {item.amenities.slice(0, 3).map((am: any, i: number) => (
                     <span key={i} className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 bg-slate-950 rounded-lg">{am.name || am}</span>
                   ))}
                </div>
              </div>
            ))}
          </section>

          {/* UNIT BROWSER ENGINE */}
          <div className="bg-slate-900/20 border border-slate-800/50 p-10 rounded-[4rem] relative shadow-inner">
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/10 shadow-lg shadow-indigo-500/5">
                    <LayoutGrid size={22} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Inventory Browser</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Live occupancy status across all floors</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                    <input 
                      type="text" 
                      placeholder="Room number..." 
                      className="bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-10 pr-6 text-[10px] font-black text-white w-40 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" 
                      onChange={(e) => handleFilterChange('search', e.target.value)} 
                    />
                  </div>
                  
                  <select 
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors outline-none cursor-pointer" 
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    value={selectedType}
                  >
                    {roomTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'Every Type' : t}</option>)}
                  </select>

                  <select 
                    className="bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors outline-none cursor-pointer" 
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <option value="Label">Sort by No.</option>
                    <option value="Price (Low)">Price (Low)</option>
                    <option value="Price (High)">Price (High)</option>
                  </select>
                </div>
              </div>

              {/* GRID VISUALIZER */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                {paginatedRooms.length > 0 ? (
                  paginatedRooms.map((room: any) => {
                    const isFull = room.status === 'Full';
                    const isSelected = selectedRoomId === room.id;
                    return (
                      <button 
                        key={room.id}
                        disabled={isFull}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`
                          group relative aspect-[4/5] rounded-[2.5rem] border-2 flex flex-col items-center justify-between p-6 transition-all duration-500
                          ${isSelected 
                            ? 'bg-indigo-600 border-indigo-400 -translate-y-2 shadow-2xl shadow-indigo-500/40 text-white' 
                            : isFull 
                              ? 'bg-slate-950/40 border-slate-900 opacity-30 grayscale cursor-not-allowed' 
                              : 'bg-slate-950 border-slate-800 hover:border-indigo-500/40 hover:-translate-y-1 text-slate-400'
                          }
                        `}
                      >
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isSelected ? 'text-indigo-200' : 'text-slate-600'}`}>
                          {room.floor}
                        </span>
                        
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-3xl font-black italic tracking-tighter ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                            {room.label.split(' ').pop()}
                          </span>
                          <div className={`h-0.5 w-6 transition-all ${isSelected ? 'bg-white' : 'bg-slate-800 group-hover:w-10 group-hover:bg-indigo-500'}`}></div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[7px] font-black uppercase tracking-[0.2em]">{room.type}</span>
                          {isSelected && <div className="absolute -bottom-2 px-3 py-1 bg-white text-indigo-600 rounded-lg font-black text-[7px] uppercase tracking-widest shadow-xl">Selected</div>}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full py-20 text-center bg-slate-950/40 rounded-[3rem] border-2 border-dashed border-slate-900">
                    <div className="mb-4 text-slate-700 flex justify-center"><Search size={40} strokeWidth={1} /></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">No units match your current filters</p>
                  </div>
                )}
              </div>

              {/* PAGINATION CONTROLS */}
              {filteredRooms.length > roomsPerPage && (
                <div className="flex items-center justify-center gap-4 pt-6">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-20 transition-all text-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page {currentPage} of {Math.ceil(filteredRooms.length / roomsPerPage)}</span>
                  <button 
                    disabled={currentPage === Math.ceil(filteredRooms.length / roomsPerPage)}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-20 transition-all text-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STUDENT COMMUNITY BOARD */}
         <section className="space-y-10">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Latest Feedback</h3>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">The most recent verified student experience</p>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={() => setIsCreateReviewOpen(true)} 
        className="flex items-center gap-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
      >
        <Plus size={16} strokeWidth={3} /> Post Review
      </button>
      
      {/* Browsing logic moved here to access the "Archive" */}
      {reviewData?.reviews && reviewData.reviews.length > 1 && (
        <button 
          onClick={() => setIsAllReviewsOpen(true)} 
          className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all shadow-lg"
        >
          View Archive ({reviewData.reviews.length})
        </button>
      )}
    </div>
  </div>

  <div className="grid grid-cols-1 gap-8">
    {!reviewData?.reviews || reviewData.reviews.length === 0 ? (
      <div className="py-20 border-2 border-dashed border-slate-800/60 rounded-[3.5rem] text-center flex flex-col items-center">
        <MessageSquare size={40} className="text-slate-800 mb-4" />
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Be the first to share your experience</p>
      </div>
    ) : (
      [...reviewData.reviews]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 1)
        .map((review: any) => (
          <div key={review.id} className="bg-gradient-to-br from-slate-900/40 to-transparent border border-slate-800/50 p-10 rounded-[3.5rem] relative group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
            <Quote size={80} className="absolute top-8 right-10 text-indigo-500 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
            
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex gap-1 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/10">
                {[...Array(5)].map((_, i: number) => (
                  <Star key={i} size={14} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10">
                <Clock size={12} />
                Latest Entry: {new Date(review.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <h4 className="text-white font-black text-2xl mb-5 uppercase italic tracking-tighter leading-tight">{review.title}</h4>
            <p className="text-slate-400 text-lg font-medium italic leading-[1.8] mb-12 max-w-3xl border-l-2 border-slate-800 pl-8">
              "{review.comment}"
            </p>
            
            <div className="flex flex-wrap items-center justify-between pt-10 border-t border-slate-800/40 gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#020617] border border-slate-800 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                  <UserCircle size={32} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest italic">Verified Student</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1">Nyahururu Campus</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                   onClick={() => handleLikeReview(review.id)}
                   className="flex items-center gap-3 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all group/btn"
                >
                  <ThumbsUp size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-black tracking-widest">{review.helpfulCount || 0}</span>
                </button>

                <button 
                   onClick={() => handleReportClick(review.id)}
                   className="p-3 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                >
                  <Flag size={16} />
                </button>

                {review.ownerReply && (
                    <button 
                      onClick={() => setExpandedReplyId(expandedReplyId === review.id ? null : review.id)}
                      className="bg-[#020617] px-6 py-3 rounded-2xl text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl"
                    >
                        {expandedReplyId === review.id ? 'Close Response' : 'Official Reply'} 
                        <ChevronDown size={16} className={`transition-transform duration-500 ${expandedReplyId === review.id ? 'rotate-180' : ''}`} />
                    </button>
                )}
              </div>
            </div>

            {expandedReplyId === review.id && review.ownerReply && (
              <div className="mt-10 p-10 bg-indigo-500/5 border-l-4 border-indigo-600 rounded-r-[2.5rem] animate-in slide-in-from-top-6 duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HardHat size={60} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <ShieldCheck size={14} />
                  </div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Management Statement</p>
                </div>
                <p className="text-base text-slate-300 font-medium italic leading-relaxed border-l border-white/5 pl-6">
                  "{review.ownerReply}"
                </p>
              </div>
            )}
          </div>
        ))
    )}
  </div>
</section>
        </div>

        {/* --- DYNAMIC SIDEBAR BOOKING INTERFACE --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            <div className="p-10 bg-[#6366F1] rounded-[4rem] shadow-2xl shadow-indigo-500/30 text-white overflow-hidden group relative">
              {/* DECORATIVE ELEMENTS */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-[2s]"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20">
                    <p className="text-[9px] font-black uppercase flex items-center gap-3 tracking-[0.15em]">
                      <span className={`w-2 h-2 rounded-full ${selectedRoom ? 'bg-emerald-300 animate-pulse' : 'bg-white/40'}`}></span>
                      {selectedRoom ? "Live Inventory" : "Market Overview"}
                    </p>
                  </div>
                  <button 
                    onClick={handleShareHostel} 
                    className="bg-white/10 p-3 rounded-full hover:bg-white text-white hover:text-[#6366F1] transition-all shadow-xl active:scale-90"
                  >
                    <Share2 size={18}/>
                  </button>
                </div>

                <div className="flex flex-col mb-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Price Estimate</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none">
                      KES {parseFloat(selectedRoom ? selectedRoom.price : roomMetrics.minPrice).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{selectedRoom?.billingCycle || 'Per Sem'}</span>
                  </div>
                </div>

                {selectedRoom ? (
                  <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Active Unit</p>
                          <p className="text-lg font-black italic tracking-tight">{selectedRoom.label}</p>
                        </div>
                        <DoorOpen size={24} className="opacity-40" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
                          <p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Level</p>
                          <p className="text-sm font-black italic tracking-tight">{selectedRoom.floor}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
                          <p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">Spaces</p>
                          <p className="text-sm font-black italic tracking-tight">{selectedRoom.totalSlots} Slots</p>
                        </div>
                      </div>

                      {/* ROOM SPECIFIC AMENITIES */}
                      {(selectedRoom.amenities || []).length > 0 && (
                        <div className="bg-slate-950/20 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5">
                           <p className="text-[9px] font-black uppercase opacity-60 mb-3 tracking-widest">Room Features</p>
                           <div className="flex flex-wrap gap-2">
                              {(selectedRoom.amenities || []).map((am: any, i: number) => (
                                <span key={i} className="bg-white/10 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/5">{am.name || am}</span>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-[3.5rem] mb-10 bg-white/5 group-hover:bg-white/10 transition-colors">
                      <div className="p-4 bg-white/10 rounded-3xl mb-4 group-hover:scale-110 transition-transform"><DoorOpen size={36} strokeWidth={1.5} /></div>
                      <p className="text-[10px] font-black uppercase text-center tracking-[0.3em] opacity-80 px-10 leading-relaxed">Select a specific unit from the browser to unlock reservation</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button 
                    onClick={handleReservation} 
                    disabled={!selectedRoom} 
                    className={`
                      w-full font-black py-7 rounded-[2.5rem] uppercase text-[12px] tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl
                      ${selectedRoom 
                        ? 'bg-white text-[#6366F1] hover:scale-[1.02] hover:shadow-white/20 active:scale-95' 
                        : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
                      }
                    `}
                  >
                    {selectedRoom ? (
                      <>Reserve Unit <MessageCircle size={20} fill="currentColor" /></>
                    ) : (
                      <>Pick a Room to Start <ArrowRight size={20} /></>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleCallManager} 
                      className="bg-slate-950/30 border border-white/10 text-white font-black py-5 rounded-[2rem] uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-[#6366F1] transition-all shadow-lg active:scale-95"
                    >
                      <Phone size={16}/> Voice Call
                    </button>
                    <button 
                      onClick={handleEmailInquiry} 
                      className="bg-slate-950/30 border border-white/10 text-white font-black py-5 rounded-[2rem] uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-[#6366F1] transition-all shadow-lg active:scale-95"
                    >
                      <Mail size={16}/> Email Mgr
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECONDARY SIDEBAR WIDGET */}
          </div>
        </div>
      </main>

      {/* --- MODAL: ALL REVIEWS MODAL --- */}
      {isAllReviewsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-[#0B0F1A] border border-slate-800 w-full max-w-2xl max-h-[85vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(99,102,241,0.1)]">
            <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 relative">
               <div className="absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
               <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Student Feedback</h2>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Showing {reviewData?.reviews.length} authentic entries</p>
               </div>
               <button onClick={() => setIsAllReviewsOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-rose-500/20 hover:text-rose-500 transition-all active:scale-90"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
              {reviewData?.reviews.map((review: any) => (
                <div key={review.id} className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2.5rem] group hover:border-indigo-500/40 transition-colors">
                  <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                    <div className="flex gap-1 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/10">
                      {[...Array(5)].map((_, i) => (<Star key={i} size={10} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />))}
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => handleLikeReview(review.id)} className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                          <ThumbsUp size={12}/> {review.helpfulCount || 0}
                        </button>
                        <button onClick={() => handleReportClick(review.id)} className="text-slate-700 hover:text-rose-500 transition-colors"><Flag size={12}/></button>
                    </div>
                  </div>
                  <h4 className="text-white font-black text-base mb-3 uppercase italic tracking-tight">{review.title}</h4>
                  <p className="text-slate-400 text-xs font-medium italic leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: AMENITIES FULL SPECS --- */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="bg-[#0B0F1A] border border-slate-800 w-full max-w-4xl rounded-[4rem] p-12 overflow-hidden shadow-2xl relative">
            <button onClick={() => setIsAmenitiesModalOpen(false)} className="absolute top-10 right-10 p-4 bg-white/5 rounded-full hover:bg-rose-500/20 transition-all"><X size={24}/></button>
            
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Full Building Specifications</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Inventory details & resident facilities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-h-[60vh] overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-slate-800">
              <div className="space-y-10">
                <div className="bg-slate-900/30 p-8 rounded-[3rem] border border-slate-800/60">
                  <h3 className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-3">
                    <Shield size={18} /> Safety & Security
                  </h3>
                  <div className="space-y-4">
                    {['24/7 CCTV Monitoring', 'Biometric Gate Access', 'Fire Extinguishers', 'On-site Security Guard', 'Emergency Alarm System'].map((s, i) => (
                      <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-slate-900/30 p-8 rounded-[3rem] border border-slate-800/60">
                  <h3 className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-3">
                    <Zap size={18} /> Utilities & Tech
                  </h3>
                  <div className="space-y-4">
                    {['High-speed Mesh WiFi', 'Tokenized Electricity', 'Solar Backup Water Heating', 'Dedicated Reading Room', 'Common Laundry Area'].map((s, i) => (
                      <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800 flex justify-center">
              <button onClick={() => setIsAmenitiesModalOpen(false)} className="bg-white text-[#0B0F1A] font-black px-12 py-5 rounded-[2rem] text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Close Browser</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: REPORT SYSTEM --- */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0B0F1A] border border-slate-800 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 pb-4 flex justify-between items-start">
              <div className="p-4 bg-rose-500/10 rounded-2xl">
                <AlertTriangle className="text-rose-500" size={28} />
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="px-10 pb-10 space-y-8">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Flag Content</h3>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-2 leading-relaxed">Our moderators will manually review this entry to ensure community standards.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Violation Type</label>
                  <select 
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choose a category...</option>
                    <option value="Spam">Spam or Misleading</option>
                    <option value="Harassment">Harassment / Hate Speech</option>
                    <option value="Inappropriate">Inappropriate Language</option>
                    <option value="Fake">Fake Review / Bias</option>
                    <option value="Other">Other Violation</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Evidence / Context</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly explain why this content violates community guidelines..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xs font-medium text-white focus:ring-1 focus:ring-rose-500 outline-none transition-all resize-none placeholder:text-slate-800"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={submitReport}
                disabled={isReporting}
                className="w-full bg-rose-600 hover:bg-rose-500 py-6 rounded-[2.2rem] text-white font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-4 transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-rose-600/20"
              >
                {isReporting ? <Loader2 className="animate-spin" size={20}/> : <><ShieldAlert size={20}/> Submit Incident</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE REVIEW MODAL --- */}
      {isCreateReviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[4rem] p-12 space-y-10 relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px]"></div>
            
            <button onClick={() => setIsCreateReviewOpen(false)} className="absolute top-10 right-10 p-3 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
            
            <div className="text-center">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">Share Experience</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Authenticity keeps Unihaven safe</p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Property Rating</label>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star size={32} className={`${star <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-800"} transition-colors`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Subject Line</label>
                <input 
                  type="text" 
                  placeholder="e.g., Comfortable and Secure..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] px-8 py-5 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800" 
                  value={reviewForm.title} 
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Detailed Comment</label>
                <textarea 
                  rows={5} 
                  placeholder="Share details about amenities, management responsiveness, and safety..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 text-xs font-medium text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-800 leading-relaxed" 
                  value={reviewForm.comment} 
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} 
                />
              </div>

              <button 
                onClick={handlePostReview} 
                disabled={isPosting} 
                className="w-full bg-[#6366F1] py-7 rounded-[2.5rem] text-white font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isPosting ? <Loader2 className="animate-spin" size={22}/> : <><Send size={20}/> Publish To Board</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX MODAL --- */}
      {isImageLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4">
          <button 
            onClick={() => setIsImageLightboxOpen(false)} 
            className="absolute top-10 right-10 text-white hover:text-indigo-400 p-4 transition-colors"
          >
            <X size={36} />
          </button>
          
          <div className="max-w-6xl w-full flex items-center justify-between gap-8">
            <button onClick={() => setActiveImageIndex(p => (p - 1 + hostelImages.length) % hostelImages.length)} className="text-white/40 hover:text-white transition-colors p-6 bg-white/5 rounded-full"><ChevronLeft size={48}/></button>
            <div className="flex-1 text-center">
              <img src={hostelImages[activeImageIndex]} className="max-h-[80vh] mx-auto rounded-3xl shadow-[0_0_100px_rgba(99,102,241,0.2)] object-contain" alt="Lightbox" />
             <div className="mt-10 flex justify-center gap-3">
  {hostelImages.map((img: string, i: number) => (
    <button 
      key={i} 
      type="button" // Accessibility best practice
      onClick={() => setActiveImageIndex(i)}
      aria-label={`Go to slide ${i + 1}`} // Improves SEO and accessibility
      className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
        i === activeImageIndex 
          ? 'w-12 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
          : 'w-4 bg-white/10 hover:bg-white/30'
      }`}
    />
  ))}
</div>
            </div>
            <button onClick={() => setActiveImageIndex(p => (p + 1) % hostelImages.length)} className="text-white/40 hover:text-white transition-colors p-6 bg-white/5 rounded-full"><ChevronRight size={48}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelDetailsPage;