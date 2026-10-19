export interface SiteSettings {
  id?: string;
  brand_name: string;
  hero_headline: string;
  hero_subheadline: string;
  profession: string;
  bio: string;
  profile_image_url: string;
  logo_url: string;
  whatsapp_number: string;
  whatsapp_international: string;
  email: string;
  country: string;
  division: string;
  district: string;
  upazila: string;
  village: string;
  social_links: {
    whatsapp?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    telegram?: string;
  };
  seo_title: string;
  seo_description: string;
  affiliate_disclosure: string;
  privacy_policy: string;
  theme_accent: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  cta_text?: string;
  is_active: boolean;
  order_index: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  project_url?: string;
  is_published: boolean;
  order_index: number;
  created_at?: string;
}

export interface CpaOffer {
  id: string;
  title: string;
  description: string;
  image_url: string;
  promo_url: string;
  cta_text: string;
  category: string;
  geo_target: string;
  status: 'active' | 'inactive' | 'paused';
  expiry_date?: string | null;
  tracking_params?: string;
  order_index: number;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'visitor' | 'admin';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_id: string;
  status: 'open' | 'closed' | 'archived';
  last_message_at: string;
  created_at: string;
  messages?: ChatMessage[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
