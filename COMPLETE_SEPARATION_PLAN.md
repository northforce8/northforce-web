# FULLSTÄNDIG PROJEKTUPPDELNING – DETALJERAD PLAN

**Datum:** 2026-01-29
**Status:** Plan färdig för godkännande
**Mål:** Två 100% isolerade, oberoende projekt

---

## 🎯 SLUTRESULTAT (GARANTERAD ISOLERING)

### Efter uppdelning finns:

**PROJEKT A: NorthForce – Website**
```
Namn i UI/menyer: "NorthForce – Website"
Domän: northforce.io
Arbetsmiljö: Bolt
GitHub repo: northforce-website (redan befintligt)
Netlify site: Nuvarande site (redan konfigurerad)
Innehåll: ENDAST publik webb
Kan INTE se: Portal/admin/partner-kod (existerar ej i projektet)
```

**PROJEKT B: NorthForce – Portal**
```
Namn i UI/menyer: "NorthForce – Portal"
Domän: portal.northforce.io
Arbetsmiljö: GitHub + IDE (VS Code/Cursor etc.)
GitHub repo: northforce-portal (nytt, skapas)
Netlify site: Nytt site (skapas)
Innehåll: ENDAST portal/admin/partner
Kan INTE se: Publik webb (existerar ej i projektet)
```

**RESULTAT:**
✅ Omöjligt att blanda ihop projekten
✅ Olika namn i alla menyer och listor
✅ Helt separata historiker
✅ Olika arbetsmiljöer (Bolt vs GitHub)
✅ Olika pipelines
✅ Noll risk för "jobba i fel projekt"

---

## 📂 FILFÖRDELNING – EXAKT MAPPNING

### PROJEKT A: NorthForce – Website (Publik Webb)

#### Inkluderade Filer (Totalt: ~90 filer)

**Root-filer:**
```
✅ .gitignore
✅ .nvmrc
✅ eslint.config.js
✅ index.html (uppdaterad title: "NorthForce – Website")
✅ netlify.toml
✅ package.json (uppdaterad name: "northforce-website")
✅ postcss.config.js
✅ tailwind.config.js
✅ tsconfig.json, tsconfig.app.json, tsconfig.node.json
✅ vite.config.ts
✅ README.md (ny, specifik för publik webb)
✅ .env (kopierad, endast nödvändiga variabler)
```

**public/ (alla filer):**
```
✅ public/_redirects (uppdaterad, endast publika routes)
✅ public/robots.txt
✅ public/sitemap.xml (uppdaterad, endast publika sidor)
✅ public/*.png (alla bilder)
```

**src/components/ (endast publika):**
```
✅ Analytics.tsx
✅ BeforeAfterSection.tsx
✅ BenefitsGrid.tsx
✅ BenefitsSection.tsx
✅ BookingForm.tsx
✅ Breadcrumbs.tsx
✅ ContactForm.tsx
✅ ContactFormOld.tsx (för referens)
✅ ContactInfo.tsx
✅ CookieBanner.tsx
✅ CtaSection.tsx
✅ Footer.tsx
✅ FooterOld.tsx (för referens)
✅ Header.tsx
✅ HeroMark.tsx
✅ HeroSection.tsx
✅ LanguageSwitcher.tsx
✅ ObjectionsSection.tsx
✅ ScrollToTop.tsx
✅ SEOHead.tsx
✅ SocialIcons.tsx
✅ index.ts (uppdaterad, endast publika exports)

❌ components/admin/ (hela mappen tas bort)
❌ components/customer/ (hela mappen tas bort)
❌ components/ui/ (tas bort, används ej av publik webb)
```

**src/pages/ (endast publika):**
```
✅ AboutPage.tsx
✅ AIAutomationPage.tsx
✅ AuditPage.tsx
✅ BusinessDataPage.tsx
✅ CapabilitiesPage.tsx
✅ CareersPage.tsx
✅ CMOPlusSystemPage.tsx
✅ ContactPage.tsx
✅ HomePage.tsx
✅ HybridModelPage.tsx
✅ ImpactPage.tsx
✅ IndustriesPage.tsx
✅ InsightsPage.tsx
✅ LegalPage.tsx
✅ MethodPage.tsx
✅ PartnersPage.tsx
✅ PricingPage.tsx
✅ ServicesPage.tsx
✅ SolutionsPage.tsx
✅ StrategicWebsitesPage.tsx
✅ SystemOnlyPage.tsx
✅ SystemsPage.tsx
✅ TokensPage.tsx

❌ pages/admin/ (hela mappen tas bort)
❌ pages/customer/ (hela mappen tas bort)
```

