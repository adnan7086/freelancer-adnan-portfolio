import { SiteSettings, ServiceItem, PortfolioItem, CpaOffer } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_name: 'Freelancer Adnan',
  hero_headline: "Hi, I'm Adnan — Your Digital Growth Partner",
  hero_subheadline: "I'm a freelancer specializing in CPA Marketing, Affiliate Marketing, and Digital Promotion. I help businesses and online campaigns reach the right audience through strategic digital marketing.",
  profession: 'Freelancer, CPA Marketer, Affiliate Marketer, Digital Marketer',
  bio: "I am a dedicated digital marketer and CPA campaign strategist based in Bhaluka, Mymensingh, Bangladesh. With a sharp focus on targeted traffic generation, affiliate offer optimization, and conversion-centered promotion, I help companies and affiliate networks reach motivated audiences worldwide. Whether scaling high-converting CPA funnels or building digital web assets, I deliver measurable results.",
  profile_image_url: '/adnan-profile.jpg',
  logo_url: '',
  whatsapp_number: '01618058572',
  whatsapp_international: '+8801618058572',
  email: 'adnan708620@gmail.com',
  country: 'Bangladesh',
  division: 'Mymensingh',
  district: 'Mymensingh',
  upazila: 'Bhaluka',
  village: 'Paragaon, Panch Pai',
  social_links: {
    whatsapp: 'https://wa.me/8801618058572',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    telegram: 'https://t.me/freelanceradnan'
  },
  seo_title: 'Freelancer Adnan — CPA & Digital Growth Portfolio',
  seo_description: 'Official portfolio of Freelancer Adnan: CPA Marketer, Affiliate Marketer & Traffic Strategist from Bhaluka, Mymensingh, Bangladesh.',
  affiliate_disclosure: 'Disclosure: Some links on this website are affiliate and CPA promotional links. If you take action through these links, I may earn a commission at no additional cost to you. I only recommend legitimate, tested offers.',
  privacy_policy: 'Your privacy is respected. All inquiries sent through the contact form or live chat are treated with strict confidentiality.',
  theme_accent: 'electric-blue'
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'CPA Marketing',
    description: 'Strategic Cost-Per-Action campaign setup, conversion rate optimization, and international audience targeting across leading CPA networks.',
    icon_name: 'Target',
    cta_text: 'Discuss Campaign',
    is_active: true,
    order_index: 1
  },
  {
    id: 'srv-2',
    title: 'Affiliate Marketing',
    description: 'Promoting vetted digital software, e-commerce products, and SaaS subscriptions with high-converting review funnels and bridge pages.',
    icon_name: 'Share2',
    cta_text: 'Partner With Me',
    is_active: true,
    order_index: 2
  },
  {
    id: 'srv-3',
    title: 'Digital Marketing',
    description: 'Comprehensive digital promotion strategies including paid ads, social media visibility, and search placements tailored to specific buyer personas.',
    icon_name: 'Globe',
    cta_text: 'Grow Reach',
    is_active: true,
    order_index: 3
  },
  {
    id: 'srv-4',
    title: 'Landing Page Promotion',
    description: 'Driving high-intent pre-qualified traffic to fast, conversion-optimized landing pages engineered for maximum lead capture.',
    icon_name: 'Layers',
    cta_text: 'Promote Page',
    is_active: true,
    order_index: 4
  },
  {
    id: 'srv-5',
    title: 'Campaign Optimization',
    description: 'Rigorous A/B split testing, click-through-rate improvements, tracking pixel analytics, and ROI maximization on marketing spend.',
    icon_name: 'BarChart3',
    cta_text: 'Optimize Ads',
    is_active: true,
    order_index: 5
  },
  {
    id: 'srv-6',
    title: 'Online Audience Engagement',
    description: 'Building organic community interest, niche email subscriber lists, and targeted messaging channels that nurture prospective leads.',
    icon_name: 'Users',
    cta_text: 'Engage Audience',
    is_active: true,
    order_index: 6
  },
  {
    id: 'srv-7',
    title: 'Promotional Content & Link Management',
    description: 'Persuasive promotional copywriting, structured UTM tracking parameters, sponsored link attributes, and continuous campaign link testing.',
    icon_name: 'Link2',
    cta_text: 'Manage Links',
    is_active: true,
    order_index: 7
  },
  {
    id: 'srv-8',
    title: 'Website & Portfolio Development',
    description: 'Building modern, ultra-fast, mobile-friendly landing pages and personal portfolio websites that reflect authority and convert visitors.',
    icon_name: 'Code',
    cta_text: 'Build Website',
    is_active: true,
    order_index: 8
  }
];

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Global E-Commerce CPA Lead Flow',
    description: 'International lead-generation campaign targeting high-tier GEOs with customized bridge pages and email opt-ins.',
    category: 'CPA Marketing',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    project_url: 'https://wa.me/8801618058572?text=Inquiry%20regarding%20E-Commerce%20CPA%20Project',
    is_published: true,
    order_index: 1,
    created_at: '2026-08-15'
  },
  {
    id: 'port-2',
    title: 'High-Converting SaaS Affiliate Landing Page',
    description: 'Responsive dark-mode promotional landing page with clear CTA hierarchy, comparison tables, and mobile checkout.',
    category: 'Landing Pages',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80',
    project_url: 'https://wa.me/8801618058572?text=Inquiry%20regarding%20SaaS%20Landing%20Page',
    is_published: true,
    order_index: 2,
    created_at: '2026-09-02'
  },
  {
    id: 'port-3',
    title: 'Affiliate Software Review Portal',
    description: 'Clean review hub comparing leading digital tools with honest pros/cons, user rating metrics, and tracked partner links.',
    category: 'Affiliate Marketing',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    project_url: '',
    is_published: true,
    order_index: 3,
    created_at: '2026-09-20'
  },
  {
    id: 'port-4',
    title: 'YouTube High-CTR Thumbnail Design Kit',
    description: 'Eye-catching graphic set engineered for video marketing campaigns, boasting strong contrast and emotional resonance.',
    category: 'Promotional Banners',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    project_url: '',
    is_published: true,
    order_index: 4,
    created_at: '2026-10-01'
  },
  {
    id: 'port-5',
    title: 'Multi-Channel Audience Retargeting Campaign',
    description: 'Cross-platform audience engagement workflow connecting Facebook ads with Telegram channel community broadcasts.',
    category: 'Digital Marketing',
    image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?auto=format&fit=crop&w=900&q=80',
    project_url: '',
    is_published: true,
    order_index: 5,
    created_at: '2026-10-10'
  },
  {
    id: 'port-6',
    title: 'Modern Personal Brand Portfolio Architecture',
    description: 'Full-stack responsive portfolio engineered with React, Supabase backend integration, and real-time client inquiry hub.',
    category: 'Web Development',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
    project_url: '',
    is_published: true,
    order_index: 6,
    created_at: '2026-10-15'
  }
];

