import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Key,
  Globe,
  ShieldCheck,
  Code
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured
} from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        tested: true,
        success: false,
        message: 'Both Supabase Project URL and Anon Public Key are required.'
      });
      return;
    }

    saveSupabaseConfig(url.trim(), anonKey.trim());
    setIsTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message
    });

    if (res.success) {
      onConfigSaved();
    }
  };

  const handleTestNow = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message
    });
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult({
      tested: true,
      success: false,
      message: 'Cleared configuration. System is now running in local preview mode.'
    });
    onConfigSaved();
  };

  const copySqlToClipboard = () => {
    const sqlScript = `-- Run this in Supabase Dashboard -> SQL Editor
create extension if not exists "uuid-ossp";

-- 1. Site Settings
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  brand_name text not null default 'Freelancer Adnan',
  hero_headline text not null default 'Hi, I''m Adnan — Your Digital Growth Partner',
  hero_subheadline text not null default 'I''m a freelancer specializing in CPA Marketing, Affiliate Marketing, and Digital Promotion. I help businesses and online campaigns reach the right audience through strategic digital marketing.',
  profession text not null default 'Freelancer, CPA Marketer, Affiliate Marketer, Digital Marketer',
  bio text not null default 'Dedicated digital marketing and CPA specialist from Bhaluka, Mymensingh, Bangladesh.',
  profile_image_url text default 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  whatsapp_number text not null default '01618058572',
  whatsapp_international text not null default '+8801618058572',
  email text not null default 'adnan708620@gmail.com',
  country text not null default 'Bangladesh',
  division text not null default 'Mymensingh',
  district text not null default 'Mymensingh',
  upazila text not null default 'Bhaluka',
  village text not null default 'Paragaon, Panch Pai',
  social_links jsonb not null default '{"whatsapp":"https://wa.me/8801618058572"}'::jsonb,
  seo_title text default 'Freelancer Adnan — CPA & Digital Growth Portfolio',
  seo_description text default 'Official portfolio of Freelancer Adnan',
  affiliate_disclosure text default 'Disclosure: Some links are affiliate promotional links.',
  privacy_policy text default 'Inquiries are kept confidential.',
  theme_accent text default 'electric-blue',
  updated_at timestamptz default now()
);

-- 2. Services
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon_name text not null default 'Target',
  cta_text text default 'Contact Me',
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 3. Portfolio
create table if not exists public.portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  image_url text not null,
  project_url text default '',
  is_published boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 4. CPA Offers
create table if not exists public.cpa_offers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  image_url text not null,
  promo_url text not null,
  cta_text text default 'Claim Offer',
  category text not null default 'General',
  geo_target text not null default 'Worldwide',
  status text not null default 'active',
  expiry_date timestamptz,
  tracking_params text default '',
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 5. Contact Messages
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text default 'Inquiry',
  message text not null,
  is_read boolean default false,
  is_archived boolean default false,
  created_at timestamptz default now()
);

-- 6. Live Chat
create table if not exists public.chat_conversations (
  id uuid primary key default uuid_generate_v4(),
  visitor_name text not null,
  visitor_email text default '',
  visitor_id text not null,
  status text default 'open',
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.chat_conversations(id) on delete cascade,
  sender_type text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.cpa_offers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- Public Read & Insert policies
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Admin manage site_settings" on public.site_settings for all using (auth.role() = 'authenticated');

create policy "Public read services" on public.services for select using (is_active = true or auth.role() = 'authenticated');
create policy "Admin manage services" on public.services for all using (auth.role() = 'authenticated');

create policy "Public read portfolio" on public.portfolio_items for select using (is_published = true or auth.role() = 'authenticated');
create policy "Admin manage portfolio" on public.portfolio_items for all using (auth.role() = 'authenticated');

create policy "Public read cpa_offers" on public.cpa_offers for select using (status = 'active' or auth.role() = 'authenticated');
create policy "Admin manage cpa_offers" on public.cpa_offers for all using (auth.role() = 'authenticated');

create policy "Public insert contact_messages" on public.contact_messages for insert with check (true);
create policy "Admin manage contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated');

create policy "Public insert chat_conversations" on public.chat_conversations for insert with check (true);
create policy "Public read chat_conversations" on public.chat_conversations for select using (true);
create policy "Admin manage chat_conversations" on public.chat_conversations for all using (auth.role() = 'authenticated');

create policy "Public insert chat_messages" on public.chat_messages for insert with check (true);
create policy "Public read chat_messages" on public.chat_messages for select using (true);
create policy "Admin manage chat_messages" on public.chat_messages for all using (auth.role() = 'authenticated');

-- Storage bucket
insert into storage.buckets (id, name, public) values ('portfolio-media', 'portfolio-media', true) on conflict (id) do nothing;
create policy "Public read media" on storage.objects for select using (bucket_id = 'portfolio-media');
create policy "Admin upload media" on storage.objects for insert with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');
`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full bg-[#090e24] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Supabase Backend Integration</span>
                {isSupabaseConfigured() ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Configured
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Preview Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Connect your free Supabase PostgreSQL database, authentication, and file storage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            API Credentials
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'sql'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SQL Setup Script
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Netlify Deployment Guide
          </button>
        </div>

        {/* Tab 1: Configuration Form */}
        {activeTab === 'config' && (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Supabase project credentials. You can find them under{' '}
              <strong className="text-cyan-400">Project Settings → API</strong> in your Supabase dashboard.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supabase Project URL (VITE_SUPABASE_URL)</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                <span>Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none resize-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Use the safe, public <strong className="text-slate-400">anon public key</strong>. Never enter your secret service_role key into frontend forms.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Reset to Local Preview
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestNow}
                  disabled={isTesting || !url || !anonKey}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-40"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: SQL Setup Script */}
        {activeTab === 'sql' && (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300">
                Execute this SQL script in your Supabase SQL Editor to initialize all tables, RLS security policies, and media buckets.
              </p>
              <button
                onClick={copySqlToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-72 overflow-y-auto">
              <pre>{`-- 1. Create site_settings, services, portfolio_items, cpa_offers, contact_messages, chat_conversations, chat_messages
-- 2. Configure Row Level Security (RLS) policies
-- 3. Create 'portfolio-media' public storage bucket
-- Complete script located in /supabase/schema.sql`}</pre>
            </div>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Tab 3: Netlify Deployment Guide */}
        {activeTab === 'guide' && (
          <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-base">Deploying to Netlify in 3 Simple Steps:</h4>
            <ol className="list-decimal pl-5 space-y-2 text-slate-300">
              <li>
                <strong>Connect Git Repo to Netlify:</strong> Select your repository. Build Command: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-400">npm run build</code>, Publish Directory: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-400">dist</code>.
              </li>
              <li>
                <strong>Set Netlify Environment Variables:</strong> Go to Netlify Dashboard → Site configuration → Environment variables, and add:
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400 text-xs font-mono">
                  <li>VITE_SUPABASE_URL = your-supabase-url</li>
                  <li>VITE_SUPABASE_ANON_KEY = your-anon-key</li>
                  <li>APP_URL = https://your-site-name.netlify.app</li>
                </ul>
              </li>
              <li>
                <strong>Create Admin Account:</strong> In your Supabase dashboard → Authentication → Users, click <em>Add User</em>, enter your admin email (e.g. <code className="text-cyan-400">adnan708620@gmail.com</code>) and set a secure password. Then log in at <code className="text-cyan-400">/admin</code>!
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