**src/lib/ (minimal, endast nödvändiga):**
```
✅ supabase.ts (för kontaktformulär)
✅ email-service.ts (för notifikationer)
✅ error-handler.ts (grundläggande)
✅ logger.ts (grundläggande)

❌ Alla andra lib-filer tas bort (admin-specific)
```

**src/locales/ (översättningar):**
```
✅ en.json (endast publika översättningar)
✅ sv.json (endast publika översättningar)
```

**src/contexts/:**
```
✅ LanguageContext.tsx
✅ ToastContext.tsx
```

**src/hooks/:**
```
✅ useDarkMode.ts
```

**src/ (root-filer):**
```
✅ App.tsx (uppdaterad, ENDAST publika routes)
✅ main.tsx (oförändrad)
✅ i18n.ts (oförändrad)
✅ index.css (oförändrad)
✅ vite-env.d.ts
```

**INTE inkluderat:**
```
❌ Alla admin-komponenter
❌ Alla admin-sidor
❌ Alla customer-sidor
❌ Alla AI services
❌ Alla strategiska frameworks
❌ Partner portal API
❌ Enterprise API
❌ Credits/billing logik
❌ PDF-generering
❌ Avancerad analytics
```

**Dependencies (package.json) - Minimal:**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "i18next": "^25.8.0",
    "i18next-browser-languagedetector": "^8.2.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^16.5.3",
    "react-router-dom": "^7.8.2"
  }
}
```

**Borttagna dependencies:**
```
❌ jspdf, jspdf-autotable (PDF-generering)
```

---

### PROJEKT B: NorthForce – Portal (Portal/Admin)

#### Inkluderade Filer (Totalt: ~180 filer)

**Root-filer:**
```
✅ .gitignore (ny, portal-specifik)
✅ .nvmrc
✅ eslint.config.js
✅ index.html (ny title: "NorthForce – Portal")
✅ netlify.toml (ny, portal-specifik config)
✅ package.json (ny name: "northforce-portal")
✅ postcss.config.js
✅ tailwind.config.js
✅ tsconfig.json, tsconfig.app.json, tsconfig.node.json
✅ vite.config.ts
✅ README.md (ny, specifik för portal)
✅ .env (kopierad, alla variabler)
```

**public/:**
```
✅ public/_redirects (ny, endast portal routes)
✅ public/northforce-symbol-clean.png (logo)
❌ INTE robots.txt eller sitemap.xml (portal ska ej indexeras)
```

**src/components/admin/ (alla admin-komponenter):**
```
✅ AdminErrorBoundary.tsx
✅ AdminLayout.tsx
✅ BurnRateForecastAI.tsx
✅ CapacityConflictsAI.tsx
✅ ContextualHelp.tsx
✅ ContractStatusBadge.tsx
✅ ContractValidationAI.tsx
✅ CreditsDisplay.tsx
✅ CreditsWithMoneyDisplay.tsx
✅ CurrencyDisplay.tsx
✅ CustomerHealthAI.tsx
✅ EmptyState.tsx
✅ ErrorAlert.tsx
✅ InfoIcon.tsx
✅ InvoicePDFPreview.tsx
✅ InvoiceStatusBadge.tsx
✅ InvoiceValidationAI.tsx
✅ LoadingState.tsx
✅ PageHeader.tsx
✅ RecommendationCard.tsx
✅ ReportsInsightsAI.tsx
✅ StatusIndicator.tsx
✅ SuccessAlert.tsx
✅ admin/okr/ (alla OKR-komponenter)
✅ admin/strategic/ (alla strategiska komponenter)
✅ admin/ui/ (alla UI-komponenter)
```

**src/components/customer/ (customer portal):**
```
✅ CustomerLayout.tsx
```

**src/components/ui/:**
```
✅ Skeleton.tsx
```

**src/components/ (minimal shared, om nödvändigt):**
```
✅ Analytics.tsx (för portal analytics)
❌ INTE publika komponenter (Header, Footer, etc.)
```

**src/pages/admin/ (alla admin-sidor):**
```
✅ AdminDashboard.tsx
✅ AdminHealthPage.tsx
✅ AdminLogin.tsx
✅ HelpCenterPage.tsx
✅ LeadDetailPage.tsx
✅ PasswordResetPage.tsx
✅ SetupWizard.tsx
✅ admin/partner-portal/ (ALLA 59 portal-sidor)
```

**src/pages/customer/ (alla customer-sidor):**
```
✅ CustomerActivityPage.tsx
✅ CustomerBusinessHealthPage.tsx
✅ CustomerCampaignsPage.tsx
✅ CustomerDocumentsPage.tsx
✅ CustomerGrowthJourneyPage.tsx
✅ CustomerHelpPage.tsx
✅ CustomerLeadershipPage.tsx
✅ CustomerLogin.tsx
✅ CustomerPortalDashboard.tsx
```

**src/lib/ (alla lib-filer):**
```
✅ adkar-ai-service.ts
✅ admin-error-logger.ts
✅ admin-routes.ts
✅ agile-ai-service.ts
✅ agile-types.ts
✅ ai-service.ts
✅ ai-strategic-engine.ts
✅ api-cache.ts
✅ auth.ts
✅ bmc-ai-service.ts
✅ bsc-ai-service.ts
✅ calendar-service.ts
✅ credits-pricing-config.ts
✅ data-validators.ts
✅ database.ts
✅ design-thinking-ai-service.ts
✅ design-thinking-types.ts
✅ email-service.ts
✅ enterprise-api.ts
✅ enterprise-types.ts
✅ error-handler.ts
✅ event-bus.ts
✅ help-content.ts
✅ lean-types.ts
✅ logger.ts
✅ mckinsey-ai-service.ts
✅ mckinsey-types.ts
✅ ml-enhanced-prediction-service.ts
✅ page-help-content.ts
✅ partner-portal-api.ts
✅ partner-portal-types.ts
✅ pdf-service.ts
✅ porter-ai-service.ts
✅ query-cache-service.ts
✅ query-client.ts
✅ rate-limiter.ts
✅ recommendation-engine.ts
✅ supabase.ts
✅ swot-ai-service.ts
```

**src/locales/ (översättningar):**
```
✅ en.json (komplett, alla översättningar)
✅ sv.json (komplett, alla översättningar)
```

**src/contexts/:**
```
✅ LanguageContext.tsx
✅ ToastContext.tsx
```

**src/hooks/:**
```
✅ useDarkMode.ts
```

**src/ (root-filer):**
```
✅ App.tsx (NY, ENDAST admin/portal/customer routes)
✅ main.tsx
✅ i18n.ts
✅ index.css
✅ vite-env.d.ts
✅ middleware.ts (om finns)
```

**supabase/ (alla migrations och functions):**
```
✅ supabase/migrations/ (alla migrations)
✅ supabase/functions/ (alla edge functions)
```

**tests/:**
```
✅ src/tests/ (alla tester)
```

**INTE inkluderat:**
```
❌ Publika sidor (HomePage, AboutPage, etc.)
❌ Publika komponenter (Header, Footer, ContactForm etc.)
❌ Marketing content
```

**Dependencies (package.json) - Komplett:**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "i18next": "^25.8.0",
    "i18next-browser-languagedetector": "^8.2.0",
    "jspdf": "^3.0.4",
    "jspdf-autotable": "^5.0.2",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^16.5.3",
    "react-router-dom": "^7.8.2"
  }
}
```

