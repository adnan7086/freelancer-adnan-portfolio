import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  MessageSquare,
  Shield,
  ExternalLink,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SiteSettings } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  settings: SiteSettings;
  onOpenSetup: () => void;
  onNavigateAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenSetup,
  onNavigateAdmin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDbReady = isSupabaseConfigured();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'CPA Offers', href: '#cpa-offers' },
    { label: 'Location', href: '#location' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050814]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group"
            onClick={(e) => handleLinkClick(e, '#home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-white text-lg tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                  {settings.brand_name || 'Freelancer Adnan'}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                CPA & Digital Marketing Specialist
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-full transition-colors relative hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Database / Cloud Status Badge */}
            <button
              onClick={onOpenSetup}
              title={isDbReady ? 'Supabase Backend Connected' : 'Setup Supabase Cloud Database'}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">DB:</span>
              {isDbReady ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Cloud
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <AlertCircle className="w-3 h-3" /> Setup
                </span>
              )}
            </button>

            {/* Admin shortcut button */}
            <button
              onClick={onNavigateAdmin}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 border border-slate-800 transition-all"
              title="Admin Dashboard (/admin)"
              aria-label="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\+/g, '').replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm px-4 py-2 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-102"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onNavigateAdmin}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 bg-slate-900/80 border border-slate-800"
              title="Admin"
              aria-label="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#070b1a]/98 border-b border-slate-800/90 backdrop-blur-2xl px-6 pt-4 pb-6 mt-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/40 px-3 py-2.5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-slate-800/80 mt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSetup();
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs bg-slate-900/90 border border-slate-800 text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Supabase Backend Status
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded ${isDbReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {isDbReady ? 'Connected' : 'Click to Configure'}
                </span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\+/g, '').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Chat on WhatsApp (+8801618058572)
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
