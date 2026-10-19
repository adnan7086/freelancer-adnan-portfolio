import React from 'react';
import { Home, ArrowLeft, MessageSquare } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#050814] flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 relative z-10">
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 mb-2">
          404
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          The requested page or campaign destination could not be located. It might have expired or been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:scale-102 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          <a
            href="https://wa.me/8801618058572"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Adnan</span>
          </a>
        </div>
      </div>
    </div>
  );
};