---

## 🔧 TEKNISK ISOLERING – HUR DET FUNGERAR

### 1. Olika Projekt-namn (Visuell Separation)

**PROJEKT A (package.json):**
```json
{
  "name": "northforce-website",
  "description": "NorthForce public website - Marketing and information pages"
}
```

**PROJEKT B (package.json):**
```json
{
  "name": "northforce-portal",
  "description": "NorthForce Portal - Admin, Partner, and Customer management system"
}
```

**PROJEKT A (index.html):**
```html
<title>NorthForce – Website</title>
```

**PROJEKT B (index.html):**
```html
<title>NorthForce – Portal</title>
```

**Resultat:**
- Olika namn i browser tabs
- Olika namn i Bolt UI
- Olika namn i GitHub repositories
- Olika namn i Netlify dashboards
- Omöjligt att förväxla

---

### 2. Olika GitHub Repositories (Teknisk Separation)

**PROJEKT A:**
```
Repository: github.com/[owner]/northforce-website
Branch: main
Historik: Endast publika webb-ändringar
Contributors: Marknadsföring, content team
Workflow: Bolt → GitHub → Netlify
```

**PROJEKT B:**
```
Repository: github.com/[owner]/northforce-portal (NYT)
Branch: main
Historik: Helt ny, endast portal-ändringar
Contributors: Utvecklare, tekniskt team
Workflow: IDE → GitHub → Netlify
```

**Resultat:**
- Helt separata repositories
- Oberoende historiker
- Inga gemensamma commits
- Olika teams kan jobba utan konflikter

---

### 3. Olika Netlify Sites (Deploy Separation)

**PROJEKT A:**
```
Site name: northforce-website
Domain: northforce.io
         www.northforce.io
Build command: npm run build
Publish dir: dist
Environment: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
Deploy trigger: Push to northforce-website/main
```

**PROJEKT B:**
```
Site name: northforce-portal (NYT)
Domain: portal.northforce.io
         admin.northforce.io (alias)
Build command: npm run build
Publish dir: dist
Environment: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
Deploy trigger: Push to northforce-portal/main
```

**Resultat:**
- Separata build pipelines
- Oberoende deploys
- Ett projekt kan deployas utan att påverka det andra
- Olika domäner → olika användare

