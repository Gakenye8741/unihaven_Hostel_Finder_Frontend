import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Home, 
  RefreshCcw, 
  Search, 
  ShieldAlert 
} from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6 py-24 selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full relative z-10 text-center">
        
        {/* ERROR CODE GRAPHIC */}
        <div className="relative mb-12">
          <h1 className="text-[12rem] md:text-[16rem] font-black text-white/5 leading-none tracking-tighter italic select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] backdrop-blur-3xl shadow-2xl animate-in zoom-in duration-700">
              <ShieldAlert size={80} className="text-indigo-500" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-indigo-500 mb-4">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Exception</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              Resource <span className="text-indigo-600">Not Found</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-md mx-auto leading-relaxed">
              The coordinate you are looking for has been moved, deleted, or never existed in our marketplace database.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-500/50 transition-all active:scale-95 shadow-2xl"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
            >
              <Home size={16} /> Marketplace Home
            </button>
          </div>

          {/* FOOTER OPTIONS */}
          <div className="pt-12 border-t border-slate-800/50 flex flex-col items-center gap-4">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Alternatively, try these</p>
             <div className="flex gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  <RefreshCcw size={18} />
                </button>
                <button 
                  onClick={() => navigate('/search')}
                  className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  <Search size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;