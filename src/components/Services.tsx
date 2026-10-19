import React from 'react';
import {
  Target,
  Share2,
  Globe,
  Layers,
  BarChart3,
  Users,
  Link2,
  Code,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectService }) => {
  // Map icon names dynamically
  const getIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'target':
        return <Target className="w-6 h-6" />;
      case 'share2':
        return <Share2 className="w-6 h-6" />;
      case 'globe':
        return <Globe className="w-6 h-6" />;
      case 'layers':
        return <Layers className="w-6 h-6" />;
      case 'barchart3':
        return <BarChart3 className="w-6 h-6" />;
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'link2':
        return <Link2 className="w-6 h-6" />;
      case 'code':
        return <Code className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const activeServices = services.filter((s) => s.is_active);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Impact <span className="gradient-text">Marketing Services</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Data-backed traffic, high-converting offer funnels, and precision digital campaigns engineered to grow your reach and maximize conversions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeServices.map((service, index) => (
            <div
              key={service.id || index}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 border border-slate-800/80 hover:border-cyan-500/40"
            >
              {/* Subtle accent glow on hover */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div>
                {/* Service Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                  {getIcon(service.icon_name)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/60 mt-auto">
                <button
                  onClick={() => onSelectService(service)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors py-1"
                >
                  <span>{service.cta_text || 'Contact Me'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