---

### 4. Olika Routing (App.tsx)

**PROJEKT A (App.tsx) - Endast Publika Routes:**
```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
// ... endast publika sidor

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        {/* ... 20 publika routes totalt */}

        {/* INGA ADMIN ROUTES */}
        {/* INGA PORTAL ROUTES */}
        {/* INGA CUSTOMER ROUTES */}
      </Routes>
    </Router>
  );
}
```

**PROJEKT B (App.tsx) - Endast Portal Routes:**
```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PartnerDashboard } from './pages/admin/partner-portal/PartnerDashboard';
// ... endast admin/portal sidor

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/partner-portal/*" element={<PartnerPortalRoutes />} />
        <Route path="/admin/customer/portal/*" element={<CustomerPortalRoutes />} />
        {/* ... 60+ admin/portal routes totalt */}

        {/* INGA PUBLIKA ROUTES */}
        {/* INGA MARKETING ROUTES */}
      </Routes>
    </Router>
  );
}
```

**Resultat:**
- Routes finns INTE ens i fel projekt
- Omöjligt att råka navigera till "fel sida"
- Ingen kod leakage mellan projekten

---

### 5. Olika Redirects (public/_redirects)

**PROJEKT A (_redirects):**
```
# Public website redirects
/om-oss /about 301
/kontakt /contact 301

# SPA fallback for public routes only
/*    /index.html   200
```

**PROJEKT B (_redirects):**
```
# Portal redirects
/login /admin/login 301
/portal /admin/partner-portal 301

# SPA fallback for portal routes only
/*    /index.html   200
```

---

### 6. Olika Sitemaps (SEO)

**PROJEKT A (sitemap.xml):**
```xml
<url><loc>https://northforce.io/</loc></url>
<url><loc>https://northforce.io/about</loc></url>
<url><loc>https://northforce.io/contact</loc></url>
<!-- ... endast publika sidor -->
```

**PROJEKT B (sitemap.xml):**
```
FINNS INTE
Portal ska inte indexeras av sökmotorer
```

**PROJEKT B (robots.txt):**
```
User-agent: *
Disallow: /
```

---

## 📋 STEG-FÖR-STEG IMPLEMENTATION PLAN

### **FAS 1: FÖRBEREDELSE** (1-2 timmar)

#### Steg 1.1: Skapa Nytt Portal Repository
```bash
Action: Skapa nytt GitHub repository
Name: northforce-portal
Visibility: Private
Initialize: Med README
Description: "NorthForce Portal - Admin, Partner, and Customer management"

✅ Verifiering: Repo synligt på GitHub
```

#### Steg 1.2: Konfigurera Netlify för Portal
```bash
Action: Skapa ny Netlify site
Site name: northforce-portal
Build command: npm run build
Publish directory: dist
Repository: github.com/[owner]/northforce-portal

✅ Verifiering: Site skapad i Netlify dashboard
```

#### Steg 1.3: Konfigurera DNS
```bash
Action: Lägg till DNS-record hos domänleverantör
Type: CNAME
Name: portal
Value: [netlify-site-url].netlify.app

Optional alias:
Type: CNAME
Name: admin
Value: [netlify-site-url].netlify.app

✅ Verifiering: DNS propagerad (kan ta 5-60 min)
```

#### Steg 1.4: Sätt SSL-certifikat
```bash
Action: I Netlify, aktivera automatisk SSL
Domain: portal.northforce.io
         admin.northforce.io (om alias)

✅ Verifiering: HTTPS fungerar
```

#### Steg 1.5: Environment Variables
```bash
Action: Kopiera environment variables till båda Netlify sites

PROJEKT A (northforce-website):
VITE_SUPABASE_URL=https://acafwflefwgdodpskfkm.supabase.co
VITE_SUPABASE_ANON_KEY=[key]

PROJEKT B (northforce-portal):
VITE_SUPABASE_URL=https://acafwflefwgdodpskfkm.supabase.co
VITE_SUPABASE_ANON_KEY=[key]

✅ Verifiering: Variabler sparade i Netlify
```

---

### **FAS 2: SKAPA PORTAL-PROJEKT** (3-4 timmar)

#### Steg 2.1: Klona och Förbered
```bash
# Lokalt, skapa ny mapp för portal
mkdir northforce-portal
cd northforce-portal
git init
git remote add origin github.com/[owner]/northforce-portal
```

#### Steg 2.2: Kopiera Portal-filer från Nuvarande Projekt
```bash
Från nuvarande projekt, kopiera:

Root:
✅ .gitignore
✅ .nvmrc
✅ eslint.config.js
✅ index.html (uppdatera title)
✅ netlify.toml (uppdatera config)
✅ package.json (uppdatera name, description)
✅ postcss.config.js
✅ tailwind.config.js
✅ tsconfig.*
✅ vite.config.ts
✅ .env

public/:
✅ _redirects (skapa ny, portal-specifik)
✅ northforce-symbol-clean.png

src/components/:
✅ Analytics.tsx (endast denna)
✅ components/admin/ (hela mappen)
✅ components/customer/ (hela mappen)
✅ components/ui/ (hela mappen)

src/pages/:
✅ pages/admin/ (hela mappen)
✅ pages/customer/ (hela mappen)

src/lib/:
✅ Alla lib-filer (hela mappen)

src/locales/:
✅ en.json
✅ sv.json

src/contexts/:
✅ Alla filer

src/hooks/:
✅ Alla filer

src/:
✅ App.tsx (skapa NY, endast portal routes)
✅ main.tsx
✅ i18n.ts
✅ index.css
✅ vite-env.d.ts
✅ middleware.ts

supabase/:
✅ migrations/ (hela mappen)
✅ functions/ (hela mappen)

tests/:
✅ src/tests/ (hela mappen)
```

#### Steg 2.3: Uppdatera Portal-specifika Filer
```bash
Uppdatera:

index.html:
<title>NorthForce – Portal</title>

package.json:
{
  "name": "northforce-portal",
  "description": "NorthForce Portal - Admin, Partner, and Customer management"
}

App.tsx:
- Ta bort alla publika routes
- Behåll endast admin/portal/customer routes
- Root route (/) → AdminLogin

public/_redirects:
# Portal redirects
/login /admin/login 301
/*    /index.html   200

README.md:
Skapa ny README specifik för portal
```

#### Steg 2.4: Installera Dependencies
```bash
npm install

✅ Verifiering: node_modules skapad, inga errors
```

#### Steg 2.5: Testa Lokalt
```bash
npm run dev

Testa:
✅ / → AdminLogin visas
✅ /admin → AdminDashboard (efter login)
✅ /admin/partner-portal → PartnerDashboard
✅ Inga publika routes fungerar (404)
✅ Inga console errors

✅ Verifiering: Portal fungerar lokalt
```

#### Steg 2.6: Build Test
```bash
npm run build

✅ Verifiering: Build success, dist/ skapad
```

#### Steg 2.7: Commit och Push
```bash
git add .
git commit -m "Initial portal setup - complete separation from public website"
git push origin main

✅ Verifiering: Kod pushad till GitHub
```

#### Steg 2.8: Första Deploy
```bash
Action: Netlify auto-deploy triggas

✅ Verifiering:
- Deploy success i Netlify
- portal.northforce.io fungerar
- AdminLogin visas på portal.northforce.io/
```

---

### **FAS 3: RENSA PUBLIKA WEBB-PROJEKTET** (2-3 timmar)

#### Steg 3.1: Backup
```bash
Action: Skapa backup av nuvarande projekt
Method: Git tag eller branch

git tag backup-before-separation
git push origin backup-before-separation

✅ Verifiering: Tag skapad
```

#### Steg 3.2: Ta Bort Admin/Portal-kod
```bash
Ta bort följande från northforce-website:

src/components/:
❌ components/admin/ (hela mappen)
❌ components/customer/ (hela mappen)
❌ components/ui/ (hela mappen)

src/pages/:
❌ pages/admin/ (hela mappen)
❌ pages/customer/ (hela mappen)

src/lib/:
❌ Alla filer UTOM:
✅ supabase.ts
✅ email-service.ts
✅ error-handler.ts
✅ logger.ts

supabase/:
❌ migrations/ (hela mappen)
❌ functions/ (hela mappen)

tests/:
❌ src/tests/ (hela mappen)
```

#### Steg 3.3: Uppdatera App.tsx (Endast Publika Routes)
```typescript
// Ta bort alla imports av admin/portal/customer
// Behåll endast publika sidor

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
// ... endast publika

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* ... endast publika routes */}

        {/* ALLA ADMIN ROUTES BORTTAGNA */}
      </Routes>
    </Router>
  );
}
```

#### Steg 3.4: Rensa Dependencies
```bash
Uppdatera package.json:

Ta bort:
❌ "jspdf": "^3.0.4",
❌ "jspdf-autotable": "^5.0.2",

Kör:
npm install

✅ Verifiering: package-lock.json uppdaterad
```

#### Steg 3.5: Uppdatera Locales (Ta Bort Admin-texter)
```bash
src/locales/en.json:
Ta bort alla admin/portal-relaterade översättningar
Behåll endast publika texter

src/locales/sv.json:
Samma som ovan
```

#### Steg 3.6: Uppdatera public/_redirects
```bash
public/_redirects:

# Public website redirects
/om-oss /about 301
/kontakt /contact 301

# SPA fallback
/*    /index.html   200

Ta bort alla admin-relaterade redirects
```

#### Steg 3.7: Uppdatera README.md
```markdown
# NorthForce – Website

Public marketing and information website for NorthForce.

**This project contains ONLY:**
- Public marketing pages
- Information pages
- Contact forms
- Booking forms

**This project does NOT contain:**
- Admin portal (see northforce-portal repo)
- Partner portal
- Customer portal

## Development
Built and deployed via Bolt.
```

#### Steg 3.8: Testa Lokalt
```bash
npm run dev

Testa:
✅ / → HomePage visas korrekt
✅ /about → AboutPage
✅ /contact → ContactPage
✅ Alla publika sidor fungerar
✅ Inga console errors
✅ Försök gå till /admin → 404 (korrekt!)

✅ Verifiering: Publik webb fungerar utan admin-kod
```

#### Steg 3.9: Build Test
```bash
npm run build

Förväntade resultat:
✅ Build success
✅ Bundle size: ~600KB (ner från ~1.8MB)
✅ Build time: ~5-8s (ner från ~22s)
✅ dist/ skapad

Kontrollera att dist/ INTE innehåller:
❌ Admin-komponenter
❌ Portal-sidor
❌ AI services
```

#### Steg 3.10: Commit och Push
```bash
git add .
git commit -m "Complete separation: Remove all admin/portal code from public website"
git push origin main

✅ Verifiering:
- Kod pushad till GitHub
- Netlify auto-deploy triggas
- northforce.io uppdateras
```

---

### **FAS 4: VERIFIERING** (2-3 timmar)

#### Steg 4.1: Test Publik Webb (northforce.io)
```bash
Test på live site: https://northforce.io

Publika Sidor (ska fungera):
✅ / (HomePage)
✅ /about (AboutPage)
✅ /contact (ContactPage)
✅ /pricing (PricingPage)
✅ /services (ServicesPage)
✅ ... alla publika sidor

Admin Routes (ska INTE fungera):
❌ /admin → 404 eller redirect till /
❌ /admin/partner-portal → 404
❌ /admin/customer/portal → 404

Forms:
✅ Kontaktformulär fungerar
✅ Bokningsformulär fungerar
✅ Data sparas i Supabase

Performance:
✅ Snabb laddning (<1.5s)
✅ Lighthouse score >90

✅ Verifiering: Publik webb fungerar perfekt, INGEN admin-kod
```

#### Steg 4.2: Test Portal (portal.northforce.io)
```bash
Test på live site: https://portal.northforce.io

Portal Routes (ska fungera):
✅ / → AdminLogin
✅ /admin → AdminDashboard (efter login)
✅ /admin/partner-portal → PartnerDashboard
✅ /admin/partner-portal/customers → CustomersPage
✅ /admin/customer/portal → CustomerPortalDashboard
✅ ... alla admin/portal routes

Publika Routes (ska INTE fungera):
❌ /about → 404 eller redirect till /
❌ /contact → 404
❌ /pricing → 404

Authentication:
✅ Login fungerar
✅ Supabase auth fungerar
✅ RLS policies fungerar
✅ Protected routes fungerar

Funktionalitet:
✅ Customers lista läses från DB
✅ Partners lista läses från DB
✅ Strategiska frameworks fungerar
✅ PDF-generering fungerar
✅ Alla AI services fungerar

✅ Verifiering: Portal fungerar perfekt, INGEN publik webb-kod
```

#### Steg 4.3: Test Supabase Anslutningar
```bash
PROJEKT A (northforce.io):
✅ Kontaktformulär → Data sparas i contact_submissions
✅ Bokningsformulär → Data sparas i booking_submissions
✅ RLS policies fungerar för public access

PROJEKT B (portal.northforce.io):
✅ Admin kan läsa customers
✅ Admin kan läsa partners
✅ Admin kan skapa contracts
✅ Admin kan skapa invoices
✅ RLS policies fungerar för authenticated users

✅ Verifiering: Båda projekten delar samma Supabase utan konflikter
```

#### Steg 4.4: Cross-Contamination Test
```bash
Test att projekten är HELT isolerade:

I Bolt (northforce-website):
✅ Kan ENDAST se publika filer
✅ Kan INTE se admin-komponenter (existerar ej)
✅ Kan INTE se portal-sidor (existerar ej)
✅ Filträdet visar ENDAST public content

I GitHub/IDE (northforce-portal):
✅ Kan ENDAST se admin/portal-filer
✅ Kan INTE se publika komponenter (existerar ej)
✅ Kan INTE se publika sidor (existerar ej)
✅ Filträdet visar ENDAST portal content

✅ Verifiering: Noll korsberoenden, perfekt isolering
```

