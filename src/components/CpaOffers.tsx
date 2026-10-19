import React from 'react';
import {
  ExternalLink,
  Globe2,
  Calendar,
  AlertCircle,
  Tag,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CpaOffer, SiteSettings } from '../types';

interface CpaOffersProps {
  offers: CpaOffer[];
  settings: SiteSettings;
}

export const CpaOffers: React.FC<CpaOffersProps> = ({ offers, settings }) => {
  const activeOffers = offers.filter((o) => o.status === 'active');

  const buildOfferUrl = (offer: CpaOffer) => {
    let url = offer.promo_url;
    if (offer.tracking_params && !url.includes('?')) {
      url += `?${offer.tracking_params}`;
    } else if (offer.tracking_params) {
      url += `&${offer.tracking_params}`;
    }
    return url;
  };

  return (
    <section id="cpa-offers" className="py-24 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Promotions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated <span className="gradient-text">CPA & Partner Offers</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Handpicked, verified digital deals and campaign opportunities with exclusive discounts.
          </p>
        </div>

        {/* Affiliate Disclosure Notice */}
        <div className="max-w-4xl mx-auto mb-12 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 backdrop-blur-sm">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {settings.affiliate_disclosure ||
              'Disclosure: Some links on this website are affiliate and CPA promotional links. If you take action through these links, I may earn a commission at no additional cost to you. I only recommend legitimate, tested offers.'}
          </p>
        </div>

        {/* Offers Grid */}
        {activeOffers.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80 max-w-md mx-auto">
            <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No active offers available at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeOffers.map((offer) => {
              const targetUrl = buildOfferUrl(offer);

              return (
                <div
                  key={offer.id}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300"
                >
                  {/* Banner Image */}
                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-transparent opacity-85" />

                    {/* Category & Geo Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold bg-purple-950/90 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        {offer.category}
                      </span>
                      <span className="text-[11px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Globe2 className="w-3 h-3 text-cyan-400" />
                        {offer.geo_target || 'Worldwide'}
                      </span>
                    </div>

                    {/* Expiry Badge if configured */}
                    {offer.expiry_date && (
                      <div className="absolute bottom-3 left-3 text-[11px] text-amber-400 flex items-center gap-1 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <Calendar className="w-3 h-3" />
                        <span>Valid until {new Date(offer.expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                        {offer.description}
                      </p>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-4 border-t border-slate-800/80 mt-auto">
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/30 transition-all hover:scale-101"
                      >
                        <span>{offer.cta_text || 'Claim Offer'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
