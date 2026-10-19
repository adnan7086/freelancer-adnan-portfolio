import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  FileText,
  Briefcase,
  Tag,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  ExternalLink,
  Eye,
  EyeOff,
  Database,
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Send,
  Phone
} from 'lucide-react';
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
  fetchSiteSettings,
  updateSiteSettings,
  fetchServices,
  saveService,
  deleteService,
  fetchPortfolio,
  savePortfolioItem,
  deletePortfolioItem,
  fetchCpaOffers,
  saveCpaOffer,
  deleteCpaOffer,
  fetchContactMessages,
  markContactMessageRead,
  deleteContactMessage,
  fetchAllChatConversations,
  fetchChatMessages,
  sendChatMessage,
  uploadImageToStorage,
  isSupabaseConfigured
} from '../lib/supabase';
import {
  adminSignIn,
  adminSignOut,
  getCurrentAdmin,
  AdminUser
} from '../lib/auth';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onOpenDbSetup: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onOpenDbSetup
}) => {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('adnan708620@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  type TabType =
    | 'overview'
    | 'profile'
    | 'services'
    | 'portfolio'
    | 'cpa-offers'
    | 'messages'
    | 'chats'
    | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Data states
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [offers, setOffers] = useState<CpaOffer[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Notifications / Save feedback
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Modals / Item Editors
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<PortfolioItem> | null>(null);
  const [editingOffer, setEditingOffer] = useState<Partial<CpaOffer> | null>(null);

  // Media uploading state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setAuthLoading(true);
    const user = await getCurrentAdmin();
    setCurrentUser(user);
    setAuthLoading(false);
    if (user) {
      loadAllData();
    }
  };

  const loadAllData = async () => {
    try {
      const [s, srv, port, off, msg, conv] = await Promise.all([
        fetchSiteSettings(),
        fetchServices(),
        fetchPortfolio(),
        fetchCpaOffers(),
        fetchContactMessages(),
        fetchAllChatConversations()
      ]);
      setSettings(s);
      setServices(srv);
      setPortfolio(port);
      setOffers(off);
      setMessages(msg);
      setChatConversations(conv);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const res = await adminSignIn(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      loadAllData();
    } else {
      setLoginError(res.error || 'Invalid email or password.');
    }
  };

  const handleLogout = async () => {
    await adminSignOut();
    setCurrentUser(null);
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      setSaveStatus({ success: true, message: 'Settings saved and updated successfully!' });
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: unknown) {
      setSaveStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Error saving settings.'
      });
    }
  };

  // Image Upload helper for profile / portfolio / offers
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const result = await uploadImageToStorage(file);
    setUploadingImage(false);

    if (result.success && result.url) {
      targetCallback(result.url);
      setSaveStatus({ success: true, message: 'Image uploaded successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus({ success: false, message: result.error || 'Failed to upload image.' });
    }
  };

  // Chat message fetcher
  const handleSelectConversation = async (conv: ChatConversation) => {
    setActiveChat(conv);
    try {
      const msgs = await fetchChatMessages(conv.id);
      setActiveChatMessages(msgs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !adminReplyText.trim()) return;

    const text = adminReplyText.trim();
    setAdminReplyText('');
    setIsSendingReply(true);

    try {
      const sent = await sendChatMessage(activeChat.id, 'admin', text);
      setActiveChatMessages((prev) => [...prev, sent]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Unread messages calculation
  const unreadCount = messages.filter((m) => !m.is_read).length;

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#090e24] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          {/* Back to site button */}
          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/25 mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Freelancer Adnan</h1>
            <p className="text-xs text-slate-400 mt-1">Admin Dashboard & Content Control</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="adnan708620@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-101 disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Setup / Instructions Card */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Backend Status:</span>
              <button
                onClick={onOpenDbSetup}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isSupabaseConfigured() ? 'Supabase Connected' : 'Configure Supabase'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When Supabase is connected, credentials are authenticated against Supabase Auth (Users table) with PostgreSQL Row Level Security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050814] text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#070b1a] border-r border-slate-800/80 flex flex-col shrink-0">
        {/* Brand header with Adnan's Photo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-[#050b1e] p-0.5 border border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)] overflow-hidden">
                <img
                  src={settings?.profile_image_url || '/adnan-profile.jpg'}
                  alt="Adnan"
                  className="w-full h-full object-cover object-top rounded-[10px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/adnan-profile.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#070b1a] rounded-full" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">{settings?.brand_name || 'Freelancer Adnan'}</h2>
              <p className="text-[10px] text-cyan-400 font-medium">Admin Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Headline & About Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'portfolio'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="flex-1 text-left">Portfolio Gallery</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
              {portfolio.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cpa-offers')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'cpa-offers'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span className="flex-1 text-left">CPA Offers</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              {offers.filter((o) => o.status === 'active').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'services'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Services & Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'messages'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span className="flex-1 text-left">Inquiries Inbox</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'chats'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="flex-1 text-left">Live Chat Threads</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
              {chatConversations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings & SEO</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onOpenDbSetup}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Database Setup</span>
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>

          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        {/* Top bar with quick status */}
        <header className="px-6 py-4 bg-[#070b1a]/90 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            {currentUser.isDemo && (
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Interactive Preview Session
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              title="Refresh Data"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onBackToSite}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Global Save Feedback Banner */}
        {saveStatus && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
              saveStatus.success
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
            }`}
          >
            {saveStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}

        <div className="p-6 space-y-6 flex-1">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Real statistics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
                    <span>Published Portfolio</span>
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">
                    {portfolio.filter((p) => p.is_published).length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Total items: {portfolio.length}</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
                    <span>Active CPA Offers</span>
                    <Tag className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">
                    {offers.filter((o) => o.status === 'active').length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Campaigns running</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
                    <span>Contact Messages</span>
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{messages.length}</p>
                  <p className="text-[11px] text-rose-400 mt-1">{unreadCount} unread inquiry</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
                    <span>Live Chat Threads</span>
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{chatConversations.length}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Visitor conversations</p>
                </div>
              </div>

              {/* Quick Profile Summary with Adnan's Photo */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Photo with rounded corners, dark navy background & subtle blue lighting */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#050b1e] p-1 border border-cyan-400/50 shadow-[0_0_25px_rgba(56,189,248,0.25)] overflow-hidden">
                      <img
                        src={settings?.profile_image_url || '/adnan-profile.jpg'}
                        alt="Freelancer Adnan"
                        className="w-full h-full object-cover object-top rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/adnan-profile.jpg';
                        }}
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Live
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{settings?.brand_name || 'Freelancer Adnan'}</h3>
                        <p className="text-xs text-cyan-400">{settings?.profession || 'CPA Marketer & Digital Growth Partner'}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="text-xs text-cyan-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl transition-all self-center sm:self-auto"
                      >
                        Change Photo / Bio →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-400">Current Photo URL:</span>
                        <p className="font-mono text-cyan-300 text-[11px] truncate mt-0.5">{settings?.profile_image_url || '/adnan-profile.jpg'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Primary Email:</span>
                        <p className="font-semibold text-white mt-0.5">{settings?.email}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">WhatsApp:</span>
                        <p className="font-semibold text-emerald-400 mt-0.5">
                          {settings?.whatsapp_international} ({settings?.whatsapp_number})
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Base Location:</span>
                        <p className="font-semibold text-white mt-0.5">
                          {settings?.village}, {settings?.upazila}, {settings?.district}, {settings?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Recent Contact Form Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    View All Inquiries →
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No contact inquiries yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-2">Sender</th>
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Subject</th>
                          <th className="pb-2">Date</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {messages.slice(0, 5).map((m) => (
                          <tr key={m.id} className="hover:bg-slate-900/50">
                            <td className="py-2.5 font-semibold text-white">{m.name}</td>
                            <td className="py-2.5 text-slate-400">{m.email}</td>
                            <td className="py-2.5 text-slate-300 truncate max-w-xs">{m.subject}</td>
                            <td className="py-2.5 text-slate-500">
                              {new Date(m.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 text-right">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  m.is_read
                                    ? 'bg-slate-800 text-slate-400'
                                    : 'bg-emerald-500/20 text-emerald-400 font-semibold'
                                }`}
                              >
                                {m.is_read ? 'Read' : 'New'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PROFILE & HEADLINE */}
          {/* ========================================================= */}
          {activeTab === 'profile' && settings && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
                <h3 className="text-base font-bold text-white mb-2">Homepage Hero & Bio Content</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.hero_headline}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_headline: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Subheadline
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={settings.hero_subheadline}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_subheadline: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-white focus:outline-none resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Professional Title / Roles
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.profession}
                    onChange={(e) =>
                      setSettings({ ...settings, profession: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    About Me Detailed Biography
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-white focus:outline-none resize-y"
                  />
                </div>

                {/* Profile Picture Upload & Preview with Dark Navy & Subtle Blue Lighting */}
                <div className="pt-5 border-t border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider">
                        Profile Photograph Settings
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Displayed on homepage Hero, Admin Dashboard, and Live Chat. Styled with rounded corners, dark navy background, and subtle blue rim lighting.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, profile_image_url: '/adnan-profile.jpg' })}
                      className="text-xs text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Use Default (/adnan-profile.jpg)</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                    {/* Visual Preview Card matching Hero aesthetics */}
                    <div className="relative group shrink-0">
                      <div className="w-32 h-36 sm:w-36 sm:h-44 rounded-2xl bg-[#050b1e] p-1.5 border border-cyan-400/50 shadow-[0_0_25px_rgba(56,189,248,0.25)] overflow-hidden">
                        <img
                          src={settings.profile_image_url || '/adnan-profile.jpg'}
                          alt="Adnan Profile Preview"
                          className="w-full h-full object-cover object-top rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/adnan-profile.jpg';
                          }}
                        />
                      </div>
                      <span className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-semibold text-cyan-300 bg-cyan-950/90 border border-cyan-500/40 py-0.5 rounded-md backdrop-blur-sm">
                        Live Preview
                      </span>
                    </div>

                    {/* Replacement Controls */}
                    <div className="space-y-4 flex-1 w-full text-xs">
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-medium">Image URL or Static Path:</label>
                        <input
                          type="text"
                          required
                          placeholder="/adnan-profile.jpg"
                          value={settings.profile_image_url}
                          onChange={(e) =>
                            setSettings({ ...settings, profile_image_url: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-500">
                          Recommended: <code className="text-cyan-400 font-mono">/adnan-profile.jpg</code> for Netlify production deployment.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white cursor-pointer shadow-md flex items-center gap-2 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Uploading Image...' : 'Upload New Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url) =>
                                setSettings({ ...settings, profile_image_url: url })
                              )
                            }
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, profile_image_url: '/adnan-profile.jpg' })}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          Reset to /adnan-profile.jpg
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-slate-400 text-[11px] leading-relaxed">
                        💡 <strong>Netlify Ready:</strong> Placing your photo in <code className="text-cyan-300">public/adnan-profile.jpg</code> guarantees it loads instantly and reliably on Netlify without any third-party image host dependencies.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PORTFOLIO & WORK GALLERY */}
          {/* ========================================================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Portfolio Projects & Screenshots</h3>
                  <p className="text-xs text-slate-400">
                    Upload and manage marketing screenshots, banners, YouTube designs, and case studies.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingPortfolio({
                      title: '',
                      description: '',
                      category: 'CPA Marketing',
                      image_url:
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                      project_url: '',
                      is_published: true,
                      order_index: portfolio.length + 1
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Portfolio Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-950">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-slate-900/90 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.is_published
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={async () => {
                            const updated = await savePortfolioItem({
                              ...item,
                              is_published: !item.is_published
                            });
                            setPortfolio((prev) =>
                              prev.map((p) => (p.id === item.id ? updated : p))
                            );
                          }}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {item.is_published ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" /> <span>Publish</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingPortfolio(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this portfolio project?')) {
                                await deletePortfolioItem(item.id);
                                setPortfolio((prev) => prev.filter((p) => p.id !== item.id));
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit / Create Portfolio Modal */}
              {editingPortfolio && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <div className="bg-[#090e24] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-white">
                        {editingPortfolio.id ? 'Edit Project' : 'Add New Portfolio Project'}
                      </h4>
                      <button
                        onClick={() => setEditingPortfolio(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPortfolio.title || ''}
                        onChange={(e) =>
                          setEditingPortfolio({ ...editingPortfolio, title: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={editingPortfolio.category || 'CPA Marketing'}
                        onChange={(e) =>
                          setEditingPortfolio({ ...editingPortfolio, category: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="CPA Marketing">CPA Marketing</option>
                        <option value="Affiliate Marketing">Affiliate Marketing</option>
                        <option value="Landing Pages">Landing Pages</option>
                        <option value="Promotional Banners">Promotional Banners</option>
                        <option value="YouTube Thumbnails">YouTube Thumbnails</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Web Development">Web Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingPortfolio.description || ''}
                        onChange={(e) =>
                          setEditingPortfolio({ ...editingPortfolio, description: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Project Image
                      </label>
                      <div className="space-y-2">
                        <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer inline-flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url) =>
                                setEditingPortfolio({ ...editingPortfolio, image_url: url })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Or paste image URL"
                          value={editingPortfolio.image_url || ''}
                          onChange={(e) =>
                            setEditingPortfolio({ ...editingPortfolio, image_url: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Optional Live Link / WhatsApp Inquiry Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editingPortfolio.project_url || ''}
                        onChange={(e) =>
                          setEditingPortfolio({ ...editingPortfolio, project_url: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pub_check"
                        checked={editingPortfolio.is_published ?? true}
                        onChange={(e) =>
                          setEditingPortfolio({
                            ...editingPortfolio,
                            is_published: e.target.checked
                          })
                        }
                        className="rounded bg-slate-950 border-slate-800 text-cyan-500"
                      />
                      <label htmlFor="pub_check" className="text-xs text-slate-300">
                        Published immediately on website
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setEditingPortfolio(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!editingPortfolio.title || !editingPortfolio.image_url) {
                            alert('Title and Image are required.');
                            return;
                          }
                          const saved = await savePortfolioItem(editingPortfolio);
                          setPortfolio((prev) => {
                            const exists = prev.find((p) => p.id === saved.id);
                            if (exists) {
                              return prev.map((p) => (p.id === saved.id ? saved : p));
                            }
                            return [saved, ...prev];
                          });
                          setEditingPortfolio(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white"
                      >
                        Save Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CPA OFFERS & AFFILIATE DEALS */}
          {/* ========================================================= */}
          {activeTab === 'cpa-offers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">CPA Offers & Affiliate Promotions</h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, pause, and track your active CPA promotional offers.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingOffer({
                      title: '',
                      description: '',
                      image_url:
                        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                      promo_url: 'https://wa.me/8801618058572',
                      cta_text: 'Claim Offer',
                      category: 'Special',
                      geo_target: 'Worldwide',
                      status: 'active',
                      order_index: offers.length + 1
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Offer</span>
                </button>
              </div>

              {/* Offers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="glass-panel rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-950">
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                        {offer.category}
                      </span>
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          offer.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white mb-1">{offer.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {offer.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                          <span>Target: <strong className="text-cyan-400">{offer.geo_target}</strong></span>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={async () => {
                            const newStatus = offer.status === 'active' ? 'paused' : 'active';
                            const updated = await saveCpaOffer({ ...offer, status: newStatus });
                            setOffers((prev) =>
                              prev.map((o) => (o.id === offer.id ? updated : o))
                            );
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          {offer.status === 'active' ? 'Pause Offer' : 'Activate'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingOffer(offer)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this CPA offer?')) {
                                await deleteCpaOffer(offer.id);
                                setOffers((prev) => prev.filter((o) => o.id !== offer.id));
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CPA Offer Edit Modal */}
              {editingOffer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <div className="bg-[#090e24] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-white">
                        {editingOffer.id ? 'Edit CPA Offer' : 'Add New CPA Offer'}
                      </h4>
                      <button
                        onClick={() => setEditingOffer(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Offer Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingOffer.title || ''}
                        onChange={(e) =>
                          setEditingOffer({ ...editingOffer, title: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingOffer.category || 'Special'}
                          onChange={(e) =>
                            setEditingOffer({ ...editingOffer, category: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          GEO Targeting
                        </label>
                        <input
                          type="text"
                          placeholder="Worldwide / US, UK, BD"
                          value={editingOffer.geo_target || 'Worldwide'}
                          onChange={(e) =>
                            setEditingOffer({ ...editingOffer, geo_target: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Offer Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingOffer.description || ''}
                        onChange={(e) =>
                          setEditingOffer({ ...editingOffer, description: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Promotional Destination URL
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://affiliate-network.com/offer?ref=adnan"
                        value={editingOffer.promo_url || ''}
                        onChange={(e) =>
                          setEditingOffer({ ...editingOffer, promo_url: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={editingOffer.cta_text || 'Claim Offer'}
                          onChange={(e) =>
                            setEditingOffer({ ...editingOffer, cta_text: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Status
                        </label>
                        <select
                          value={editingOffer.status || 'active'}
                          onChange={(e) =>
                            setEditingOffer({
                              ...editingOffer,
                              status: e.target.value as 'active' | 'inactive' | 'paused'
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Banner Image URL
                      </label>
                      <div className="space-y-2">
                        <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer inline-flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Banner</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url) =>
                                setEditingOffer({ ...editingOffer, image_url: url })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          value={editingOffer.image_url || ''}
                          onChange={(e) =>
                            setEditingOffer({ ...editingOffer, image_url: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setEditingOffer(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!editingOffer.title || !editingOffer.promo_url) {
                            alert('Title and Promo URL are required.');
                            return;
                          }
                          const saved = await saveCpaOffer(editingOffer);
                          setOffers((prev) => {
                            const exists = prev.find((o) => o.id === saved.id);
                            if (exists) {
                              return prev.map((o) => (o.id === saved.id ? saved : o));
                            }
                            return [saved, ...prev];
                          });
                          setEditingOffer(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white"
                      >
                        Save Offer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SERVICES & SKILLS */}
          {/* ========================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Marketing Services Management</h3>
                  <p className="text-xs text-slate-400">
                    Enable, disable, or modify your 8 core marketing services.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingService({
                      title: '',
                      description: '',
                      icon_name: 'Target',
                      cta_text: 'Contact Me',
                      is_active: true,
                      order_index: services.length + 1
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-sm text-white">{srv.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            srv.is_active
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {srv.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {srv.description}
                      </p>
                      <span className="text-[11px] text-cyan-400 font-semibold">
                        CTA: {srv.cta_text || 'Contact Me'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={async () => {
                          const updated = await saveService({
                            ...srv,
                            is_active: !srv.is_active
                          });
                          setServices((prev) =>
                            prev.map((s) => (s.id === srv.id ? updated : s))
                          );
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title={srv.is_active ? 'Disable' : 'Enable'}
                      >
                        {srv.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingService(srv)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete service: ${srv.title}?`)) {
                            await deleteService(srv.id);
                            setServices((prev) => prev.filter((s) => s.id !== srv.id));
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Modal */}
              {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <div className="bg-[#090e24] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-white">
                        {editingService.id ? 'Edit Service' : 'Add New Service'}
                      </h4>
                      <button
                        onClick={() => setEditingService(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingService.title || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.description || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, description: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        CTA Text
                      </label>
                      <input
                        type="text"
                        value={editingService.cta_text || 'Contact Me'}
                        onChange={(e) =>
                          setEditingService({ ...editingService, cta_text: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!editingService.title) return;
                          const saved = await saveService(editingService);
                          setServices((prev) => {
                            const exists = prev.find((s) => s.id === saved.id);
                            if (exists) {
                              return prev.map((s) => (s.id === saved.id ? saved : s));
                            }
                            return [...prev, saved];
                          });
                          setEditingService(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white"
                      >
                        Save Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: INQUIRIES & CONTACT MESSAGES */}
          {/* ========================================================= */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Client Inquiries & Contact Submissions</h3>
                  <p className="text-xs text-slate-400">
                    Review messages submitted from the public contact form.
                  </p>
                </div>
                <span className="text-xs text-slate-400">Total: {messages.length} messages</span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No contact submissions found.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`glass-panel p-5 rounded-2xl border transition-all ${
                        msg.is_read
                          ? 'border-slate-800'
                          : 'border-cyan-500/50 bg-slate-900/90 shadow-lg'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">{msg.name}</h4>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-xs text-cyan-400 hover:underline"
                            >
                              {msg.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{new Date(msg.created_at).toLocaleString()}</span>
                          <button
                            onClick={async () => {
                              await markContactMessageRead(msg.id, !msg.is_read);
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m.id === msg.id ? { ...m, is_read: !m.is_read } : m
                                )
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              msg.is_read
                                ? 'bg-slate-800 text-slate-400 hover:text-white'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete message?')) {
                                await deleteContactMessage(msg.id);
                                setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                              }
                            }}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-semibold text-indigo-300 mb-1">
                          Subject: {msg.subject || 'Website Inquiry'}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      {/* Quick 1-click reply action buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3">
                        <a
                          href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject || 'Your Inquiry to Freelancer Adnan')}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>

                        <a
                          href={`https://wa.me/?text=Hi%20${encodeURIComponent(msg.name)},%20I%20am%20Freelancer%20Adnan%20following%20up%20on%20your%20inquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Open in WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: LIVE CHAT INBOX */}
          {/* ========================================================= */}
          {activeTab === 'chats' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Live Chat Conversations</h3>
                <p className="text-xs text-slate-400">
                  Read and respond directly to visitors who opened the live chat widget.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                {/* Conversation Threads Sidebar */}
                <div className="lg:col-span-5 glass-panel rounded-2xl border border-slate-800 p-4 space-y-2 overflow-y-auto max-h-[600px]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Threads ({chatConversations.length})
                  </h4>

                  {chatConversations.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">
                      No active chat conversations yet.
                    </p>
                  ) : (
                    chatConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 ${
                          activeChat?.id === conv.id
                            ? 'bg-cyan-500/15 border border-cyan-500/40'
                            : 'hover:bg-slate-900 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
                          {conv.visitor_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white truncate">
                              {conv.visitor_name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(conv.last_message_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {conv.visitor_email && (
                            <p className="text-[11px] text-slate-400 truncate">{conv.visitor_email}</p>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Conversation Message Pane */}
                <div className="lg:col-span-7 glass-panel rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden">
                  {activeChat ? (
                    <>
                      {/* Active header */}
                      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{activeChat.visitor_name}</h4>
                          <p className="text-[11px] text-slate-400">
                            {activeChat.visitor_email || 'No email provided'} • Visitor ID: {activeChat.visitor_id}
                          </p>
                        </div>
                        {activeChat.visitor_email && (
                          <a
                            href={`mailto:${activeChat.visitor_email}`}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400"
                            title="Email Visitor"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Messages scroll */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[400px]">
                        {activeChatMessages.map((m) => {
                          const isAdmin = m.sender_type === 'admin';
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-xl text-xs ${
                                  isAdmin
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                                }`}
                              >
                                <p className="leading-relaxed">{m.message}</p>
                                <span className="text-[10px] text-slate-400 block mt-1">
                                  {new Date(m.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                        <input
                          type="text"
                          placeholder={`Reply as Freelancer Adnan to ${activeChat.visitor_name}...`}
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="submit"
                          disabled={!adminReplyText.trim() || isSendingReply}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-semibold disabled:opacity-40"
                        >
                          Send
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-xs">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                      <p>Select a conversation thread to view messages and reply.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: WEBSITE SETTINGS & SEO */}
          {/* ========================================================= */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
                <h3 className="text-base font-bold text-white mb-2">Global Settings & Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.brand_name}
                      onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Official Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp International Number
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsapp_international}
                      onChange={(e) =>
                        setSettings({ ...settings, whatsapp_international: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Local Bangladesh Line
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsapp_number}
                      onChange={(e) =>
                        setSettings({ ...settings, whatsapp_number: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Physical Location Details */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Geographic Base Coordinates
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Village
                      </label>
                      <input
                        type="text"
                        value={settings.village}
                        onChange={(e) => setSettings({ ...settings, village: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Upazila / PS
                      </label>
                      <input
                        type="text"
                        value={settings.upazila}
                        onChange={(e) => setSettings({ ...settings, upazila: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        District & Division
                      </label>
                      <input
                        type="text"
                        value={settings.district}
                        onChange={(e) => setSettings({ ...settings, district: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Social Media Profiles (Platforms without URLs are hidden automatically)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">WhatsApp URL</label>
                      <input
                        type="url"
                        value={settings.social_links?.whatsapp || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social_links: { ...settings.social_links, whatsapp: e.target.value }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Telegram URL</label>
                      <input
                        type="url"
                        value={settings.social_links?.telegram || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social_links: { ...settings.social_links, telegram: e.target.value }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">YouTube Channel URL</label>
                      <input
                        type="url"
                        value={settings.social_links?.youtube || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social_links: { ...settings.social_links, youtube: e.target.value }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settings.social_links?.facebook || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social_links: { ...settings.social_links, facebook: e.target.value }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={settings.social_links?.linkedin || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social_links: { ...settings.social_links, linkedin: e.target.value }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settings.social_links?.instagram || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social_links: { ...settings.social_links, instagram: e.target.value }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO & Legal Disclosures */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    SEO & Legal Disclosures
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={settings.seo_title}
                      onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={settings.seo_description}
                      onChange={(e) =>
                        setSettings({ ...settings, seo_description: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Affiliate & CPA Disclosure Text
                    </label>
                    <textarea
                      rows={2}
                      value={settings.affiliate_disclosure}
                      onChange={(e) =>
                        setSettings({ ...settings, affiliate_disclosure: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white resize-y"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Settings</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
