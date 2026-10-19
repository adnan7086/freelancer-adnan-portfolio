-- =========================================================================
-- FREELANCER ADNAN — SUPABASE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- =========================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all tables, initial seed data, indexes, Row Level Security (RLS) policies,
-- and public storage buckets for media uploads.
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SETTINGS / PROFILE TABLE
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null default 'Freelancer Adnan',
  hero_headline text not null default 'Hi, I''m Adnan — Your Digital Growth Partner',
  hero_subheadline text not null default 'I''m a freelancer specializing in CPA Marketing, Affiliate Marketing, and Digital Promotion. I help businesses and online campaigns reach the right audience through strategic digital marketing.',
  profession text not null default 'Freelancer, CPA Marketer, Affiliate Marketer, Digital Marketer',
  bio text not null default 'Dedicated digital marketing and CPA specialist from Bhaluka, Mymensingh, Bangladesh. I create high-converting promotional campaigns, affiliate funnels, and targeted audience engagement strategies for global businesses and affiliate networks.',
  profile_image_url text default '/adnan-profile.jpg',
  logo_url text default '',
  whatsapp_number text not null default '01618058572',
  whatsapp_international text not null default '+8801618058572',
  email text not null default 'adnan708620@gmail.com',
  country text not null default 'Bangladesh',
  division text not null default 'Mymensingh',
  district text not null default 'Mymensingh',
  upazila text not null default 'Bhaluka',
  village text not null default 'Paragaon, Panch Pai',
  social_links jsonb not null default '{
    "whatsapp": "https://wa.me/8801618058572",
    "facebook": "https://facebook.com",
    "youtube": "https://youtube.com",
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com",
    "telegram": "https://t.me/freelanceradnan"
  }'::jsonb,
  seo_title text default 'Freelancer Adnan — CPA Marketing & Digital Growth Specialist',
  seo_description text default 'Professional portfolio of Freelancer Adnan. Specializing in CPA Marketing, Affiliate Campaigns, Audience Traffic, and High-Converting Promotion.',
  affiliate_disclosure text default 'Disclosure: Some links on this website are affiliate and CPA promotional links. When you click and take action through these links, I may earn a promotional commission at no extra cost to you. I only recommend tested and legitimate campaigns.',
  privacy_policy text default 'We respect your privacy. Contact details and live chat communications are used strictly for project inquiries and client communications.',
  theme_accent text default 'electric-cyan',
  updated_at timestamptz default now()
);

-- 2. SERVICES TABLE
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon_name text not null default 'TrendingUp',
  cta_text text default 'Contact Me',
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 3. PORTFOLIO & WORK GALLERY
create table if not exists public.portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null, -- 'CPA Marketing', 'Affiliate Campaigns', 'Landing Pages', 'Promotional Banners', 'YouTube Thumbnails', 'Web Projects'
  image_url text not null,
  project_url text default '',
  is_published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 4. CPA OFFERS & AFFILIATE PROMOTIONS
create table if not exists public.cpa_offers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  image_url text not null,
  promo_url text not null,
  cta_text text default 'Claim Offer',
  category text not null default 'General',
  geo_target text not null default 'Worldwide',
  status text not null default 'active', -- 'active', 'paused', 'expired'
  expiry_date timestamptz,
  tracking_params text default '',
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 5. CONTACT FORM MESSAGES
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text default 'General Inquiry',
  message text not null,
  is_read boolean default false,
  is_archived boolean default false,
  created_at timestamptz default now()
);

-- 6. LIVE CHAT CONVERSATIONS
create table if not exists public.chat_conversations (
  id uuid primary key default uuid_generate_v4(),
  visitor_name text not null,
  visitor_email text default '',
  visitor_id text not null,
  status text default 'open', -- 'open', 'closed', 'archived'
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 7. LIVE CHAT MESSAGES
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.chat_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'admin')),
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.cpa_offers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- 1. Site Settings Policies: Public can read, authenticated can modify
create policy "Allow public read site_settings" on public.site_settings
  for select using (true);

create policy "Allow authenticated update site_settings" on public.site_settings
  for all using (auth.role() = 'authenticated');

-- 2. Services Policies: Public can read active services, authenticated can full CRUD
create policy "Allow public read active services" on public.services
  for select using (is_active = true or auth.role() = 'authenticated');

create policy "Allow authenticated manage services" on public.services
  for all using (auth.role() = 'authenticated');

-- 3. Portfolio Policies: Public can read published items, authenticated can full CRUD
create policy "Allow public read published portfolio" on public.portfolio_items
  for select using (is_published = true or auth.role() = 'authenticated');

create policy "Allow authenticated manage portfolio" on public.portfolio_items
  for all using (auth.role() = 'authenticated');

-- 4. CPA Offers Policies: Public can read active offers, authenticated can full CRUD
create policy "Allow public read active cpa_offers" on public.cpa_offers
  for select using (status = 'active' or auth.role() = 'authenticated');

create policy "Allow authenticated manage cpa_offers" on public.cpa_offers
  for all using (auth.role() = 'authenticated');

-- 5. Contact Messages Policies: Public can insert, authenticated can read/manage
create policy "Allow public insert contact_messages" on public.contact_messages
  for insert with check (true);

