# PROJEKTUPPDELNING - VISUELL ÖVERSIKT

## FÖRE UPPDELNING

```
┌─────────────────────────────────────────────────────────┐
│  GitHub: northforce8/northforce-web                     │
│  Branch: main                                           │
│                                                         │
│  ├── src/                                               │
│  │   ├── pages/                                         │
│  │   │   ├── HomePage.tsx           [PUBLIK]           │
│  │   │   ├── AboutPage.tsx          [PUBLIK]           │
│  │   │   ├── ContactPage.tsx        [PUBLIK]           │
│  │   │   ├── admin/                 [PORTAL]           │
│  │   │   │   ├── AdminDashboard.tsx                    │
│  │   │   │   ├── AdminLogin.tsx                        │
│  │   │   │   └── partner-portal/ (59 sidor)            │
│  │   │   └── customer/              [PORTAL]           │
│  │   │       └── CustomerPortal.tsx                    │
│  │   ├── components/                                    │
│  │   │   ├── Header.tsx             [PUBLIK]           │
│  │   │   ├── Footer.tsx             [PUBLIK]           │
│  │   │   ├── admin/                 [PORTAL]           │
│  │   │   │   └── (40+ komponenter)                     │
│  │   │   └── customer/              [PORTAL]           │
│  │   └── lib/                                           │
│  │       ├── supabase.ts            [DELAD]            │
│  │       ├── ai-service.ts          [PORTAL]           │
│  │       ├── partner-portal-api.ts  [PORTAL]           │
│  │       └── (20+ filer)                                │
│  └── ...                                                │
│                                                         │
│  PROBLEM:                                               │
│  • Allt i samma projekt (204 filer)                    │
│  • Svårt att navigera                                   │
│  • Risk att redigera fel saker                         │
│  • Långsam build (22s)                                 │
│  • Stor bundle (1.8MB för publik webb!)                │
└─────────────────────────────────────────────────────────┘
```

## EFTER UPPDELNING

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│  PROJEKT 1: Publik Webb             │  │  PROJEKT 2: Portal                  │
│                                     │  │                                     │
│  GitHub: northforce8/northforce-web │  │  GitHub: northforce8/northforce-portal │
│  Branch: main                       │  │  Branch: main                       │
│  Domän: northforce.io               │  │  Domän: portal.northforce.io        │
│  Netlify: northforce-website        │  │  Netlify: northforce-portal         │
│                                     │  │                                     │
│  ├── src/                           │  │  ├── src/                           │
│  │   ├── pages/                     │  │  │   ├── pages/                     │
│  │   │   ├── HomePage.tsx           │  │  │   │   ├── admin/                │
│  │   │   ├── AboutPage.tsx          │  │  │   │   │   ├── AdminDashboard    │
│  │   │   ├── ContactPage.tsx        │  │  │   │   │   ├── AdminLogin        │
│  │   │   ├── PricingPage.tsx        │  │  │   │   │   └── partner-portal/   │
│  │   │   ├── ServicesPage.tsx       │  │  │   │   │       └── (59 sidor)    │
│  │   │   └── ...  (20 sidor)        │  │  │   │   └── customer/             │
│  │   ├── components/                │  │  │   │       └── CustomerPortal    │
│  │   │   ├── Header.tsx             │  │  │   ├── components/               │
│  │   │   ├── Footer.tsx             │  │  │   │   ├── admin/                │
│  │   │   ├── ContactForm.tsx        │  │  │   │   │   └── (40+ komponenter)│
│  │   │   └── ...  (18 komponenter)  │  │  │   │   └── customer/             │
│  │   └── lib/                       │  │  │   └── lib/                      │
│  │       ├── supabase.ts            │  │  │       ├── supabase.ts           │
│  │       ├── email-service.ts       │  │  │       ├── ai-service.ts         │
│  │       └── (4 filer)              │  │  │       ├── partner-portal-api.ts │
│  │                                  │  │  │       └── (25+ filer)            │
│  │  Bundle: 600KB ⚡                 │  │  │                                  │
│  │  Build: 5s ⚡                     │  │  │  Bundle: 1.4MB ✓                │
│  │  Load: 1.2s ⚡                    │  │  │  Build: 18s ✓                   │
│  │                                  │  │  │  Load: 2.0s ✓                   │
│  │  INNEHÅLLER:                     │  │  │                                  │
│  │  ✓ Marketing sidor               │  │  │  INNEHÅLLER:                     │
│  │  ✓ Information                   │  │  │  ✓ Admin dashboard              │
│  │  ✓ Kontaktformulär               │  │  │  ✓ Partner portal               │
│  │  ✓ Booking                       │  │  │  ✓ Customer portal              │
│  │                                  │  │  │  ✓ AI services                  │
│  │  INNEHÅLLER INTE:                │  │  │  ✓ Strategiska frameworks       │
│  │  ✗ Admin                         │  │  │  ✓ PDF-generering               │
│  │  ✗ Portal                        │  │  │  ✓ Credits & Billing            │
│  │  ✗ Customer portal               │  │  │                                  │
│  │  ✗ AI services                   │  │  │  INNEHÅLLER INTE:                │
│  │                                  │  │  │  ✗ Publika sidor                │
│  │                                  │  │  │  ✗ Marketing                    │
│  │                                  │  │  │  ✗ Kontaktsidor                 │
└─────────────────────────────────────┘  └─────────────────────────────────────┘

         ↓                                          ↓

  ┌──────────────────┐                    ┌──────────────────┐
  │  BOLT            │                    │  IDE (VS Code)   │
  │  (Edit publik)   │                    │  (Edit portal)   │
  └──────────────────┘                    └──────────────────┘
         ↓                                          ↓
  ┌──────────────────┐                    ┌──────────────────┐
  │  GitHub          │                    │  GitHub          │
  │  (Auto push)     │                    │  (Manual push)   │
  └──────────────────┘                    └──────────────────┘
         ↓                                          ↓
  ┌──────────────────┐                    ┌──────────────────┐
  │  Netlify         │                    │  Netlify         │
  │  (Auto deploy)   │                    │  (Auto deploy)   │
  └──────────────────┘                    └──────────────────┘
         ↓                                          ↓
  ┌──────────────────┐                    ┌──────────────────┐
  │  northforce.io   │                    │  portal.north... │
  │  (Public site)   │                    │  (Portal site)   │
  └──────────────────┘                    └──────────────────┘
```

## ANVÄNDARE OCH ÅTKOMST

```
┌─────────────────────────────────────────────────────────────┐
│  BESÖKARE (allmänheten)                                     │
│  ↓                                                           │
│  https://northforce.io                                      │
│  ├── Kan se: Alla publika sidor                            │
│  ├── Kan göra: Läsa info, skicka kontakt, boka möte        │
│  └── Kan INTE: Komma åt /admin (ger 404)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ADMIN (NorthForce team)                                    │
│  ↓                                                           │
│  https://portal.northforce.io/admin/login                   │
│  ├── Kan se: Dashboard, alla kunder, partners              │
│  ├── Kan göra: Hantera kunder, partners, contracts, etc.   │
│  └── Kan INTE: Se publika sidor (finns ej i projektet)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PARTNER (företag som jobbar med NorthForce)                │
│  ↓                                                           │
│  https://portal.northforce.io/admin/partner-portal          │
│  ├── Kan se: Sina kunder, sina projekt, sina deliveries    │
│  ├── Kan göra: Hantera sina projekt, uppdatera status      │
│  └── Kan INTE: Se andra partners data (RLS)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CUSTOMER (slutkund som köpt tjänster)                      │
│  ↓                                                           │
│  https://portal.northforce.io/admin/customer/portal         │
│  ├── Kan se: Sin data, sina rapporter, sitt dashboard      │
│  ├── Kan göra: Se framsteg, ladda ner rapporter            │
│  └── Kan INTE: Se andra kunders data (RLS)                 │
└─────────────────────────────────────────────────────────────┘
```

## UTVECKLINGS-WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│  MARKETING TEAM                                             │
│                                                             │
│  1. Öppna Bolt                                              │
│  2. Se ENDAST publika filer                                │
│  3. Redigera content, sidor, komponenter                    │
│  4. Bolt pushar automatiskt till GitHub                    │
│  5. Netlify deployas automatiskt                           │
│  6. northforce.io uppdateras                               │
│                                                             │
│  ✓ Ingen åtkomst till portal-kod                           │
│  ✓ Ingen risk att råka ändra admin-funktioner             │
│  ✓ Snabba ändringar utan teknisk kunskap                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DEVELOPMENT TEAM                                           │
│                                                             │
│  1. Öppna IDE (VS Code, Cursor, etc.)                       │
│  2. Klona northforce-portal repository                     │
│  3. Se ENDAST portal-filer                                 │
│  4. Utveckla nya features (AI, frameworks, etc.)           │
│  5. Test lokalt                                             │
│  6. Commit och push till GitHub                             │
│  7. Netlify deployas automatiskt                           │
│  8. portal.northforce.io uppdateras                        │
│                                                             │
│  ✓ Full kontroll över portal-utveckling                    │
│  ✓ Ingen risk att råka påverka publika sidan              │
│  ✓ Kan deploy utan att vänta på marketing team            │
└─────────────────────────────────────────────────────────────┘
```

## SUPABASE INTEGRATION

```
┌──────────────────────┐        ┌──────────────────────┐
│  northforce.io       │        │  portal.northforce.io│
│  (Publik Webb)       │        │  (Portal)            │
└──────────────────────┘        └──────────────────────┘
         │                               │
         │  Supabase Client              │  Supabase Client
         │  (Anon Key)                   │  (Anon Key)
         │                               │
         └───────────────┬───────────────┘
                         ↓
              ┌─────────────────────┐
              │  SUPABASE           │
              │  (Delad Databas)    │
              │                     │
              │  ├── Tables         │
              │  │   ├── contact_   │
              │  │   │   submissions│
              │  │   ├── customers  │
              │  │   ├── partners   │
              │  │   └── ...        │
              │  └── RLS Policies   │
              │      ├── Public     │
              │      │   (contacts) │
              │      └── Auth       │
              │          (portal)   │
              └─────────────────────┘

SÄKERHET:
✓ Publika webb: Kan endast skriva till contact_submissions
✓ Portal: Kräver autentisering för all data
✓ RLS: Användare ser endast sin egen data
✓ Samma Supabase = en databas att hantera
```

## FÖRDELAR MED UPPDELNINGEN

```
┌────────────────────────────────────────────────────────┐
│  PRESTANDA                                             │
│  • Publik webb: -67% bundle size (600KB vs 1.8MB)     │
│  • Publik webb: -52% load time (1.2s vs 2.5s)         │
│  • Publik webb: -77% build time (5s vs 22s)           │
│  • Portal: Acceptabel storlek för enterprise app       │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  SÄKERHET                                              │
│  • Admin-kod exponeras INTE i publik bundle            │
│  • Separata authentication flows                       │
│  • Portal indexeras INTE av sökmotorer                 │
│  • Tydlig separation of concerns                       │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  UTVECKLING                                            │
│  • Mindre projekt = lättare navigera                   │
│  • Noll merge conflicts mellan teams                   │
│  • Oberoende deploy-cykler                             │
│  • Tydliga ansvarsområden                              │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  ANVÄNDBARHET                                          │
│  • Omöjligt att "råka jobba i fel projekt"            │
│  • Olika namn överallt (visuell tydlighet)            │
│  • Marketing team kan jobba utan teknisk kunskap       │
│  • Development team har full kontroll                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  UNDERHÅLL                                             │
│  • Lättare att hitta buggar (mindre kodbas)           │
│  • Enklare att debugga (färre dependencies)           │
│  • Snabbare CI/CD pipelines                            │
│  • Bättre Lighthouse scores på publik webb            │
└────────────────────────────────────────────────────────┘
```

## TEKNISK STACK COMPARISON

```
┌─────────────────────────────────┬─────────────────────────────────┐
│  PUBLIK WEBB                    │  PORTAL                         │
├─────────────────────────────────┼─────────────────────────────────┤
│  React 18                       │  React 18                       │
│  TypeScript                     │  TypeScript                     │
│  Tailwind CSS                   │  Tailwind CSS                   │
│  React Router v7                │  React Router v7                │
│  Vite                           │  Vite                           │
│  i18next                        │  i18next                        │
│  Supabase (minimal)             │  Supabase (full)                │
│  ❌ INTE jsPDF                  │  ✓ jsPDF                        │
│  ❌ INTE AI services             │  ✓ AI services (10+ filer)      │
│  ❌ INTE strategiska frameworks  │  ✓ Strategiska frameworks       │
│  ❌ INTE enterprise API          │  ✓ Enterprise API               │
│                                 │                                 │
│  Dependencies: 8                │  Dependencies: 10               │
│  Files: ~90                     │  Files: ~180                    │
│  Bundle: 600KB                  │  Bundle: 1.4MB                  │
└─────────────────────────────────┴─────────────────────────────────┘
```

## DEPLOYMENT PIPELINE

```
PUBLIK WEBB:
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  BOLT   │ --> │ GitHub  │ --> │ Netlify │ --> │ LIVE    │
│  Edit   │     │ Auto    │     │ Auto    │     │ Deploy  │
│         │     │ Push    │     │ Build   │     │ 5s      │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                                                       ↓
                                              northforce.io

PORTAL:
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  IDE    │ --> │ GitHub  │ --> │ Netlify │ --> │ LIVE    │
│  Code   │     │ Manual  │     │ Auto    │     │ Deploy  │
│  Test   │     │ Push    │     │ Build   │     │ 18s     │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                                                       ↓
                                        portal.northforce.io

OBEROENDE = Ett projekt kan deployas utan att påverka det andra!
```

---

**SAMMANFATTNING:**
Efter uppdelningen har du två fullständigt isolerade projekt som kan utvecklas, deployas och underhållas oberoende av varandra, med tydlig separation av ansvar och noll risk för sammanblandning.