export const DEFAULT_CPA_OFFERS: CpaOffer[] = [
  {
    id: 'offer-1',
    title: 'Fast Cloud Web Hosting & Free Domain Bundle',
    description: 'Industry-leading cloud hosting optimized for ultra-fast affiliate landing pages. Includes free SSL and 24/7 technical support.',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    promo_url: 'https://wa.me/8801618058572?text=Hi%20Adnan,%20I%20am%20interested%20in%20the%20Hosting%20Offer',
    cta_text: 'Claim 75% Discount',
    category: 'Hosting & Cloud',
    geo_target: 'Worldwide',
    status: 'active',
    expiry_date: '2026-12-31',
    tracking_params: 'utm_source=portfolio&utm_medium=cpa&utm_campaign=adnan_hosting',
    order_index: 1,
    created_at: '2026-10-05'
  },
  {
    id: 'offer-2',
    title: 'AI Marketing & Copywriting Automation Suite',
    description: 'Generate high-CTR promotional copy, automated email sequences, and social media posts in seconds with an exclusive 14-day trial.',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80',
    promo_url: 'https://wa.me/8801618058572?text=Hi%20Adnan,%20I%20want%20to%20try%20the%20AI%20Marketing%20Suite',
    cta_text: 'Start Free 14-Day Trial',
    category: 'AI Software',
    geo_target: 'US, UK, CA, AU, BD',
    status: 'active',
    expiry_date: '2026-11-30',
    tracking_params: 'utm_source=portfolio&utm_medium=cpa&utm_campaign=ai_tools',
    order_index: 2,
    created_at: '2026-10-08'
  },
  {
    id: 'offer-3',
    title: 'All-in-One Digital Marketer Resource Kit',
    description: 'Curated library of proven landing page templates, email swipe files, and tracking spreadsheets to jumpstart your campaigns.',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=900&q=80',
    promo_url: 'https://wa.me/8801618058572?text=Hi%20Adnan,%20I%20want%20the%20Digital%20Marketer%20Resource%20Kit',
    cta_text: 'Download Free Pack',
    category: 'Marketing Tools',
    geo_target: 'Worldwide',
    status: 'active',
    expiry_date: null,
    tracking_params: 'utm_source=portfolio&utm_medium=cpa&utm_campaign=resource_kit',
    order_index: 3,
    created_at: '2026-10-12'
  }
];
