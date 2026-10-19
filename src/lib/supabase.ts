import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SiteSettings,
  ServiceItem,
  PortfolioItem,
  CpaOffer,
  ContactMessage,
  ChatConversation,
  ChatMessage
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_PORTFOLIO,
  DEFAULT_CPA_OFFERS
} from '../data/initialData';

// Storage keys for persistent local fallback
const STORAGE_KEYS = {
  SUPABASE_CONFIG: 'freelancer_adnan_supabase_config',
  SETTINGS: 'freelancer_adnan_settings',
  SERVICES: 'freelancer_adnan_services',
  PORTFOLIO: 'freelancer_adnan_portfolio',
  CPA_OFFERS: 'freelancer_adnan_cpa_offers',
  CONTACT_MESSAGES: 'freelancer_adnan_messages',
  CHAT_CONVERSATIONS: 'freelancer_adnan_chat_convs',
  CHAT_MESSAGES: 'freelancer_adnan_chat_msgs'
};

// Retrieve credentials from env or user config
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey && !envUrl.includes('your-project-id')) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch (e) {
    console.error('Error reading saved Supabase config:', e);
  }

  return { url: '', anonKey: '' };
}

let cachedClient: SupabaseClient | null = null;
let cachedCredentials = { url: '', anonKey: '' };

export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.url || !creds.anonKey) {
    return null;
  }

  if (cachedClient && cachedCredentials.url === creds.url && cachedCredentials.anonKey === creds.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    cachedCredentials = creds;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const creds = getSupabaseCredentials();
  return Boolean(creds.url && creds.anonKey);
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify({ url, anonKey }));
  cachedClient = null; // reset cached instance
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
  cachedClient = null;
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase URL and Anon Key are missing.' };
  }

  try {
    const { error } = await client.from('site_settings').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but tables are missing! Please run schema.sql in Supabase SQL Editor.'
        };
      }
      return { success: false, message: `Database query returned: ${error.message}` };
    }
    return { success: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Unknown network error' };
  }
}

// -------------------------------------------------------------
// LOCAL STORAGE HELPERS (FOR ZERO-FRICTION INITIAL PREVIEW & OFFLINE)
// -------------------------------------------------------------
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
  }
  return defaultVal;
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('site_settings').select('*').limit(1).maybeSingle();
      if (!error && data) {
        setLocal(STORAGE_KEYS.SETTINGS, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchSiteSettings failed, falling back to local:', e);
    }
  }

  const localSettings = getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  if (!localSettings.profile_image_url || localSettings.profile_image_url.includes('unsplash.com/photo-1534528741775')) {
    localSettings.profile_image_url = '/adnan-profile.jpg';
    setLocal(STORAGE_KEYS.SETTINGS, localSettings);
  }
  return localSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const client = getSupabaseClient();
  let updated: SiteSettings;

  if (client) {
    try {
      const existing = await fetchSiteSettings();
      if (existing?.id) {
        const { data, error } = await client
          .from('site_settings')
          .update({ ...settings, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        if (!error && data) {
          setLocal(STORAGE_KEYS.SETTINGS, data);
          return data;
        }
      } else {
        const { data, error } = await client
          .from('site_settings')
          .insert([{ ...DEFAULT_SITE_SETTINGS, ...settings }])
          .select()
          .single();
        if (!error && data) {
          setLocal(STORAGE_KEYS.SETTINGS, data);
          return data;
        }
      }
    } catch (e) {
      console.error('Supabase updateSiteSettings error:', e);
    }
  }

  // Local fallback
  const current = getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  updated = { ...current, ...settings, updated_at: new Date().toISOString() };
  setLocal(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

// -------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------
export async function fetchServices(): Promise<ServiceItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.SERVICES, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchServices fallback:', e);
    }
  }
  return getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
}

