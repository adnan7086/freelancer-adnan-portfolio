import React, { useState, useEffect } from 'react';
import { SiteSettings, ServiceItem, PortfolioItem, CpaOffer } from './types';
import {
  fetchSiteSettings,
  fetchServices,
  fetchPortfolio,
  fetchCpaOffers
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { CpaOffers } from './components/CpaOffers';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { AdminDashboard } from './pages/AdminDashboard';
import { DEFAULT_SITE_SETTINGS } from './data/initialData';

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [offers, setOffers] = useState<CpaOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View state: 'home' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Handle URL route on load & on popstate
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [s, srv, port, off] = await Promise.all([
        fetchSiteSettings(),
        fetchServices(),
        fetchPortfolio(),
        fetchCpaOffers()
      ]);
      if (s) setSettings(s);
      if (srv) setServices(srv);
      if (port) setPortfolio(port);
      if (off) setOffers(off);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setPrefilledSubject(`Inquiry regarding ${service.title}`);
    handleScrollTo('contact');
  };

  // Render Admin View
  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard
          onBackToSite={navigateToHome}
          onOpenDbSetup={() => setIsSetupModalOpen(true)}
        />
        <SupabaseSetupModal
          isOpen={isSetupModalOpen}
          onClose={() => setIsSetupModalOpen(false)}
          onConfigSaved={() => {
            loadData();
            setIsSetupModalOpen(false);
          }}
        />
      </>
    );
  }

  // Render Public Homepage
  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        onOpenSetup={() => setIsSetupModalOpen(true)}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Hero Section */}
      <Hero
        settings={settings}
        onExploreWork={() => handleScrollTo('portfolio')}
        onContactMe={() => handleScrollTo('contact')}
      />

      {/* About Me Section */}
      <About
        settings={settings}
        onContactClick={() => handleScrollTo('contact')}
      />

      {/* Services Section */}
      <Services
        services={services}
        onSelectService={handleSelectService}
      />

      {/* Work & Portfolio Gallery */}
      <Portfolio items={portfolio} />

      {/* CPA Offers & Partner Links */}
      <CpaOffers offers={offers} settings={settings} />

      {/* Location & Headquarters */}
      <LocationSection settings={settings} />

      {/* Contact Section */}
      <ContactSection
        settings={settings}
        prefilledSubject={prefilledSubject}
      />

      {/* Floating Live Chat with WhatsApp Fallback */}
      <ChatWidget settings={settings} />

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Supabase Connection & Configuration Modal */}
      <SupabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onConfigSaved={() => {
          loadData();
          setIsSetupModalOpen(false);
        }}
      />
    </div>
  );
}
