import React from 'react';
import {
  MapPin,
  Clock,
  Compass,
  MessageSquare,
  Mail,
  ShieldCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '../types';

interface LocationSectionProps {
  settings: SiteSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const mapSearchQuery = encodeURIComponent(
    `${settings.village || 'Paragaon'}, ${settings.upazila || 'Bhaluka'}, ${settings.district || 'Mymensingh'}, ${settings.country || 'Bangladesh'}`
  );
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  return (
    <section id="location" className="py-20 relative bg-[#070b1a] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Operational Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Location & <span className="gradient-text">Headquarters</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Based in Bangladesh, serving client campaigns and affiliate networks worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Location Card Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{settings.brand_name || 'Freelancer Adnan'}</h3>
                  <p className="text-xs text-cyan-400">Official Physical Address</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Village:</span>
                  <span className="font-semibold text-white">{settings.village || 'Paragaon, Panch Pai'}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Upazila / Police Station:</span>
                  <span className="font-semibold text-white">{settings.upazila || 'Bhaluka'}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">District:</span>
                  <span className="font-semibold text-white">{settings.district || 'Mymensingh'}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Division:</span>
                  <span className="font-semibold text-white">{settings.division || 'Mymensingh'}</span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-slate-400">Country:</span>
                  <span className="font-semibold text-white">{settings.country || 'Bangladesh'}</span>
                </div>
              </div>

              {/* Time Zone & Working Availability */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bangladesh Standard Time (UTC+6) — Responsive 7 days a week</span>
              </div>

              {/* Open in Google Maps */}
              <div className="mt-6">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white transition-all"
                >
                  <span>Open Bhaluka, Mymensingh in Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Styled Geographic Map Presentation */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-3 rounded-2xl border border-slate-800 overflow-hidden relative group">
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl bg-[#030611] relative overflow-hidden flex items-center justify-center border border-slate-800">
                {/* Styled Dark Map Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                
                {/* Glowing Concentric Radar Circles */}
                <div className="w-64 h-64 rounded-full border border-cyan-500/20 absolute animate-ping-slow pointer-events-none" />
                <div className="w-40 h-40 rounded-full border border-indigo-500/30 absolute pointer-events-none" />
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/50 absolute pointer-events-none" />

                {/* Center Pin Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/40 animate-bounce">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-900/95 border border-cyan-500/40 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md text-center">
                    <p className="text-xs font-bold text-white">Freelancer Adnan</p>
                    <p className="text-[10px] text-cyan-300">Bhaluka, Mymensingh, BD</p>
                  </div>
                </div>

                {/* International Connectivity Floating Badges */}
                <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 backdrop-blur-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Accepting Global Campaigns</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 backdrop-blur-sm">
                  <span>Coordinates: Mymensingh Division</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