export async function saveService(service: Partial<ServiceItem>): Promise<ServiceItem> {
  const client = getSupabaseClient();
  if (client) {
    try {
      if (service.id && !service.id.startsWith('srv-')) {
        const { data, error } = await client
          .from('services')
          .update(service)
          .eq('id', service.id)
          .select()
          .single();
        if (!error && data) return data;
      } else {
        const { id, ...newRecord } = service;
        const { data, error } = await client
          .from('services')
          .insert([newRecord])
          .select()
          .single();
        if (!error && data) return data;
      }
    } catch (e) {
      console.error('Supabase saveService error:', e);
    }
  }

  // Local fallback
  const list = getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  let updatedList: ServiceItem[];
  let savedItem: ServiceItem;

  if (service.id) {
    updatedList = list.map(item => (item.id === service.id ? { ...item, ...service } as ServiceItem : item));
    savedItem = updatedList.find(i => i.id === service.id)!;
  } else {
    savedItem = {
      id: `srv-${Date.now()}`,
      title: service.title || 'New Service',
      description: service.description || '',
      icon_name: service.icon_name || 'Target',
      cta_text: service.cta_text || 'Contact Me',
      is_active: service.is_active ?? true,
      order_index: list.length + 1
    };
    updatedList = [...list, savedItem];
  }
  setLocal(STORAGE_KEYS.SERVICES, updatedList);
  return savedItem;
}

export async function deleteService(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client && !id.startsWith('srv-')) {
    try {
      await client.from('services').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteService error:', e);
    }
  }
  const list = getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  setLocal(STORAGE_KEYS.SERVICES, list.filter(item => item.id !== id));
  return true;
}

// -------------------------------------------------------------
// PORTFOLIO
// -------------------------------------------------------------
export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('portfolio_items')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.PORTFOLIO, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchPortfolio fallback:', e);
    }
  }
  return getLocal<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO);
}

export async function savePortfolioItem(item: Partial<PortfolioItem>): Promise<PortfolioItem> {
  const client = getSupabaseClient();
  if (client) {
    try {
      if (item.id && !item.id.startsWith('port-')) {
        const { data, error } = await client
          .from('portfolio_items')
          .update(item)
          .eq('id', item.id)
          .select()
          .single();
        if (!error && data) return data;
      } else {
        const { id, ...newRecord } = item;
        const { data, error } = await client
          .from('portfolio_items')
          .insert([newRecord])
          .select()
          .single();
        if (!error && data) return data;
      }
    } catch (e) {
      console.error('Supabase savePortfolioItem error:', e);
    }
  }

  // Local fallback
  const list = getLocal<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO);
  let updatedList: PortfolioItem[];
  let savedItem: PortfolioItem;

  if (item.id) {
    updatedList = list.map(i => (i.id === item.id ? { ...i, ...item } as PortfolioItem : i));
    savedItem = updatedList.find(i => i.id === item.id)!;
  } else {
    savedItem = {
      id: `port-${Date.now()}`,
      title: item.title || 'Untitled Project',
      description: item.description || '',
      category: item.category || 'CPA Marketing',
      image_url: item.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      project_url: item.project_url || '',
      is_published: item.is_published ?? true,
      order_index: list.length + 1,
      created_at: new Date().toISOString()
    };
    updatedList = [savedItem, ...list];
  }
  setLocal(STORAGE_KEYS.PORTFOLIO, updatedList);
  return savedItem;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client && !id.startsWith('port-')) {
    try {
      await client.from('portfolio_items').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deletePortfolioItem error:', e);
    }
  }
  const list = getLocal<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO);
  setLocal(STORAGE_KEYS.PORTFOLIO, list.filter(i => i.id !== id));
  return true;
}

// -------------------------------------------------------------
// CPA OFFERS
// -------------------------------------------------------------
export async function fetchCpaOffers(): Promise<CpaOffer[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('cpa_offers')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.CPA_OFFERS, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchCpaOffers fallback:', e);
    }
  }
  return getLocal<CpaOffer[]>(STORAGE_KEYS.CPA_OFFERS, DEFAULT_CPA_OFFERS);
}

