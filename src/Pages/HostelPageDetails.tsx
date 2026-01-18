import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetHostelByIdQuery } from '../features/Apis/Hostel.Api';
import { useListRoomsByHostelQuery } from '../features/Apis/Rooms.Api'; 
import { useGetHostelGalleryQuery } from '../features/Apis/Media.Api';
// --- UPDATED IMPORTS ---
import { useGetHostelReviewsQuery, useCreateReviewMutation } from '../features/Apis/Review.Api';
import Navbar from '../Components/Navbar';
import { 
  MapPin, ShieldCheck, Loader2, CheckCircle2, DoorOpen, 
  Search, ChevronLeft, ChevronRight, LayoutGrid, Users, Hash, Share2,Mail , Star,
  ArrowRight, Phone, CreditCard, MessageSquare, Quote, UserCircle, X, Send, Plus,
  ChevronDown // Added for dropdown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '../App/store';

const HostelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 20; 

  // --- NEW UI STATES ---
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [expandedReplyId, setExpandedReplyId] = useState<string | null>(null); // For Management Dropdown

  // --- API QUERIES ---
  const { data: hostel, isLoading: hostelLoading, isError: hostelError } = useGetHostelByIdQuery(id || '');
  const { data: rooms, isLoading: roomsLoading } = useListRoomsByHostelQuery(id || '');
  const { data: gallery, isLoading: galleryLoading } = useGetHostelGalleryQuery(id || '');
  const { data: reviewData, isLoading: reviewsLoading } = useGetHostelReviewsQuery(id || '');
  const [createReview, { isLoading: isPosting }] = useCreateReviewMutation();

// 1. AT THE TOP OF YOUR COMPONENT (Outside any functions)
const { user } = useSelector((state: RootState) => state.auth);
const studentName = user?.username ||  "a student";

// --- WhatsApp Reservation ---
const handleReservation = () => {
  if (!selectedRoom) return toast.error("Please select a room first! 🏢");
  
  const whatsappNumber = hostel?.owner?.whatsappPhone;
  if (!whatsappNumber) {
    return toast.error("Hostel owner hasn't provided a WhatsApp number. 📲");
  }

  const message = `🌟 *NEW RESERVATION INQUIRY*

Hello, my name is *${studentName}*. I found your property, *${hostel?.name}*, on Unihaven Hostel Finder.

I am interested in reserving the following unit:
━━━━━━━━━━━━━━━━━━
📍 *Room:* ${selectedRoom.label}
🛏️ *Type:* ${selectedRoom.type}
🏢 *Floor:* ${selectedRoom.floor}
💰 *Price:* KES ${parseFloat(selectedRoom.price).toLocaleString()}
📅 *Rate:* ${selectedRoom.billingCycle}
━━━━━━━━━━━━━━━━━━

Is this unit still available for booking? I'd appreciate more details on the next steps. 

Thank you!`;

  const cleanNumber = whatsappNumber.replace(/\D/g, ''); 
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
};

// --- Call Manager ---
const handleCallManager = () => {
  const owner = hostel?.owner;
  if (!owner?.phone) {
    return toast.error("Contact details for this manager are not available yet. 📞");
  }

  const cleanPhone = owner.phone.replace(/\s+/g, '');
  toast.success(`Dialing ${owner.fullName}...`);
  window.open(`tel:${cleanPhone}`);
};

// --- Email Inquiry ---
const handleEmailInquiry = () => {
  if (!selectedRoom) return toast.error("Select a room to inquire via email! 📧");
  
  const ownerEmail = hostel?.owner?.email;
  if (!ownerEmail) return toast.error("Owner email address not found. 📩");

  const subject = encodeURIComponent(`Booking Inquiry: ${hostel?.name} - ${selectedRoom.label}`);
  const body = encodeURIComponent(
    `Hello ${hostel?.owner?.fullName || 'Manager'},\n\n` +
    `My name is ${studentName}. I am inquiring about the availability of ${selectedRoom.label} at ${hostel?.name}.\n\n` +
    `Unit Details:\n` +
    `- Type: ${selectedRoom.type}\n` +
    `- Price: KES ${parseFloat(selectedRoom.price).toLocaleString()} / ${selectedRoom.billingCycle}\n\n` +
    `Please let me know the requirements for securing this unit.\n\n` +
    `Best regards,\n${studentName}\nSent via Unihaven.`
  );

  window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
};

// --- Smart Share ---
const handleShareHostel = async () => {
  const shareData = {
    title: `Check out ${hostel?.name}`,
    text: `Hey! Look at this hostel I found on Unihaven: ${hostel?.name} at ${hostel?.campus}.`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 📋");
    }
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  // --- REVIEW SUBMISSION HANDLER ---
  const handlePostReview = async () => {
    if (!reviewForm.title || !reviewForm.comment) return toast.error("Please fill all fields");
    try {
      await createReview({
        hostelId: id,
        title: reviewForm.title,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }).unwrap();
      
      toast.success("Review published!");
      setIsCreateReviewOpen(false);
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch (err) {
      toast.error("Failed to post review");
    }
  };

  const selectedRoom = useMemo(() => 
    rooms?.find((r: any) => r.id === selectedRoomId), 
  [rooms, selectedRoomId]);

  const hostelImages = useMemo(() => {
    if (gallery && gallery.length > 0) {
      return gallery.filter((m: any) => m.type === 'Image').map((m: any) => m.url);
    }
    return [
      "https://images.unsplash.com/photo-1555854817-5b2247a8175f",
      "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb"
    ];
  }, [gallery]);

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % hostelImages.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + hostelImages.length) % hostelImages.length);

  const { filteredRooms, roomMetrics, floors, roomTypes, typeBreakdown } = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return { filteredRooms: [], roomMetrics: { minPrice: "0", totalAvailable: 0 }, floors: ["All"], roomTypes: ["All"], typeBreakdown: [] };
    }
    const prices = rooms.map((r: any) => parseFloat(r.price) || 0);
    const uniqueFloors = ["All", ...Array.from(new Set(rooms.map((r: any) => r.floor))).filter(Boolean)];
    const uniqueTypes = ["All", ...Array.from(new Set(rooms.map((r: any) => r.type))).filter(Boolean)];
    const breakdown = Array.from(new Set(rooms.map((r: any) => r.type))).map(type => {
        const typeRooms = rooms.filter((r: any) => r.type === type);
        const available = typeRooms.filter((r: any) => r.status !== 'Full').length;
        return { type, count: typeRooms.length, available, price: typeRooms[0].price };
    });
    const filtered = rooms.filter((room: any) => {
      const matchesSearch = room.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFloor = selectedFloor === "All" || room.floor === selectedFloor;
      const matchesType = selectedType === "All" || room.type === selectedType;
      return matchesSearch && matchesFloor && matchesType;
    });
    return { filteredRooms: filtered, floors: uniqueFloors, roomTypes: uniqueTypes, typeBreakdown: breakdown, roomMetrics: { minPrice: Math.min(...prices).toString() }};
  }, [rooms, searchTerm, selectedFloor, selectedType]);

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * roomsPerPage;
    return filteredRooms.slice(startIndex, startIndex + roomsPerPage);
  }, [filteredRooms, currentPage]);

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handleFilterChange = (type: 'floor' | 'type' | 'search', value: string) => {
    if (type === 'floor') setSelectedFloor(value);
    if (type === 'type') setSelectedType(value);
    if (type === 'search') setSearchTerm(value);
    setCurrentPage(1);
  };

  if (hostelLoading || roomsLoading || galleryLoading || reviewsLoading) return (
    <div className="h-screen bg-[#0B0F1A] flex flex-col items-center justify-center">
      <Loader2 className="text-[#6366F1] animate-spin mb-4" size={40} />
      <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black">Syncing Room Inventory...</p>
    </div>
  );

  if (hostelError || !hostel) return (
    <div className="h-screen bg-[#0B0F1A] flex items-center justify-center text-white font-black uppercase italic">Hostel Not Found</div>
  );

  return (
    <div className="bg-[#0B0F1A] min-h-screen pb-20 selection:bg-indigo-500/30">
      <Navbar />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="md:hidden relative h-[300px] w-full rounded-[2.5rem] overflow-hidden border border-slate-800">
          <img src={hostelImages[activeImageIndex]} className="w-full h-full object-cover transition-opacity duration-500" alt="Hostel" />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button onClick={prevImage} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white"><ChevronLeft size={20}/></button>
            <button onClick={nextImage} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-4 gap-4 h-[400px]">
          <div className="md:col-span-2 rounded-[2.5rem] overflow-hidden border border-slate-800">
            <img src={hostelImages[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Main" />
          </div>
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <div className="rounded-[2rem] overflow-hidden border border-slate-800">
                <img src={hostelImages[1] || hostelImages[0]} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
             </div>
             <div className="rounded-[2rem] overflow-hidden border border-slate-800">
                <img src={hostelImages[2] || hostelImages[0]} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
             </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-slate-800">
            <img src={hostelImages[3] || hostelImages[0]} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* HOSTEL HEADER INFO */}
          <section>
            <div className="flex items-center gap-3 text-[#6366F1] mb-4">
              <ShieldCheck size={20} />
              <span className="font-black tracking-[0.3em] text-[10px] uppercase italic">Verified Student Housing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">{hostel.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={16} className="text-[#6366F1]" />
                    <span className="text-sm font-medium">{hostel.address}</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
               
  const body = encodeURIComponent(     <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-black text-amber-300">{reviewData?.stats.averageRating || "0.0"}</span>
                    <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest ml-1">({reviewData?.stats.totalReviews} Reviews)</span>
                </div>
            </div>
          </section>

          {/* ROOM TYPE BREAKDOWN SECTION */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {typeBreakdown.map((item, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div>
                  <h4 className="text-white font-black italic uppercase text-lg leading-none mb-1">{item.type}</h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.available} Units Vacant</p>
                </div>
                <div className="text-right">
                  <p className="text-[#6366F1] font-black italic text-xl">KES {parseFloat(item.price).toLocaleString()}</p>
                  <p className="text-slate-600 text-[8px] font-black uppercase">Standard Rate</p>
                </div>
              </div>
            ))}
          </section>

          {/* UNIT BROWSER */}
          <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-[3rem]">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <LayoutGrid size={18} className="text-indigo-400" />
                  </div>
                  <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Room Catalog</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                    <input 
                      type="text" 
                      placeholder="Find Room..." 
                      className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-8 pr-4 text-[10px] text-white outline-none focus:border-indigo-500 transition-all w-32"
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                  <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase text-slate-400 outline-none" onChange={(e) => handleFilterChange('type', e.target.value)}>
                    {roomTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
                  </select>
                  <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase text-slate-400 outline-none" onChange={(e) => handleFilterChange('floor', e.target.value)}>
                    {floors.map(f => <option key={f} value={f}>{f === "All" ? "All Floors" : f}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {paginatedRooms.map((room: any) => {
                  const remaining = room.totalSlots - room.occupiedSlots;
                  const isFull = room.status === 'Full' || remaining <= 0;
                  const isSelected = selectedRoomId === room.id;

                  return (
                    <button 
                      key={room.id}
                      onClick={() => !isFull && setSelectedRoomId(room.id)}
                      className={`aspect-[4/5] rounded-3xl border flex flex-col items-center justify-between p-4 transition-all duration-300 relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-500/30 -translate-y-1' 
                          : isFull 
                            ? 'bg-slate-900/20 border-slate-800 opacity-20 cursor-not-allowed grayscale' 
                            : 'bg-slate-950 border-slate-800 hover:border-slate-500 hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-full flex justify-between items-start">
                         <div className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                         <span className={`text-[8px] font-black uppercase ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{room.floor}</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-black italic tracking-tighter leading-none ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {room.label.split(' ').pop()}
                        </span>
                        <span className={`text-[7px] font-black uppercase mt-1 tracking-widest ${isSelected ? 'text-indigo-200' : 'text-indigo-500'}`}>
                          {room.type}
                        </span>
                      </div>

                      <div className={`text-[8px] font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-600'}`}>
                        {room.billingCycle?.toLowerCase().includes('sem') ? 'SEM' : 'MO'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Section {currentPage} of {totalPages}</span>
                  <div className="flex gap-3">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors disabled:opacity-20"><ChevronLeft size={20} /></button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors disabled:opacity-20"><ChevronRight size={20} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✍️ STUDENT REVIEWS SECTION */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic leading-none">Student Feedback</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Authentic Community Reviews</p>
                </div>
              </div>
              <div className="flex gap-4">
                  <button 
                    onClick={() => setIsCreateReviewOpen(true)}
                    className="flex items-center gap-2 bg-[#6366F1] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    <Plus size={14} /> Write Review
                  </button>
                  {reviewData?.reviews && reviewData.reviews.length > 1 && (
                    <button 
                      onClick={() => setIsAllReviewsOpen(true)}
                      className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-500/30 pb-1"
                    >
                      See All ({reviewData.reviews.length})
                    </button>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {!reviewData?.reviews || reviewData.reviews.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-slate-800 rounded-[2.5rem] text-center">
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No reviews yet.</p>
                </div>
              ) : (
                [reviewData.reviews[0]].map((review) => (
                  <div key={review.id} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] relative group">
                    <Quote size={40} className="absolute top-6 right-8 text-white/5" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />
                      ))}
                    </div>
                    <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wide italic">{review.title}</h4>
                    <p className="text-slate-400 text-sm italic leading-relaxed mb-6">"{review.comment}"</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/40">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                           <UserCircle size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Resident</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold text-slate-700">{new Date(review.createdAt).toLocaleDateString()}</span>
                        
                        {/* MANAGEMENT DROPDOWN BUTTON */}
                        {review.ownerReply && (
                            <button 
                              onClick={() => setExpandedReplyId(expandedReplyId === review.id ? null : review.id)}
                              className="flex items-center gap-1 text-[#6366F1] text-[9px] font-black uppercase tracking-widest hover:opacity-70"
                            >
                                {expandedReplyId === review.id ? 'Hide Reply' : 'View Reply'} 
                                <ChevronDown size={12} className={`transition-transform duration-300 ${expandedReplyId === review.id ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                      </div>
                    </div>

                    {/* MANAGEMENT RESPONSE CONTENT (DROPDOWN) */}
                    {expandedReplyId === review.id && review.ownerReply && (
                      <div className="mt-6 p-6 bg-indigo-500/5 border-l-2 border-indigo-500 rounded-r-3xl animate-in slide-in-from-top-4 duration-300">
                        <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Management Response</p>
                        <p className="text-xs text-slate-300 font-medium italic leading-relaxed">"{review.ownerReply}"</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR BOOKING CARD */}
<div className="lg:col-span-1">
  <div className="sticky top-32 p-8 bg-[#6366F1] rounded-[3.5rem] shadow-2xl text-white overflow-hidden group transition-all duration-700">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
          <p className="text-[9px] font-black uppercase tracking-widest">
            {selectedRoom ? "Live Inventory" : "Pricing Guide"}
          </p>
        </div>
        <button 
          onClick={handleShareHostel}
          className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors border border-white/10"
          title="Share Hostel"
        >
          <Share2 size={16} />
        </button>
      </div>
      
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-4xl md:text-5xl font-black italic tracking-tighter">
          KES {parseFloat(selectedRoom ? selectedRoom.price : roomMetrics.minPrice).toLocaleString()}
        </span>
        <span className="text-sm font-bold opacity-60 uppercase">{selectedRoom?.billingCycle || 'Starting'}</span>
      </div>

      {selectedRoom ? (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 p-4 rounded-3xl border border-white/10">
              <div className="flex items-center gap-2 opacity-60 mb-1">
                <Hash size={12} />
                <span className="text-[8px] font-black uppercase">Room Label</span>
              </div>
              <p className="text-sm font-black italic">{selectedRoom.label}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl border border-white/10">
              <div className="flex items-center gap-2 opacity-60 mb-1">
                <Users size={12} />
                <span className="text-[8px] font-black uppercase">Occupancy</span>
              </div>
              <p className="text-sm font-black italic">{selectedRoom.totalSlots} Slots</p>
            </div>
          </div>
          <div className="bg-slate-950/20 p-4 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black uppercase opacity-60">Configuration</p>
              <p className="text-xs font-black italic uppercase tracking-wider">{selectedRoom.type} • {selectedRoom.floor}</p>
            </div>
            <CheckCircle2 className="text-indigo-200" size={20} />
          </div>
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-[2.5rem] mb-8 bg-white/5">
           <DoorOpen size={32} className="opacity-20 mb-3" />
           <p className="text-[10px] font-black uppercase opacity-40 text-center px-8 tracking-widest leading-relaxed">Select a specific unit from the browser to confirm availability</p>
        </div>
      )}

      <div className="space-y-3">
        {/* PRIMARY ACTION: WHATSAPP */}
        <button 
          onClick={handleReservation}
          disabled={!selectedRoom}
          className={`w-full font-black py-6 rounded-[2rem] uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
          selectedRoom 
            ? 'bg-white text-[#6366F1] hover:scale-[1.02] active:scale-95' 
            : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
        }`}>
          {selectedRoom ? 'Reserve via WhatsApp' : 'Choose Your Unit'} <ArrowRight size={18} />
        </button>

        {/* SECONDARY ACTIONS ROW */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleCallManager}
            className="bg-slate-950/20 border border-white/20 text-white font-black py-4 rounded-3xl uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
          >
            <Phone size={14} /> Call
          </button>
          <button 
            onClick={handleEmailInquiry}
            className="bg-slate-950/20 border border-white/20 text-white font-black py-4 rounded-3xl uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
          >
            <Mail size={14} /> Email
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 opacity-40">
           <CreditCard size={14} />
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Payments Supported</span>
        </div>
        
        {/* M-PESA LOGO PLACEHOLDER / TEXT */}
        <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5 w-full flex justify-center">
            <p className="text-[7px] font-black uppercase opacity-30 tracking-[0.3em]">M-PESA • VISA • MASTERCARD • BANK</p>
        </div>
      </div>
    </div>
    
    {/* COOL BACKGROUND DECORATION */}
    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
  </div>
</div>
      </main>

      {/* --- MODAL: ALL REVIEWS --- */}
      {isAllReviewsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#0B0F1A] border border-slate-800 w-full max-w-2xl max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
               <h2 className="text-2xl font-black text-white uppercase italic">Community Board</h2>
               <button onClick={() => setIsAllReviewsOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-rose-500 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {reviewData?.reviews.map((review: any) => (
                <div key={review.id} className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-3xl">
                   <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (<Star key={i} size={10} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-800"} />))}
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2 uppercase italic">{review.title}</h4>
                  <p className="text-slate-400 text-xs italic leading-relaxed">"{review.comment}"</p>
                  
                  {review.ownerReply && (
                      <div className="mt-4 p-4 bg-indigo-500/5 border-l-2 border-indigo-500 rounded-r-2xl">
                          <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mb-1">Management Response</p>
                          <p className="text-[11px] text-slate-400 italic">"{review.ownerReply}"</p>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE REVIEW --- */}
      {isCreateReviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[3rem] p-10 space-y-6 relative">
            <button onClick={() => setIsCreateReviewOpen(false)} className="absolute top-6 right-6 text-slate-500"><X size={20}/></button>
            
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase italic leading-none">Share Experience</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Verified Resident Feedback</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                    <Star size={24} className={star <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"} />
                  </button>
                ))}
              </div>
              
              <input 
                type="text" 
                placeholder="Review Title (e.g. Water Pressure)" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-indigo-500"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
              />

              <textarea 
                rows={4}
                placeholder="Write your detailed stay experience..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
              />

              <button 
                onClick={handlePostReview}
                disabled={isPosting}
                className="w-full bg-[#6366F1] py-5 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isPosting ? <Loader2 className="animate-spin" size={16}/> : <><Send size={16}/> Publish Experience</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelDetailsPage;