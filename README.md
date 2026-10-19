# Freelancer Adnan — Premium CPA & Digital Marketing Portfolio

A modern, high-converting, responsive personal portfolio website and promotional hub built for **Freelancer Adnan**, a freelancer specializing in CPA Marketing, Affiliate Marketing, Digital Promotion, and Traffic Generation based in Bhaluka, Mymensingh, Bangladesh.

---

## 🚀 Live Demo & Brand Information

- **Brand Name:** Freelancer Adnan
- **Profession:** Freelancer, CPA Marketer, Affiliate Marketer, Digital Marketer
- **WhatsApp:** `01618058572` (Local) / `+8801618058572` (International)
- **Direct WhatsApp:** [wa.me/8801618058572](https://wa.me/8801618058572)
- **Email:** `adnan708620@gmail.com`
- **Location:** Village: Paragaon, Panch Pai; Upazila: Bhaluka; District: Mymensingh; Bangladesh
- **Admin Dashboard Route:** `/admin`

---

## 🛠 Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS 4 with custom dark navy/electric-blue/purple glassmorphism
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security, Supabase Auth, Storage)
- **Hosting & Deployment:** Netlify (Zero-config build, SPA routing redirects, security headers)

---

## 📦 Project Structure

```
├── /public
│   ├── _redirects             # Netlify SPA fallback routing
│   ├── robots.txt             # Search engine crawling rules
│   └── sitemap.xml            # XML sitemap for SEO
├── /src
│   ├── /components
│   │   ├── Navbar.tsx         # Responsive navbar, logo, WhatsApp CTA, DB status
│   │   ├── Hero.tsx           # Striking hero, portrait frame, CTA buttons, metrics
│   │   ├── About.tsx          # Adnan's bio, location, competencies, contact links
│   │   ├── Services.tsx       # 8 core marketing services with custom icons
│   │   ├── Portfolio.tsx      # Filterable work gallery with image lightbox modal
│   │   ├── CpaOffers.tsx      # Curated CPA campaigns with rel="sponsored" & disclosure
│   │   ├── LocationSection.tsx# Physical address & radar map visualization
│   │   ├── ContactSection.tsx # Validated inquiry form, anti-spam honeypot, confetti
│   │   ├── ChatWidget.tsx     # Floating live chat with real-time & WhatsApp handoff
│   │   ├── Footer.tsx         # Social channels, disclosure, navigation, admin link
│   │   └── SupabaseSetupModal.tsx # Built-in connection tester & SQL viewer
│   ├── /data
│   │   └── initialData.ts     # Verified seed content for Freelancer Adnan
│   ├── /lib
│   │   ├── auth.ts            # Admin authentication (Supabase Auth & session handler)
│   │   └── supabase.ts        # Supabase client, queries, storage uploader & fallback
│   ├── /pages
│   │   ├── AdminDashboard.tsx # Comprehensive admin control panel at /admin
│   │   └── NotFound.tsx       # Custom 404 page
│   ├── /types
│   │   └── index.ts           # Full TypeScript data contracts
│   ├── App.tsx                # App root with seamless /admin routing
│   ├── index.css              # Glassmorphism, typography, and glow utilities
│   └── main.tsx               # React DOM entry
├── /supabase
│   └── schema.sql             # Complete PostgreSQL schema, tables, RLS policies, buckets
├── .env.example               # Environment variables template
├── netlify.toml               # Netlify production build configuration & SPA redirects
└── package.json
```

---

## ⚡ Quick Start (Local Development)

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Cloud Backend Setup

The application works out of the box with an initial interactive preview, and connects seamlessly to Supabase for persistent cloud storage, admin logins, and real-time chat.

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, name it (e.g. `freelancer-adnan`), select a region, and set a database password.

### Step 2: Run Database Schema
1. In your Supabase Dashboard, go to **SQL Editor** → **New Query**.
2. Open the file `supabase/schema.sql` from this repository (or click **Copy SQL** in the app's Supabase Setup Modal) and paste it into the editor.
3. Click **Run**. This automatically creates:
   - `site_settings`
   - `services`
   - `portfolio_items`
   - `cpa_offers`
   - `contact_messages`
   - `chat_conversations` & `chat_messages`
   - Row Level Security (RLS) policies for all tables
   - `portfolio-media` public storage bucket for image uploads

### Step 3: Create Your First Admin Account
1. In your Supabase Dashboard, click **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Enter your email (e.g., `adnan708620@gmail.com`) and choose a strong password.
4. Auto-confirm user email is recommended for instant login.

### Step 4: Add API Keys to Environment
In your `.env` (or in Netlify site settings):
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
APP_URL="https://your-site-name.netlify.app"
```

You can also click the **DB: Setup** button in the website's top navigation bar to test and save the credentials directly in the live UI.

---

## 🌐 Netlify Deployment Guide

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Netlify](https://www.netlify.com/) and click **Add new site** → **Import an existing project**.
3. Choose your repository. Netlify will auto-detect the configuration from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Before clicking Deploy, go to **Site configuration** → **Environment variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy Site**. Your website will be live in under a minute on a URL like `https://your-site-name.netlify.app`.

---

## 🔗 Connecting a Custom Domain (e.g. `freelanceradnan.com`)

1. Buy your domain on Namecheap, Cloudflare, or GoDaddy.
2. In your Netlify dashboard, navigate to **Domain management** → **Add custom domain**.
3. Enter your domain name (e.g. `freelanceradnan.com`).
4. Update your DNS settings at your domain registrar:
   - Point the `A` record for `@` to Netlify's load balancer IP: `75.2.60.5`
   - Point the `CNAME` record for `www` to your Netlify site URL (e.g. `your-site-name.netlify.app`).
5. Netlify will automatically provision a free Let's Encrypt SSL certificate within a few minutes.

---

## ✅ Quality & Feature Testing Checklist

- [x] **Hero Section:** Headline, subheadline, verified WhatsApp button, and framed photograph.
- [x] **About Me Section:** Adnan's bio, official email, WhatsApp contact, Bhaluka location, and core competencies.
- [x] **Services Section:** 8 specialized cards with dynamic CTA triggers that pre-fill the inquiry form.
- [x] **Portfolio Gallery:** Category tabs, responsive image cards, live external links, and full-resolution lightbox modal.
- [x] **CPA Offers Section:** Active offers, geo-targeting flags, `rel="sponsored"` compliant external links, and editable affiliate disclosure.
- [x] **Location Section:** Village: Paragaon, Panch Pai, Bhaluka, Mymensingh, Bangladesh with interactive radar map graphic and Google Maps locator.
- [x] **Contact Section:** Validated form, anti-spam honeypot, direct mailto/WhatsApp actions, and celebratory confetti animation.
- [x] **Floating Live Chat:** Sticky chat bubble, visitor introduction, message history, timestamp formatting, and 1-click WhatsApp fallback.
- [x] **Admin Dashboard (`/admin`):**
  - Supabase Auth integration with secure logout
  - Overview statistics (portfolio count, active offers, contact messages, live chats)
  - Hero and biography editor
  - Photo uploader to Supabase storage with preview
  - Portfolio CRUD with publish/hide toggles
  - CPA offer CRUD with geo-targeting and status toggles
  - Services manager
  - Contact inquiries inbox with 1-click email/WhatsApp replies
  - Live chat threads inbox with admin response capability
  - Site settings and SEO metadata editor
- [x] **Netlify SPA Routing:** Handled via `netlify.toml` and `public/_redirects` to prevent 404s on page refresh.
