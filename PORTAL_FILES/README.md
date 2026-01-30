# NorthForce – Portal

Enterprise portal system for NorthForce - Admin, Partner, and Customer management.

## 🎯 Detta Projekt Innehåller

**ENDAST portal och admin-funktionalitet:**
- Admin Dashboard
- Partner Portal (59 sidor)
- Customer Portal
- Strategiska Frameworks (SWOT, BSC, OKR, Porter, etc.)
- AI-driven Analytics
- PDF-generering
- Credits & Billing System
- Contract & Invoice Management

**Detta projekt innehåller INTE:**
- Publika marknadsföringssidor (finns i `northforce-website` repository)
- Kontaktsidor
- Pricingsidor
- Om oss / Services sidor

## 🚀 Domäner

- **Production:** https://portal.northforce.io
- **Admin Login:** https://portal.northforce.io/
- **Partner Portal:** https://portal.northforce.io/admin/partner-portal
- **Customer Portal:** https://portal.northforce.io/admin/customer/portal

**Publika webbsidan:** https://northforce.io (separat projekt)

## 🛠️ Teknisk Stack

- **Frontend:** React 18 + TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **Build:** Vite
- **Hosting:** Netlify
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **PDF:** jsPDF + jsPDF-AutoTable
- **i18n:** i18next + react-i18next

## 📦 Installation

```bash
# Installera dependencies
npm install

# Kopiera environment variables
cp .env.example .env
# Fyll i VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY

# Starta development server
npm run dev

# Bygg för production
npm run build

# Preview production build
npm run preview
```

## 🔐 Environment Variables

Krävs i `.env`:

```env
VITE_SUPABASE_URL=https://acafwflefwgdodpskfkm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Samma variabler krävs i Netlify Dashboard → Site settings → Environment variables

## 🏗️ Projektstruktur

```
src/
├── components/
│   ├── admin/          # Admin-specifika komponenter
│   │   ├── ui/         # UI-komponenter för admin
│   │   ├── okr/        # OKR-komponenter
│   │   └── strategic/  # Strategiska framework-komponenter
│   ├── customer/       # Customer portal komponenter
│   └── Analytics.tsx   # Delad analytics
├── pages/
│   ├── admin/          # Admin-sidor (60+ sidor)
│   │   ├── partner-portal/   # Partner portal sidor
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   └── ...
│   └── customer/       # Customer portal sidor
│       ├── CustomerPortalDashboard.tsx
│       ├── CustomerLogin.tsx
│       └── ...
├── lib/                # Services och utilities
│   ├── supabase.ts
│   ├── auth.ts
│   ├── partner-portal-api.ts
│   ├── enterprise-api.ts
│   ├── ai-service.ts
│   ├── pdf-service.ts
│   └── ...
├── contexts/           # React contexts
├── hooks/              # Custom hooks
└── locales/            # i18n translations
    ├── en.json
    └── sv.json
```

## 🔒 Säkerhet

- **RLS (Row Level Security):** Aktiverat på alla Supabase-tabeller
- **Authentication:** Supabase Auth med JWT
- **Protected Routes:** Alla admin/portal routes kräver autentisering
- **Environment Variables:** Känslig data endast via environment variables
- **HTTPS:** Enforced via Netlify

## 🚢 Deployment

**Automatisk deployment via Netlify:**
1. Push till `main` branch
2. Netlify triggar automatisk build
3. Deploy till production

**Manuell deployment:**
```bash
npm run build
# Ladda upp dist/ till Netlify
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

## 📚 Relaterade Projekt

- **Publika Webbsidan:** `northforce-website` repository
  - Domän: https://northforce.io
  - Innehåller: Marketing, information, kontaktsidor

## 👥 Team Workflow

**Development Team arbetar med:**
- Detta repository (northforce-portal)
- IDE: VS Code, Cursor, eller liknande
- Git workflow: Feature branches → Pull requests → Main
- Deploy: Automatisk via Netlify när main uppdateras

**Marketing Team arbetar med:**
- northforce-website repository
- Via: Bolt (no-code/low-code platform)
- Ingen åtkomst till portal-kod

## 📖 Dokumentation

För mer detaljerad dokumentation, se:
- `SEPARATION_EXECUTION_GUIDE.md` - Uppdelningsprocess
- `COMPLETE_SEPARATION_PLAN.md` - Fullständig separationsplan

## 🐛 Felsökning

**Build fails:**
- Kontrollera att alla dependencies är installerade: `npm install`
- Verifiera Node version: `node --version` (ska vara >=20.0.0)
- Rensa cache: `rm -rf node_modules package-lock.json && npm install`

**Supabase connection errors:**
- Verifiera environment variables i `.env`
- Kontrollera att Supabase project är running
- Verifiera RLS policies i Supabase Dashboard

**Authentication issues:**
- Kontrollera Supabase Auth settings
- Verifiera redirect URLs i Supabase Dashboard
- Kontrollera browser console för errors

## 📞 Support

För teknisk support eller frågor, kontakta development team.

## 📄 Licens

Proprietary - All rights reserved by NorthForce
