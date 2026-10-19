import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  User,
  Clock
} from 'lucide-react';
import { SiteSettings, ChatMessage, ChatConversation } from '../types';
import {
  isSupabaseConfigured,
  getOrCreateChatConversation,
  sendChatMessage,
  fetchChatMessages
} from '../lib/supabase';

interface ChatWidgetProps {
  settings: SiteSettings;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDbConfigured = isSupabaseConfigured();

  // Retrieve or create visitor identifier
  const getVisitorId = () => {
    let vid = localStorage.getItem('freelancer_adnan_visitor_id');
    if (!vid) {
      vid = `v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('freelancer_adnan_visitor_id', vid);
    }
    return vid;
  };

  // Restore existing chat session if present
  useEffect(() => {
    const savedName = localStorage.getItem('freelancer_adnan_visitor_name');
    const savedConvId = localStorage.getItem('freelancer_adnan_conv_id');

    if (savedName) {
      setVisitorName(savedName);
      setHasStarted(true);
    }

    if (savedConvId) {
      loadMessages(savedConvId);
    }
  }, []);

  const loadMessages = async (convId: string) => {
    try {
      const msgs = await fetchChatMessages(convId);
      setMessages(msgs);
    } catch (e) {
      console.warn('Failed to load chat messages:', e);
    }
  };

  // Periodic poll for new replies when open
  useEffect(() => {
    if (!isOpen || !conversation?.id) return;
    const interval = setInterval(() => {
      loadMessages(conversation.id);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    setIsLoading(true);
    try {
      const vid = getVisitorId();
      localStorage.setItem('freelancer_adnan_visitor_name', visitorName.trim());
      const conv = await getOrCreateChatConversation(vid, visitorName.trim(), visitorEmail.trim());
      setConversation(conv);
      localStorage.setItem('freelancer_adnan_conv_id', conv.id);
      setHasStarted(true);

      // If user typed an initial message
      if (messageText.trim()) {
        const sent = await sendChatMessage(conv.id, 'visitor', messageText.trim());
        setMessages((prev) => [...prev, sent]);
        setMessageText('');
      } else {
        await loadMessages(conv.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !conversation) return;

    const text = messageText.trim();
    setMessageText('');

    try {
      const sent = await sendChatMessage(conversation.id, 'visitor', text);
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const whatsappDirect = `https://wa.me/${settings.whatsapp_international.replace(/\+/g, '').replace(/\s/g, '')}?text=Hi%20Adnan,%20I%20am%20chatting%20from%20your%20website.`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="relative group flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300"
          aria-label="Open Live Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 fill-current" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#050814] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#050814] rounded-full" />
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide">
            Chat with Adnan
          </span>
        </button>
      )}

      {/* Modern Glass Chat Box */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#090e24]/95 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={settings.profile_image_url || '/adnan-profile.jpg'}
                  alt="Freelancer Adnan"
                  className="w-10 h-10 rounded-xl object-cover object-top border border-cyan-400/50 bg-[#050b1e] shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/adnan-profile.jpg';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{settings.brand_name || 'Freelancer Adnan'}</span>
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  Online • CPA Specialist
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                title="Switch to WhatsApp"
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
            {/* Automatic Welcome Message from Adnan */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-3.5 text-slate-200 max-w-[85%] shadow-md">
                <p className="font-semibold text-cyan-300 text-xs mb-1">Freelancer Adnan</p>
                <p className="leading-relaxed">
                  Hi! Welcome to my portfolio. How can I help grow your CPA marketing campaign or digital reach today?
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block">Just now</span>
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.map((m) => {
              const isMe = m.sender_type === 'visitor';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      isMe
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
                    }`}
                  >
                    {!isMe && (
                      <p className="font-semibold text-purple-300 text-[11px] mb-1">Freelancer Adnan</p>
                    )}
                    <p className="leading-relaxed break-words">{m.message}</p>
                    <div
                      className={`flex items-center gap-1 text-[10px] mt-1 ${
                        isMe ? 'text-cyan-200 justify-end' : 'text-slate-500'
                      }`}
                    >
                      <span>
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Area: Input form or Visitor Registration */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            {!hasStarted ? (
              <form onSubmit={handleStartChat} className="space-y-2">
                <div className="text-[11px] text-slate-400">
                  Introduce yourself to start chatting directly:
                </div>
                <input
                  type="text"
                  required
                  placeholder="Your Name (required)"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email or WhatsApp (optional)"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs py-2 rounded-lg transition-all"
                >
                  {isLoading ? 'Starting...' : 'Start Live Chat'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* WhatsApp Alternative Link */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Private & Secure
              </span>
              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <span>Prefer WhatsApp?</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
