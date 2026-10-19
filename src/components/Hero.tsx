import React from 'react';
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  Zap,
  Globe2,
  Mail,
  Award
} from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onExploreWork: () => void;
  onContactMe: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreWork,
  onContactMe
}) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp_international.replace(/\+/g, '').replace(/\s/g, '')}?text=Hi%20Adnan,%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20campaign!`;

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Glows & Atmospheric Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium mb-6 shadow-inner shadow-cyan-500/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>CPA Marketer & Digital Promotion Specialist</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              {settings.hero_headline || "Hi, I'm Adnan — Your Digital Growth Partner"}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8">
              {settings.hero_subheadline ||
                "I'm a freelancer specializing in CPA Marketing, Affiliate Marketing, and Digital Promotion. I help businesses and online campaigns reach the right audience through strategic digital marketing."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
              {/* Explore My Work */}
              <button
                onClick={onExploreWork}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-102 hover:shadow-cyan-500/35"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Contact Me */}
              <button
                onClick={onContactMe}
                className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all backdrop-blur-sm"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Me</span>
              </button>

              {/* Chat on WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-102"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-cyan-400">100%</p>
                <p className="text-xs text-slate-400 font-medium">Verified Traffic</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-purple-400">Global</p>
                <p className="text-xs text-slate-400 font-medium">Geo-Targeting</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">Fast</p>
                <p className="text-xs text-slate-400 font-medium">Conversion Focus</p>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Picture in Premium Frame with subtle blue lighting */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-80 md:w-88 lg:w-96">
              {/* Subtle Blue & Cyan Lighting Glow Aura */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-600/20 to-purple-600/30 rounded-[2rem] blur-xl opacity-80 animate-pulse pointer-events-none" />
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 rounded-[2rem] opacity-70 blur-[2px]" />

              {/* Frame Card: Dark Navy Background & Subtle Blue Lighting Rim */}
              <div className="relative rounded-[1.85rem] bg-[#050b1e] border border-cyan-400/40 p-3 sm:p-3.5 shadow-[0_0_40px_rgba(56,189,248,0.22)] overflow-hidden">
                <div className="aspect-[4/5] sm:aspect-[4/5] rounded-2xl overflow-hidden relative group bg-[#040816]">
                  <img
                    src={settings.profile_image_url || '/adnan-profile.jpg'}
                    alt="Freelancer Adnan — CPA Marketer & Digital Growth Partner"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/adnan-profile.jpg' && !target.src.endsWith('/adnan-profile.jpg')) {
                        target.src = '/adnan-profile.jpg';
                      }
                    }}
                  />
                  {/* Subtle Dark Navy Gradient Overlay & Lighting Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b1e] via-[#050b1e]/15 to-transparent opacity-85 pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Portrait Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/90 border border-cyan-400/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm">
                      Freelancer & Marketer
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                      <span>Adnan</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    </h3>
                    <p className="text-xs text-slate-300">Bhaluka, Mymensingh, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: CPA Campaign Specialist */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5 animate-bounce-slow">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">CPA Marketer</p>
                  <p className="text-[10px] text-slate-400">High-ROI Campaigns</p>
                </div>
              </div>

              {/* Floating Badge 2: Strategic Traffic & Promotion */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-slate-900/90 border border-purple-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Digital Growth</p>
                  <p className="text-[10px] text-slate-400">Audience Targeting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
