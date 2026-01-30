# STEG-FÖR-STEG: Separera Projekten Säkert

**Datum:** 2026-01-30
**Nuvarande situation:**
- Repository: `northforce8/northforce-web`
- Branch `main`: Innehåller ALLT (publik webb + portal)
- Branch `NorthForce-Portal`: Innehåller endast publik webb (redan rensat)
- Detta Bolt-projekt: Kopplat till `NorthForce-Portal` branchen

**Mål:**
1. Skapa `northforce8/northforce-portal` repository med all portal-kod
2. `northforce8/northforce-web` main branch ska innehålla endast publik webb
3. Båda projekten ska fungera oberoende

**VIKTIGT:** Ingen kod raderas förrän portal-repositoryt är verifierat fungerande!

---

## STEG 1: SKAPA BACKUP (SÄKERHET FÖRST!)

### 1.1 Via GitHub Web Interface

1. Gå till https://github.com/northforce8/northforce-web
2. Klicka på "Releases" (höger sida)
3. Klicka "Create a new release"
4. Fyll i:
   - Tag: `backup-before-separation-2026-01-30`
   - Target: `main`
   - Release title: `Backup Before Project Separation`
   - Description: `Complete backup of unified codebase before splitting into website and portal projects`
5. Klicka "Publish release"

✅ **Verifiering:** Du kan nu alltid återgå till denna kod om något går fel

---

## STEG 2: SKAPA PORTAL REPOSITORY

### 2.1 Via GitHub Web Interface

1. Gå till https://github.com/new
2. Fyll i:
   - Owner: `northforce8`
   - Repository name: `northforce-portal`
   - Description: `NorthForce Portal - Admin, Partner, and Customer management system`
   - Visibility: **Private** ✓
   - ❌ **INTE** "Add a README file" (vi lägger till egen kod)
   - ❌ **INTE** .gitignore eller license (vi kopierar från main)
3. Klicka "Create repository"

✅ **Verifiering:** Nytt tomt repository på `https://github.com/northforce8/northforce-portal`

---

## STEG 3: KOPIERA PORTAL-KOD FRÅN MAIN TILL PORTAL REPOSITORY

### 3.1 Klona main branchen lokalt

**Öppna terminal och kör:**

```bash
# Skapa ny mapp för portalen
mkdir ~/northforce-portal-temp
cd ~/northforce-portal-temp

# Klona main branchen från northforce-web
git clone -b main https://github.com/northforce8/northforce-web.git .

# Verifiera att du har all kod
ls -la
# Du ska se: src/, public/, package.json, etc.
```

✅ **Verifiering:** Du har en lokal kopia av main branchen med all kod

### 3.2 Förbered portal-koden

**I samma terminal:**

```bash
# Ta bort gamla git-referenser
rm -rf .git

# Initiera nytt git repository
git init
git branch -M main
```

### 3.3 Uppdatera portal-specifika filer

**Uppdatera följande filer manuellt (via text editor):**

**`index.html`** - Ändra title:
```html
<title>NorthForce – Portal</title>
<meta name="robots" content="noindex, nofollow" />
<meta name="description" content="NorthForce Portal - Admin, Partner, and Customer management system" />
```

**`package.json`** - Ändra name och description:
```json
{
  "name": "northforce-portal",
  "description": "NorthForce Portal - Admin, Partner, and Customer management system",
  ...
}
```

**`public/_redirects`** - Ersätt hela innehållet:
```
# Portal redirects
/login    /admin/login    301
/portal   /admin/partner-portal    301

# SPA fallback
/*    /index.html   200
```

**`netlify.toml`** - Uppdatera redirects:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/login"
  to = "/admin/login"
  status = 301