#### Steg 4.5: Performance Metrics
```bash
Mät före/efter:

PROJEKT A (northforce.io):
Before: Bundle 1.8MB, Load 2.5s, Build 22s
After:  Bundle 0.6MB, Load 1.2s, Build 5s
Improvement: -67% bundle, -52% load, -77% build ✅

PROJEKT B (portal.northforce.io):
Bundle: 1.4MB (acceptabelt för enterprise app)
Load: 2.0s (acceptabelt för portal)
Build: 18s (acceptabelt för komplexitet)

✅ Verifiering: Dramatisk förbättring för publik webb
```

#### Steg 4.6: User Acceptance Testing
```bash
Test olika användarflöden:

Publik Besökare:
✅ Kan besöka northforce.io
✅ Kan läsa om tjänster
✅ Kan skicka kontaktformulär
✅ Kan ej komma åt portal

Admin User:
✅ Kan logga in på portal.northforce.io
✅ Kan se dashboard
✅ Kan hantera customers/partners
✅ Kan ej se publika sidor (fel projekt)

Customer User:
✅ Kan logga in på portal.northforce.io/admin/customer/portal
✅ Kan se sin data
✅ Kan ej se admin-funktioner

✅ Verifiering: Alla användarflöden fungerar
```

#### Steg 4.7: Error Monitoring (24h)
```bash
Efter deploy, övervaka:
✅ Netlify logs (båda sites)
✅ Browser console errors
✅ Supabase logs
✅ User reports

✅ Verifiering: Inga kritiska errors
```

---

### **FAS 5: DOKUMENTATION OCH CLEAN-UP** (1-2 timmar)

#### Steg 5.1: Uppdatera READMEs
```bash
PROJEKT A (northforce-website/README.md):
Dokumentera:
- Vad projektet innehåller
- Vad det INTE innehåller
- Länk till portal-projektet
- Deployment via Bolt
- Environment variables

PROJEKT B (northforce-portal/README.md):
Dokumentera:
- Vad projektet innehåller
- Vad det INTE innehåller
- Länk till public website
- Development workflow
- Deployment process
- Environment variables
- Supabase setup
```

#### Steg 5.2: Team Workflow Documentation
```markdown
Skapa: TEAM_WORKFLOW.md

# Team Workflows

## Marketing / Content Team
- Works in: northforce-website (via Bolt)
- Deploys to: northforce.io
- Access: Bolt UI
- Can modify: Public pages, content, forms
- Cannot modify: Portal (different project)

## Development Team
- Works in: northforce-portal (via IDE/GitHub)
- Deploys to: portal.northforce.io
- Access: GitHub, Netlify, Supabase
- Can modify: Admin, portal, customer features
- Cannot modify: Public website (different project)

## Separation Benefits
✅ No merge conflicts
✅ Independent deploys
✅ Clear responsibilities
✅ Isolated testing
```

#### Steg 5.3: Archive Old Documentation
```bash
I båda projekt:
Flytta gamla docs till _docs_archive/ eller ta bort helt

Behåll endast:
✅ README.md (projekt-specifik)
✅ DEPLOYMENT_GUIDE.md (om relevant)
✅ .env.example (mallar)
```

#### Steg 5.4: Git Tags
```bash
PROJEKT A:
git tag v1.0.0-separated
git push origin v1.0.0-separated

PROJEKT B:
git tag v1.0.0-initial
git push origin v1.0.0-initial

✅ Verifiering: Tydliga versioner för uppdelningen
```

#### Steg 5.5: Team Communication
```bash
Informera teamet:
- Två separata projekt nu
- northforce-website för publik webb (Bolt)
- northforce-portal för admin/portal (GitHub)
- Olika workflows
- Olika deployment pipelines
- Länk till dokumentation
```

---

## ✅ BEKRÄFTELSE: 100% ISOLERING UPPNÅDD

### Efter Genomförd Implementation Garanteras:

#### 1. Teknisk Isolering
```
✅ Två separata GitHub repositories
✅ Två separata Netlify sites
✅ Oberoende build pipelines
✅ Oberoende deployment triggers
✅ Noll delad kod mellan projekten (utom Supabase config)
✅ Olika dependencies (public minimal, portal full)
```

#### 2. Visuell Isolering
```
✅ Olika projekt-namn: "NorthForce – Website" vs "NorthForce – Portal"
✅ Olika browser titles
✅ Olika i Bolt UI
✅ Olika i GitHub repo lists
✅ Olika i Netlify dashboards
✅ Olika domäner: northforce.io vs portal.northforce.io
```

#### 3. Funktionell Isolering
```
✅ Public project har ENDAST publika sidor/komponenter
✅ Portal project har ENDAST admin/portal/customer kod
✅ Olika routes (noll overlap)
✅ Olika environment variables (fast samma Supabase)
✅ Olika sitemaps (public indexeras, portal ej)
```