export async function saveCpaOffer(offer: Partial<CpaOffer>): Promise<CpaOffer> {
  const client = getSupabaseClient();
  if (client) {
    try {
      if (offer.id && !offer.id.startsWith('offer-')) {
        const { data, error } = await client
          .from('cpa_offers')
          .update(offer)
          .eq('id', offer.id)
          .select()
          .single();
        if (!error && data) return data;
      } else {
        const { id, ...newRecord } = offer;
        const { data, error } = await client
          .from('cpa_offers')
          .insert([newRecord])
          .select()
          .single();
        if (!error && data) return data;
      }
    } catch (e) {
      console.error('Supabase saveCpaOffer error:', e);
    }
  }

  // Local fallback
  const list = getLocal<CpaOffer[]>(STORAGE_KEYS.CPA_OFFERS, DEFAULT_CPA_OFFERS);
  let updatedList: CpaOffer[];
  let savedItem: CpaOffer;

  if (offer.id) {
    updatedList = list.map(o => (o.id === offer.id ? { ...o, ...offer } as CpaOffer : o));
    savedItem = updatedList.find(o => o.id === offer.id)!;
  } else {
    savedItem = {
      id: `offer-${Date.now()}`,
      title: offer.title || 'Special Promotion',
      description: offer.description || '',
      image_url: offer.image_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      promo_url: offer.promo_url || 'https://wa.me/8801618058572',
      cta_text: offer.cta_text || 'Claim Offer',
      category: offer.category || 'Special',
      geo_target: offer.geo_target || 'Worldwide',
      status: offer.status || 'active',
      expiry_date: offer.expiry_date || null,
      tracking_params: offer.tracking_params || '',
      order_index: list.length + 1,
      created_at: new Date().toISOString()
    };
    updatedList = [savedItem, ...list];
  }
  setLocal(STORAGE_KEYS.CPA_OFFERS, updatedList);
  return savedItem;
}

export async function deleteCpaOffer(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client && !id.startsWith('offer-')) {
    try {
      await client.from('cpa_offers').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteCpaOffer error:', e);
    }
  }
  const list = getLocal<CpaOffer[]>(STORAGE_KEYS.CPA_OFFERS, DEFAULT_CPA_OFFERS);
  setLocal(STORAGE_KEYS.CPA_OFFERS, list.filter(o => o.id !== id));
  return true;
}

// -------------------------------------------------------------
// CONTACT MESSAGES
// -------------------------------------------------------------
export async function submitContactMessage(msg: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('contact_messages').insert([msg]);
      if (!error) {
        return { success: true, message: 'Message sent successfully! Adnan will get in touch soon.' };
      }
      console.warn('Supabase submitContactMessage error:', error.message);
    } catch (e) {
      console.error('Supabase submitContactMessage error:', e);
    }
  }

  // Local fallback save
  const existing = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, []);
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: msg.name,
    email: msg.email,
    subject: msg.subject || 'Website Inquiry',
    message: msg.message,
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString()
  };
  setLocal(STORAGE_KEYS.CONTACT_MESSAGES, [newMsg, ...existing]);
  return { success: true, message: 'Message recorded successfully! Adnan will reply promptly.' };
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setLocal(STORAGE_KEYS.CONTACT_MESSAGES, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchContactMessages fallback:', e);
    }
  }
  return getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, []);
}

export async function markContactMessageRead(id: string, is_read: boolean): Promise<void> {
  const client = getSupabaseClient();
  if (client && !id.startsWith('msg-')) {
    try {
      await client.from('contact_messages').update({ is_read }).eq('id', id);
    } catch (e) {
      console.error(e);
    }
  }
  const list = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, []);
  setLocal(
    STORAGE_KEYS.CONTACT_MESSAGES,
    list.map(m => (m.id === id ? { ...m, is_read } : m))
  );
}