[[redirects]]
  from = "/portal"
  to = "/admin/partner-portal"
  status = 301

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-XSS-Protection = "1; mode=block"
```

**`README.md`** - Kopiera från `PORTAL_FILES/README.md` (finns i Bolt-projektet)

### 3.4 Ta bort publika webb-filer från portal-projektet

**OBS:** Detta gör vi ENDAST i den lokala portal-kopian, inte i northforce-web repository!

```bash
# Ta bort publika sidor som inte behövs i portal
rm -rf src/pages/HomePage.tsx
rm -rf src/pages/AboutPage.tsx
rm -rf src/pages/ContactPage.tsx
rm -rf src/pages/PricingPage.tsx
rm -rf src/pages/ServicesPage.tsx
rm -rf src/pages/SolutionsPage.tsx
rm -rf src/pages/IndustriesPage.tsx
rm -rf src/pages/ImpactPage.tsx
rm -rf src/pages/InsightsPage.tsx
rm -rf src/pages/CareersPage.tsx
rm -rf src/pages/LegalPage.tsx
rm -rf src/pages/PartnersPage.tsx
rm -rf src/pages/SystemsPage.tsx
rm -rf src/pages/CapabilitiesPage.tsx
rm -rf src/pages/AIAutomationPage.tsx
rm -rf src/pages/HybridModelPage.tsx
rm -rf src/pages/SystemOnlyPage.tsx
rm -rf src/pages/CMOPlusSystemPage.tsx
rm -rf src/pages/MethodPage.tsx
rm -rf src/pages/TokensPage.tsx
rm -rf src/pages/StrategicWebsitesPage.tsx
rm -rf src/pages/BusinessDataPage.tsx
rm -rf src/pages/AuditPage.tsx
rm -rf src/pages/*Old*.tsx

# Ta bort publika komponenter
rm -rf src/components/Header.tsx
rm -rf src/components/Footer.tsx
rm -rf src/components/HeroSection.tsx
rm -rf src/components/HeroMark.tsx
rm -rf src/components/ContactForm.tsx
rm -rf src/components/ContactInfo.tsx
rm -rf src/components/BookingForm.tsx
rm -rf src/components/BenefitsGrid.tsx
rm -rf src/components/BenefitsSection.tsx
rm -rf src/components/BeforeAfterSection.tsx
rm -rf src/components/CtaSection.tsx
rm -rf src/components/ObjectionsSection.tsx
rm -rf src/components/SocialIcons.tsx
rm -rf src/components/SEOHead.tsx
rm -rf src/components/CookieBanner.tsx
rm -rf src/components/*Old*.tsx

# Behåll dessa komponenter:
# - Analytics.tsx (används i portal)
# - Breadcrumbs.tsx (kan användas i portal)
# - LanguageSwitcher.tsx (används i portal)
# - ScrollToTop.tsx (används i portal)
# - index.ts (uppdateras nedan)

# Ta bort publika bilder som inte behövs
cd public
rm -f image*.png
# Behåll northforce-symbol-clean.png
# Ta bort robots.txt och sitemap.xml (portal ska inte indexeras)
rm -f robots.txt sitemap.xml
cd ..
```

### 3.5 Skapa ny App.tsx för portalen

**Skapa `src/App.tsx`** med endast portal routes:

```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import { ToastProvider } from './contexts/ToastContext';

// Admin Pages (importera från dina befintliga admin-sidor)
// Exempel - anpassa efter dina verkliga sidor:
// import AdminLogin from './pages/admin/AdminLogin';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import PartnerPortal from './pages/admin/partner-portal/PartnerDashboard';
// ... alla andra admin-sidor

function App() {
  return (
    <ToastProvider>
      <div className="App min-h-screen bg-gray-50">
        <Analytics />
        <ScrollToTop />

        <Routes>
          {/* Root redirect to admin */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Routes */}
          {/*
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/partner-portal/*" element={<PartnerPortal />} />
          ... alla dina admin routes
          */}

          {/* Customer Routes */}
          {/*
          <Route path="/admin/customer/portal/*" element={<CustomerPortal />} />
          ... alla dina customer routes
          */}

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
```

**OBS:** Du måste fylla i de faktiska admin-sidorna baserat på vad som finns i main branchen!

### 3.6 Commit och push till portal repository

```bash
# Lägg till alla filer
git add .