create policy "Allow authenticated manage contact_messages" on public.contact_messages
  for all using (auth.role() = 'authenticated');

-- 6. Chat Conversations Policies: Public can create & read their own via visitor_id, authenticated can read all
create policy "Allow public insert chat_conversations" on public.chat_conversations
  for insert with check (true);

create policy "Allow public read own conversation" on public.chat_conversations
  for select using (true);

create policy "Allow authenticated manage chat_conversations" on public.chat_conversations
  for all using (auth.role() = 'authenticated');

-- 7. Chat Messages Policies: Public can insert messages, read conversation messages
create policy "Allow public insert chat_messages" on public.chat_messages
  for insert with check (true);

create policy "Allow read chat_messages" on public.chat_messages
  for select using (true);

create policy "Allow authenticated manage chat_messages" on public.chat_messages
  for all using (auth.role() = 'authenticated');

-- =========================================================================
-- STORAGE BUCKET CONFIGURATION FOR IMAGE UPLOADS
-- =========================================================================
-- Creates bucket 'portfolio-media' for profile photos, work gallery & CPA banners
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "Public read portfolio-media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "Authenticated upload portfolio-media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "Authenticated update/delete portfolio-media"
  on storage.objects for all
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================

-- Seed default site settings if table is empty
insert into public.site_settings (id, brand_name, hero_headline, hero_subheadline)
select 
  uuid_generate_v4(),
  'Freelancer Adnan',
  'Hi, I''m Adnan — Your Digital Growth Partner',
  'I''m a freelancer specializing in CPA Marketing, Affiliate Marketing, and Digital Promotion. I help businesses and online campaigns reach the right audience through strategic digital marketing.'
where not exists (select 1 from public.site_settings);

-- Seed Services
insert into public.services (title, description, icon_name, order_index) values
  ('CPA Marketing', 'High-ROI Cost-Per-Action campaign architecture, audience segmentation, and optimized conversion pathways across top affiliate networks.', 'Target', 1),
  ('Affiliate Marketing', 'Promoting verified affiliate products with bespoke review funnels, high-intent traffic targeting, and strategic link placement.', 'Share2', 2),
  ('Digital Marketing', 'Full-spectrum online visibility strategies spanning social advertising, search placements, and organic content distribution.', 'Globe', 3),
  ('Landing Page Promotion', 'Designing and driving pre-qualified visitors to lightning-fast, high-converting landing pages built for peak conversion rates.', 'Layers', 4),
  ('Campaign Optimization', 'Data-backed A/B testing, pixel tracking, audience retargeting, and budget efficiency to maximize cost-per-lead performance.', 'BarChart3', 5),
  ('Online Audience Engagement', 'Building engaged communities, niche subscriber lists, and targeted traffic pipelines that convert consistently.', 'Users', 6),
  ('Promotional Content & Link Management', 'Strategic promotional copywriting, tracking parameter setup, sponsored attribution, and link hygiene monitoring.', 'Link2', 7),
  ('Website & Portfolio Development', 'Fast, modern, mobile-first responsive portfolio sites and promotional web landing pages optimized for search engines.', 'Code', 8)
on conflict do nothing;

-- Seed Sample Portfolio Projects
insert into public.portfolio_items (title, description, category, image_url, project_url, order_index) values
  ('E-commerce CPA Campaign Funnel', 'Targeted international CPA campaign generating high-volume verified leads through tailored promotional landing flows.', 'CPA Marketing', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 'https://wa.me/8801618058572', 1),
  ('High-Converting SaaS Landing Page', 'Custom dark-themed landing page with interactive offer elements, optimized for desktop and mobile conversion rates.', 'Landing Pages', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', '', 2),
  ('Affiliate Product Review & Bonus Hub', 'Clean affiliate promotional portal with video walkthroughs, sponsored link disclosures, and incentive claims.', 'Affiliate Campaigns', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', '', 3),
  ('High-CTR YouTube Promotional Thumbnails', 'Bold, click-optimized graphic design package for affiliate marketing video series and CPA offer tutorials.', 'Promotional Banners', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', '', 4)
on conflict do nothing;

-- Seed Sample Active CPA Offers
insert into public.cpa_offers (title, description, image_url, promo_url, cta_text, category, geo_target, status, order_index) values
  ('Premium Web Hosting & Cloud Bonus', 'Get up to 75% discount plus a free domain on industry-leading cloud hosting. Perfect for fast landing pages.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', 'https://wa.me/8801618058572?text=Inquiry%20about%20Hosting%20Offer', 'Get Discount Now', 'Tech & Tools', 'Worldwide', 'active', 1),
  ('AI Marketing Automation Suite Trial', 'Unlock automated email sequences and high-converting campaign optimization tools with a 14-day free trial.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 'https://wa.me/8801618058572?text=Inquiry%20about%20AI%20Marketing%20Trial', 'Start Free Trial', 'Software', 'US, UK, CA, BD', 'active', 2),
  ('Digital Creator All-in-One Toolkit', 'Complete bundle of high-converting landing page templates, banner graphics, and copywriting blueprints.', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80', 'https://wa.me/8801618058572?text=Inquiry%20about%20Creator%20Toolkit', 'Access Bundle', 'Resources', 'Worldwide', 'active', 3)
on conflict do nothing;