export async function deleteContactMessage(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client && !id.startsWith('msg-')) {
    try {
      await client.from('contact_messages').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  }
  const list = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, []);
  setLocal(STORAGE_KEYS.CONTACT_MESSAGES, list.filter(m => m.id !== id));
}

// -------------------------------------------------------------
// LIVE CHAT CONVERSATIONS & REALTIME
// -------------------------------------------------------------
export async function getOrCreateChatConversation(
  visitorId: string,
  visitorName: string,
  visitorEmail?: string
): Promise<ChatConversation> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data } = await client
        .from('chat_conversations')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) return data;

      const { data: newConv, error } = await client
        .from('chat_conversations')
        .insert([{ visitor_id: visitorId, visitor_name: visitorName, visitor_email: visitorEmail || '' }])
        .select()
        .single();

      if (!error && newConv) return newConv;
    } catch (e) {
      console.warn('Supabase chat conversation error:', e);
    }
  }

  // Local fallback
  const convs = getLocal<ChatConversation[]>(STORAGE_KEYS.CHAT_CONVERSATIONS, []);
  let found = convs.find(c => c.visitor_id === visitorId);
  if (!found) {
    found = {
      id: `conv-${Date.now()}`,
      visitor_name: visitorName,
      visitor_email: visitorEmail,
      visitor_id: visitorId,
      status: 'open',
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    setLocal(STORAGE_KEYS.CHAT_CONVERSATIONS, [found, ...convs]);
  }
  return found;
}

export async function sendChatMessage(
  conversationId: string,
  senderType: 'visitor' | 'admin',
  messageText: string
): Promise<ChatMessage> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_type: senderType,
          message: messageText
        }])
        .select()
        .single();

      if (!error && data) {
        await client
          .from('chat_conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);
        return data;
      }
    } catch (e) {
      console.warn('Supabase sendChatMessage error:', e);
    }
  }

  // Local fallback
  const msgs = getLocal<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
  const newMsg: ChatMessage = {
    id: `cmsg-${Date.now()}`,
    conversation_id: conversationId,
    sender_type: senderType,
    message: messageText,
    is_read: false,
    created_at: new Date().toISOString()
  };
  setLocal(STORAGE_KEYS.CHAT_MESSAGES, [...msgs, newMsg]);

  // Update conversation last_message_at
  const convs = getLocal<ChatConversation[]>(STORAGE_KEYS.CHAT_CONVERSATIONS, []);
  setLocal(
    STORAGE_KEYS.CHAT_CONVERSATIONS,
    convs.map(c => (c.id === conversationId ? { ...c, last_message_at: newMsg.created_at } : c))
  );

  return newMsg;
}

export async function fetchChatMessages(conversationId: string): Promise<ChatMessage[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase fetchChatMessages error:', e);
    }
  }
  const msgs = getLocal<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
  return msgs.filter(m => m.conversation_id === conversationId);
}

export async function fetchAllChatConversations(): Promise<ChatConversation[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });
      if (!error && data) {
        setLocal(STORAGE_KEYS.CHAT_CONVERSATIONS, data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchAllChatConversations error:', e);
    }
  }
  return getLocal<ChatConversation[]>(STORAGE_KEYS.CHAT_CONVERSATIONS, []);
}

// -------------------------------------------------------------
// FILE / IMAGE UPLOAD TO SUPABASE STORAGE
// -------------------------------------------------------------
export async function uploadImageToStorage(
  file: File,
  folder = 'portfolio'
): Promise<{ success: boolean; url?: string; error?: string }> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG are accepted.' };
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Image size exceeds maximum limit of 5MB.' };
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data, error } = await client.storage
        .from('portfolio-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) {
        return { success: false, error: `Upload error: ${error.message}` };
      }

      const { data: pubData } = client.storage
        .from('portfolio-media')
        .getPublicUrl(data.path);

      return { success: true, url: pubData.publicUrl };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
    }
  }

  // Fallback: Read as Data URL so user can preview their uploaded image immediately!
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ success: true, url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read image locally.' });
    };
    reader.readAsDataURL(file);
  });
}