# Commit
git commit -m "Initial portal setup - complete code from main branch"

# Koppla till portal repository
git remote add origin https://github.com/northforce8/northforce-portal.git

# Push
git push -u origin main
```

✅ **Verifiering:** Koden finns nu i `northforce8/northforce-portal` repository

---

## STEG 4: KONFIGURERA NETLIFY FÖR PORTALEN

### 4.1 Skapa ny Netlify site

1. Gå till https://app.netlify.com/
2. Klicka "Add new site" → "Import an existing project"
3. Välj "GitHub"
4. Välj repository: `northforce8/northforce-portal`
5. Konfigurera:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`
6. Klicka "Deploy site"

### 4.2 Byt site name

1. Gå till Site settings → General → Site details
2. Klicka "Change site name"
3. Ändra till: `northforce-portal`
4. Spara

### 4.3 Lägg till environment variables

1. Gå till Site settings → Environment variables
2. Klicka "Add a variable"
3. Lägg till:
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://acafwflefwgdodpskfkm.supabase.co`
4. Lägg till ytterligare en:
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: (kopiera från din `.env` fil)
5. Klicka "Save"
6. Trigger redeploy

✅ **Verifiering:** Portal-siten deployas på Netlify

---

## STEG 5: KONFIGURERA DNS

### 5.1 Lägg till custom domain

**I Netlify:**
1. Gå till Site settings → Domain management
2. Klicka "Add custom domain"
3. Ange: `portal.northforce.io`
4. Klicka "Verify"

### 5.2 Uppdatera DNS

**Hos din DNS-leverantör:**
1. Logga in på DNS-hantering för northforce.io
2. Lägg till nytt CNAME-record:
   - Type: `CNAME`
   - Name: `portal`
   - Target: `northforce-portal.netlify.app`
   - TTL: `3600`
3. Spara

**Vänta:** 5-60 minuter för DNS-propagering

### 5.3 Verifiera SSL

1. Gå tillbaka till Netlify → Domain management
2. Netlify aktiverar automatiskt SSL
3. Besök: `https://portal.northforce.io`

✅ **Verifiering:** Portal är live på https://portal.northforce.io

---

## STEG 6: VERIFIERA PORTAL FUNGERAR

### 6.1 Test portal live site

**Besök:** https://portal.northforce.io

**Kontrollera:**
- ✓ Sidan laddas (ingen 404)
- ✓ AdminLogin eller liknande visas
- ✓ Inga console errors i browser
- ✓ Kan navigera till admin-sidor
- ✓ Supabase connection fungerar

**Om något inte fungerar:**
- Kontrollera Netlify build logs
- Kontrollera browser console
- Verifiera environment variables i Netlify
- Kontrollera att App.tsx har korrekta routes

✅ **Verifiering:** Portal fungerar perfekt!

---

## STEG 7: UPPDATERA MAIN BRANCHEN MED REN PUBLIK WEBB-KOD

**NU är det säkert att uppdatera main branchen eftersom portal-repositoryt fungerar!**

### 7.1 Via GitHub Web Interface (Enklast)

1. Gå till https://github.com/northforce8/northforce-web
2. Klicka på "Compare & pull request" knappen (om den syns)
   - ELLER klicka på "Pull requests" → "New pull request"
3. Konfigurera:
   - Base: `main`
   - Compare: `NorthForce-Portal`
4. Titel: `Replace main with clean public website code from NorthForce-Portal`
5. Description: `This replaces the unified codebase with clean public website code only. Portal code is now in separate repository: northforce-portal`
6. Klicka "Create pull request"
7. **VIKTIGT:** Granska ändringarna noga
8. Klicka "Merge pull request" → "Confirm merge"
9. Main branchen är nu uppdaterad med endast publik webb-kod!

