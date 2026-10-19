import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings } from '../types';
import { submitContactMessage } from '../lib/supabase';

interface ContactSectionProps {
  settings: SiteSettings;
  prefilledSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  prefilledSubject = ''
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(prefilledSubject);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const whatsappDirect = `https://wa.me/${settings.whatsapp_international.replace(/\+/g, '').replace(/\s/g, '')}?text=Hi%20Adnan,%20I%20am%20reaching%20out%20from%20your%20website%20portfolio.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam bot catch
    if (honeypot) {
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields (Name, Email, Message).' });
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || 'General Inquiry',
        message: message.trim()
      });

      if (res.success) {
        setStatus({
          type: 'success',
          message: res.message || 'Thank you! Your message has been received. Adnan will reply promptly.'
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore confetti if not available
        }
      } else {
        setStatus({
          type: 'error',
          message: res.message || 'Failed to submit message. Please try again or reach out on WhatsApp.'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network issue while submitting. Please contact directly via WhatsApp.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Discuss <span className="gradient-text">Your Campaign</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Have a project, CPA offer promotion, or traffic inquiry? Send a message below or contact directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info & Fast Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">Connect Directly</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Fastest response is via WhatsApp. You can also send an email or fill in the secure inquiry form.
              </p>

              <div className="space-y-4">
                {/* WhatsApp Item */}
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-400 font-medium">Chat on WhatsApp</p>
                      <p className="text-sm font-bold text-white">{settings.whatsapp_international}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Email Item */}
                <a
                  href={`mailto:${settings.email}`}
                  className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-500/60 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400 font-medium">Send Official Email</p>
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{settings.email}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Local Phone Call Option */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Local Bangladesh Line</p>
                    <p className="text-sm font-bold text-white">{settings.whatsapp_number}</p>
                  </div>
                </div>
              </div>

              {/* Service Commitments */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Typical response time: Under 2 hours during active daytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Confidential campaign & NDA discussions supported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">Send an Inquiry</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Fill in the details below and your message will be saved securely to Adnan's inbox.
              </p>

              {status.type && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs sm:text-sm ${
                    status.type === 'success'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for anti-spam */}
                <input
                  type="text"
                  name="user_nickname"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. client@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject / Project Scope
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CPA Campaign Promotion / Affiliate Funnel"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell Adnan about your promotion goals, target audience, budget, or timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-y"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Message...
                    </span>
                  ) : (
                    <>
                      <span>Send Inquiry to Adnan</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
