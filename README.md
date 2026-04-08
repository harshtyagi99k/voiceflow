# 🎙️ VoiceFlow — India's #1 Affordable Text-to-Speech SaaS

> **₹0 se banaya, ₹0 mein host karo. Pura free stack.**

---

## 🚀 Tech Stack (Sab FREE)

| Service | Use | Free Tier |
|---------|-----|-----------|
| **Next.js** | Frontend + Backend | Unlimited |
| **Vercel** | Hosting | Free forever |
| **Supabase** | Database + Auth + Storage | 500MB DB, 1GB storage FREE |
| **Microsoft Edge TTS** | Voice generation | 100% FREE, no API key needed |
| **Google OAuth** | Social login | Free |
| **GPay/UPI** | Payments | Free (manual verification) |

---

## 📁 Project Structure

```
voiceflow/
├── app/
│   ├── page.tsx              # Home/Landing page
│   ├── login/page.tsx        # Login
│   ├── signup/page.tsx       # Signup
│   ├── dashboard/page.tsx    # User dashboard
│   ├── generate/page.tsx     # TTS generator tool
│   ├── pricing/page.tsx      # Pricing + GPay payment
│   ├── admin/page.tsx        # Admin panel
│   ├── contact/page.tsx      # Contact page
│   └── api/
│       ├── tts/route.ts      # TTS generation API
│       ├── payment/route.ts  # Payment submission
│       ├── admin/route.ts    # Admin approve/reject
│       └── credits/route.ts  # User profile API
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts           # Client-side Supabase
│   ├── supabase-server.ts    # Server-side Supabase
│   ├── tts.ts                # TTS engine (Microsoft Edge)
│   └── utils.ts              # Helpers
└── supabase_schema.sql       # Complete DB schema
```

---

## ⚡ Setup Guide (30 minutes mein live!)

### STEP 1: Code setup

```bash
# VS Code mein terminal open karo
cd voiceflow
npm install
```

### STEP 2: Supabase setup (FREE)

1. **supabase.com** pe jaao → "Start your project" → Free plan
2. New project banao (koi bhi name, India region choose karo)
3. **SQL Editor** mein jaao → `supabase_schema.sql` ka poora content paste karo → Run karo
4. **Settings → API** mein jaao:
   - `Project URL` copy karo
   - `anon public` key copy karo
   - `service_role` key copy karo (⚠️ secret rakho)

5. **Authentication → Providers** mein:
   - Email: Enable karo
   - Google: Enable karo (optional — Google Cloud Console mein OAuth credentials banana padega)

### STEP 3: Environment variables

`.env.local` file banao (same folder mein):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Tera GPay UPI ID
NEXT_PUBLIC_GPAY_UPI_ID=yourname@ybl
NEXT_PUBLIC_GPAY_NAME=VoiceFlow

# Admin panel ke liye ek secret string banao
ADMIN_SECRET=koi_bhi_random_string_123_abc_xyz
```

### STEP 4: Local test

```bash
npm run dev
# http://localhost:3000 pe open karo
```

### STEP 5: Deploy to Vercel (FREE)

1. **github.com** pe new repository banao
2. VS Code terminal mein:
   ```bash
   git init
   git add .
   git commit -m "Initial VoiceFlow"
   git remote add origin https://github.com/TERA_USERNAME/voiceflow.git
   git push -u origin main
   ```
3. **vercel.com** pe jaao → "Import Project" → GitHub repo select karo
4. Environment Variables mein saari `.env.local` values add karo
5. Deploy! 🎉

---

## 💰 Payment Flow (GPay Manual)

1. **User** pricing page pe plan click karta hai
2. **Modal** open hota hai with your GPay QR code
3. User apne UPI app se pay karta hai
4. User UTR number ya screenshot submit karta hai
5. **You** `/admin` page pe jaate ho → Payment verify karo → "Approve" click karo
6. **Credits automatically** user ke account mein add ho jaate hain!

### Admin Panel Access:
```
yoursite.com/admin
```
Password: `ADMIN_SECRET` jo tune `.env.local` mein set kiya

---

## 🎙️ Voice Engine

Microsoft Edge TTS use karta hai — **completely free**, no API key needed!

- 100+ voices
- 20+ Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi...)
- Neural AI quality (same as Alexa/Cortana)
- MP3 output

---

## 📈 Revenue Projection

| Users | Plan Mix | Monthly Revenue |
|-------|----------|----------------|
| 100 | 30% Starter | ~₹3,000 |
| 500 | 30% Starter, 10% Pro | ~₹18,000 |
| 2000 | 25% Starter, 15% Pro, 5% Unlimited | ~₹85,000 |
| 5000 | Mixed | ~₹2,50,000+ |

---

## 🔧 Customization

### Change pricing:
- `app/pricing/page.tsx` mein `PLANS` array edit karo
- `supabase_schema.sql` mein `plans` table update karo
- `lib/supabase.ts` mein `PLANS` object update karo

### Change GPay QR:
- `.env.local` mein `NEXT_PUBLIC_GPAY_UPI_ID` update karo
- Pricing page mein aur chatdashboard mein auto-reflect ho jayega

### Add more voices:
- `lib/tts.ts` mein `VOICES` array mein add karo

---

## 🌐 Pages List

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page |
| Login | `/login` | Sign in |
| Signup | `/signup` | Create account (500 free credits) |
| Generate | `/generate` | TTS tool |
| Dashboard | `/dashboard` | User account |
| Pricing | `/pricing` | Plans + GPay payment |
| Admin | `/admin` | Approve/reject payments |
| Contact | `/contact` | Support |

---

## ⚠️ Important Notes

1. **Google OAuth setup**: Agar Google login chahiye toh Google Cloud Console mein OAuth app banana padega (free hai)
2. **Custom domain**: Vercel pe free custom domain milta hai (`.vercel.app`) ya apna domain connect karo
3. **ADMIN_SECRET**: Ek strong secret string use karo, kisi ko share mat karo
4. **Supabase Storage**: Payment screenshots aur audio files ke liye already configured hai schema mein

---

## 🆘 Help?

Koi bhi issue aaye toh yeh check karo:
1. `.env.local` mein saari variables sahi hain?
2. Supabase SQL schema run hua?
3. `npm install` kiya?
4. Browser console mein koi error hai?