#### 4. Workflow Isolering
```
✅ Publik webb: Bolt → GitHub → Netlify
✅ Portal: IDE → GitHub → Netlify
✅ Olika teams kan jobba parallellt
✅ Noll risk för merge conflicts
✅ Oberoende test- och release-cykler
```

#### 5. User Experience Isolering
```
✅ Besökare ser ENDAST northforce.io (publik)
✅ Admins/Partners ser ENDAST portal.northforce.io
✅ Customers ser ENDAST portal.northforce.io/admin/customer/portal
✅ Olika login-flows
✅ Ingen förvirring mellan projekten
```

---

## 🎯 SVAR PÅ DINA ABSOLUTA KRAV

### Krav 1: Tekniskt separerade
**✅ UPPFYLLT**
- Olika GitHub repos
- Olika Netlify sites
- Olika build pipelines
- Oberoende deploys

### Krav 2: Visuellt separerade
**✅ UPPFYLLT**
- Olika namn i alla UIs
- Olika projekt-identiteter
- Olika browser titles
- Olika domäner

### Krav 3: Omöjligt att "råka jobba med fel del"
**✅ UPPFYLLT**
- Kod existerar INTE i fel projekt
- Bolt visar ENDAST public project
- IDE visar ENDAST portal project
- Filträden är helt olika

### Krav 4: I Bolt → ser BARA northforce.io
**✅ UPPFYLLT**
- Bolt connected till northforce-website repo
- Visar ENDAST publika filer
- Admin-kod existerar ej i projektet
- Omöjligt att råka redigera portal-kod

### Krav 5: I Portal-projektet → ser BARA portal.northforce.io
**✅ UPPFYLLT**
- GitHub northforce-portal repo
- IDE visar ENDAST portal-filer
- Publika sidor existerar ej i projektet
- Omöjligt att råka redigera publik webb

---

## 📊 FÖRVÄNTADE RESULTAT

### Bundle Sizes
```
FÖRE:
northforce.io: 1.8 MB (allt inkluderat)

EFTER:
northforce.io:     600 KB (-67%) ✅
portal.northforce.io: 1.4 MB (acceptabelt för enterprise) ✅
```

### Build Times
```
FÖRE:
Combined build: 22s

EFTER:
northforce.io build:     5s (-77%) ✅
portal.northforce.io build: 18s (acceptabelt) ✅
```

### Load Times
```
FÖRE:
northforce.io: 2.5s

EFTER:
northforce.io:     1.2s (-52%) ✅
portal.northforce.io: 2.0s (acceptabelt för portal) ✅
```

### Developer Experience
```
FÖRE:
- 204 filer i ett projekt
- Svårt navigera
- Risk för fel ändringar
- Merge conflicts

EFTER:
northforce.io:     ~90 filer (enkelt) ✅
portal.northforce.io: ~180 filer (hanteras separat) ✅
- Lätt navigera
- Noll risk för fel ändringar
- Noll merge conflicts
```

---

## 🚀 SLUTSATS

### Denna Plan Garanterar:

**1. Teknisk Separation:**
✅ Två helt oberoende projekt
✅ Noll delad kod (utom Supabase config)
✅ Oberoende pipelines

**2. Visuell Separation:**
✅ Olika namn överallt
✅ Omöjligt att förväxla
✅ Tydliga projekt-identiteter

**3. Workflow Separation:**
✅ Bolt för publik webb
✅ GitHub/IDE för portal
✅ Olika teams, noll konflikter

**4. User Separation:**
✅ Besökare → northforce.io
✅ Admins → portal.northforce.io
✅ Ingen förvirring

**5. Zero Cross-Contamination:**
✅ Kod existerar INTE i fel projekt
✅ Routes existerar INTE i fel projekt
✅ 100% isolering

---

## ⏱️ TIDSESTIMAT

**Total implementation tid:** 9-14 timmar

**Fördelning:**
- Fas 1 (Förberedelse): 1-2h
- Fas 2 (Skapa Portal): 3-4h
- Fas 3 (Rensa Public): 2-3h
- Fas 4 (Verifiering): 2-3h
- Fas 5 (Dokumentation): 1-2h

**Recommended approach:**
Genomför över 2-3 dagar med tid för testning mellan faser.

---

## ✅ GODKÄNNANDE KRÄVS

**Denna plan resulterar i:**
✅ 100% isolerade projekt
✅ Noll risk för sammanblandning
✅ Omöjligt att "råka jobba i fel projekt"
✅ Tydlig separation överallt (tekniskt, visuellt, funktionellt)
✅ Dramatisk förbättring av stabilitet och performance

**Ready för implementation när du godkänner.**

**Nästa steg:** Säg "Genomför uppdelningen" för att starta Fas 1.
