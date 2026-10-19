import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  Eye,
  X,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
}

export const Portfolio: React.FC<PortfolioProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePreview, setActivePreview] = useState<PortfolioItem | null>(null);

  const publishedItems = useMemo(() => {
    return items.filter((item) => item.is_published);
  }, [items]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedItems.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ['All', ...Array.from(set)];
  }, [publishedItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return publishedItems;
    return publishedItems.filter((i) => i.category === selectedCategory);
  }, [publishedItems, selectedCategory]);

  return (
    <section id="portfolio" className="py-24 relative bg-[#070b1a] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demonstrated Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Work & <span className="gradient-text">Portfolio Gallery</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Real campaign setups, conversion funnels, landing page structures, and promotional creative assets.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80 max-w-md mx-auto">
            <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No portfolio items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group flex flex-col border border-slate-800/80 hover:border-cyan-500/40"
              >
                {/* Image Container with Hover Actions */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-transparent opacity-80" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-semibold bg-slate-900/90 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Overlay Action */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                    <button
                      onClick={() => setActivePreview(item)}
                      className="p-2.5 rounded-full bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg transition-transform hover:scale-110"
                      title="Preview Image"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-lg transition-transform hover:scale-110"
                        title="View Live Link"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setActivePreview(item)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                    >
                      <span>View Project Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activePreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setActivePreview(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#090e24] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePreview(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activePreview.image_url}
                  alt={activePreview.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    {activePreview.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{activePreview.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{activePreview.description}</p>

                {activePreview.project_url && (
                  <a
                    href={activePreview.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-102 transition-all"
                  >
                    <span>Open Live Destination</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
