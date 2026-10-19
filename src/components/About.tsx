import React from 'react';
import {
  MapPin,
  Mail,
  MessageSquare,
  CheckCircle,
  Briefcase,
  Target,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings: SiteSettings;
  onContactClick: () => void;
}

export const About: React.FC<AboutProps> = ({ settings, onContactClick }) => {
  const coreCompetencies = [
    { title: 'CPA Campaign Execution', desc: 'Planning and driving targeted user actions across affiliate networks.' },
    { title: 'Affiliate Marketing Funnels', desc: 'Crafting bridge pages and tailored reviews for digital offers.' },
    { title: 'Audience Traffic Generation', desc: 'Connecting relevant prospective audiences to targeted promotions.' },
    { title: 'Landing Page & Link Management', desc: 'Ensuring fast load times, clean UTM tracking, and sponsored disclosures.' }
  ];

  return (
    <section id="about" className="py-20 relative bg-[#070b1a] border-t border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Profile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="gradient-text">Freelancer Adnan</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Dedicated digital growth partner committed to quality promotional execution and transparent client partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Personal Story & Biography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-4">
                Empowering Digital Campaigns With Strategic Precision
              </h3>

              <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed">
                <p>
                  {settings.bio ||
                    "I am a freelancer specializing in CPA Marketing, Affiliate Marketing, and Digital Promotion based in Bhaluka, Mymensingh, Bangladesh. I help businesses and online campaigns reach the right audience through strategic digital marketing."}
                </p>
                <p>
                  In the rapidly evolving world of digital marketing, reaching real people who are genuinely interested in your offer is paramount. My approach is centered on strategic audience research, meticulous campaign setup, and continuous conversion optimization to ensure marketing campaigns achieve their specific goals.
                </p>
              </div>

              {/* Location Badge */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {settings.village ? `${settings.village}, ` : ''}
                    {settings.upazila ? `${settings.upazila}, ` : ''}
                    {settings.district ? `${settings.district}, ` : ''}
                    {settings.country || 'Bangladesh'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
                  <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{settings.profession || 'Freelancer & CPA Marketer'}</span>
                </div>
              </div>
            </div>

            {/* Direct Connect Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`mailto:${settings.email}`}
                className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400">Official Email</p>
                    <p className="text-sm font-semibold text-white truncate max-w-[180px]">{settings.email}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp_international.replace(/\+/g, '').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400">WhatsApp Contact</p>
                    <p className="text-sm font-semibold text-white">{settings.whatsapp_international}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Right Column: Specializations & Work Values */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Core Specializations</span>
            </h4>

            <div className="space-y-3">
              {coreCompetencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">{comp.title}</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{comp.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Campaign Work Ethics Card */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30 mt-6">
              <h5 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4" />
                <span>Transparent & Compliant Promotion</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                All marketing activities strictly adhere to platform policies, affiliate network rules, and ethical digital marketing guidelines. No artificial traffic or misleading claims.
              </p>
              <button
                onClick={onContactClick}
                className="mt-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
              >
                <span>Request Campaign Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
