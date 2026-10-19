import React from 'react';
import {
  MessageSquare,
  Mail,
  MapPin,
  ExternalLink,
  Shield,
  Heart,
  ArrowUp
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = settings.social_links || {};

  return (
    <footer className="bg-[#030611] border-t border-slate-900 text-slate-400 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-cyan-500/20">
                A
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                {settings.brand_name || 'Freelancer Adnan'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Professional Freelancer specializing in CPA Marketing, Affiliate Networks, Digital Promotion, and Conversion Funnels.
            </p>

            {/* Social Icons (only platforms with configured URLs) */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {socialLinks.whatsapp && (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-800 flex items-center justify-center transition-all"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                </a>
              )}
              {socialLinks.telegram && (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-white text-slate-300 border border-slate-800 flex items-center justify-center transition-all"
                  title="Telegram"
                >
                  <span className="font-bold text-xs">TG</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600 hover:text-white text-slate-300 border border-slate-800 flex items-center justify-center transition-all"
                  title="YouTube"
                >
                  <span className="font-bold text-xs">YT</span>
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-800 flex items-center justify-center transition-all"
                  title="Facebook"
                >
                  <span className="font-bold text-xs">FB</span>
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-500 hover:text-white text-slate-300 border border-slate-800 flex items-center justify-center transition-all"
                  title="LinkedIn"
                >
                  <span className="font-bold text-xs">IN</span>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-pink-600 hover:text-white text-slate-300 border border-slate-800 flex items-center justify-center transition-all"
                  title="Instagram"
                >
                  <span className="font-bold text-xs">IG</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-cyan-400 transition-colors">Home & Intro</a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">About Freelancer Adnan</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">Marketing Services</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Portfolio & Work</a>
              </li>
              <li>
                <a href="#cpa-offers" className="hover:text-cyan-400 transition-colors">CPA Offers & Deals</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact Adnan</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Address & Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Location & Contact</h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {settings.village ? `${settings.village}, ` : ''}
                  {settings.upazila ? `${settings.upazila}, ` : ''}
                  {settings.district ? `${settings.district}, ` : ''}
                  {settings.country || 'Bangladesh'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp_international.replace(/\+/g, '').replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  {settings.whatsapp_international}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-cyan-400 transition-colors truncate"
                >
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Back to top button */}
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white py-1.5 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Scroll to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.brand_name || 'Freelancer Adnan'}. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <span>•</span>
            <span>CPA Marketing & Digital Growth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