### 7.2 ELLER via Git lokalt (Avancerat)

```bash
# Klona repository
git clone https://github.com/northforce8/northforce-web.git
cd northforce-web

# Checkout main
git checkout main

# Merge från NorthForce-Portal
git merge NorthForce-Portal --strategy=ours -m "Replace with clean public website code"

# Eller om du vill ersätta helt:
git checkout NorthForce-Portal
git branch -D main
git checkout -b main
git push origin main --force

# Push
git push origin main
```

✅ **Verifiering:** Main branchen innehåller nu endast publik webb-kod

---

## STEG 8: UPPDATERA BOLT-PROJEKTET

### 8.1 Byt branch i Bolt

**I Bolt UI:**
1. Klicka på GitHub-ikonen (top right)
2. Se "Active branch: NorthForce-Portal"
3. Klicka på "main" för att byta till main branch
4. Bolt kommer nu använda main branch (som nu innehåller samma rena kod)

**ELLER:**

Eftersom NorthForce-Portal och main nu innehåller samma kod, kan du fortsätta använda NorthForce-Portal branchen i Bolt. Det spelar ingen roll!

✅ **Verifiering:** Bolt-projektet använder rätt branch

---

## STEG 9: UPPDATERA REPOSITORY NAMN (VALFRITT)

### 9.1 Byt namn på northforce-web (valfritt)

Om du vill göra det ännu tydligare:

1. Gå till https://github.com/northforce8/northforce-web/settings
2. Scrolla ner till "Danger Zone"
3. Klicka "Rename repository"
4. Nytt namn: `northforce-website`
5. Uppdatera

**OBS:** Detta ändrar URL:en till `github.com/northforce8/northforce-website`

---

## STEG 10: SLUTVERIFIERING

### 10.1 Test båda sites

**Publik webb:**
- Besök: https://northforce.io
- ✓ Alla publika sidor fungerar
- ✓ Kontaktformulär fungerar
- ✓ /admin ger 404 (korrekt!)

**Portal:**
- Besök: https://portal.northforce.io
- ✓ AdminLogin fungerar
- ✓ Alla admin-funktioner fungerar
- ✓ /about eller /contact ger 404 eller redirect (korrekt!)

### 10.2 Verifiera GitHub

**northforce-web (eller northforce-website):**
- ✓ Main branch innehåller endast publik webb-kod
- ✓ Inga admin-mappar i src/
- ✓ Endast 4 filer i src/lib/

**northforce-portal:**
- ✓ Main branch innehåller endast portal-kod
- ✓ Inga publika sidor i src/pages/
- ✓ Alla lib-filer med AI services etc.

### 10.3 Verifiera Netlify

**northforce (eller northforce-website):**
- ✓ Kopplad till northforce-web/main (eller northforce-website/main)
- ✓ Deployas till northforce.io
- ✓ Build size ~600KB

**northforce-portal:**
- ✓ Kopplad till northforce-portal/main
- ✓ Deployas till portal.northforce.io
- ✓ Build size ~1.4MB

✅ **KLART! Projekten är nu 100% separerade!**

---

## SAMMANFATTNING

**DU HAR NU:**

✅ Två separata GitHub repositories:
  - `northforce8/northforce-web` (eller `northforce-website`) - Publik webb
  - `northforce8/northforce-portal` - Portal/Admin

✅ Två separata Netlify sites:
  - northforce.io - Publik webb
  - portal.northforce.io - Portal

✅ Två oberoende projekt:
  - Publika webbsidan kan deployas utan att påverka portalen
  - Portalen kan deployas utan att påverka publika webbsidan
  - Inga korsberoenden
  - Olika bundle sizes och performance

✅ Säkerhet:
  - All original kod finns i backup-release
  - Portal-kod fungerar i sitt eget repository
  - Publika webbsidan fungerar i sitt eget repository

**NEXT: Börja jobba separat med båda projekten!**
