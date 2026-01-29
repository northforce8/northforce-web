# PORTAL SETUP GUIDE – STEG-FÖR-STEG

Denna guide beskriver hur du skapar det separata portal-projektet.

---

## 🎯 MÅL

Skapa ett helt separat projekt som innehåller:
- Admin portal
- Partner portal
- Customer portal
- Alla AI services
- Alla strategiska frameworks
- Supabase migrations & functions

---

## ⚠️ VIKTIGT

Detta projekt kommer att vara **helt separat** från det publika projektet:
- Olika GitHub repository
- Olika Netlify site
- Olika domän (portal.northforce.io)
- Ingen delad kod (utom Supabase connection)

---

## 📋 STEG 1: SKAPA GITHUB REPOSITORY

### 1.1 Gå till GitHub

Besök: https://github.com/new

### 1.2 Skapa Repository

```
Repository name: northforce-portal
Description: NorthForce Portal - Admin, Partner, and Customer management system
Visibility: Private (rekommenderat)
Initialize: ✓ Add a README file
.gitignore: None (vi lägger till egen)
License: None
```

Klicka "Create repository"

### 1.3 Klona Repository Lokalt

```bash
git clone git@github.com:[your-org]/northforce-portal.git
cd northforce-portal
```

---

## 📋 STEG 2: KOPIERA FILER FRÅN NUVARANDE PROJEKT

Du behöver kopiera alla admin/portal-relaterade filer från det nuvarande projektet.

**VIKTIGT:** Filerna finns fortfarande i git-historiken även om de är borttagna från main branch. Du kan återställa dem från en tidigare commit eller från en backup.

### 2.1 Återställ Filer från Git (Om Tillgängligt)

Om du har tillgång till git-historiken i det nuvarande projektet:

```bash
# Från northforce-website projektet
git checkout backup-before-separation-[timestamp]

# Eller hitta rätt commit
git log --oneline | grep "before separation"
git checkout [commit-hash]
```

### 2.2 Filer att Kopiera

**Kopiera följande till northforce-portal projektet:**

#### Root Files
```bash
# Navigera till northforce-portal directory
cd northforce-portal

# Kopiera root files från northforce-website
cp ../northforce-website/.gitignore .
cp ../northforce-website/.nvmrc .
cp ../northforce-website/eslint.config.js .
cp ../northforce-website/postcss.config.js .
cp ../northforce-website/tailwindconfig.js .
cp ../northforce-website/tsconfig*.json .
cp ../northforce-website/.env .env.example
```

#### Package Files (Kräver Uppdatering)
```bash
# Kopiera package.json
cp ../northforce-website/package.json .

# UPPDATERA package.json:
# Ändra name från "northforce-website" till "northforce-portal"
# Lägg tillbaka jspdf dependencies:
#   "jspdf": "^3.0.4",
#   "jspdf-autotable": "^5.0.2"
```

#### Index.html (Kräver Uppdatering)
```bash
cp ../northforce-website/index.html .

# UPPDATERA index.html:
# Ändra <title> till: "NorthForce – Portal"
# Ta bort SEO meta tags (portal ska inte indexeras)
# Ta bort Open Graph tags
```

#### Vite Config (Kräver Uppdatering)
```bash
cp ../northforce-website/vite.config.ts .

# UPPDATERA vite.config.ts:
# Lägg tillbaka manual chunks för admin, portal, etc.
# (Se exempel nedan)
```

#### Public Directory
```bash
mkdir -p public
cp ../northforce-website/public/northforce-symbol-clean.png public/

# Skapa ny _redirects fil för portal
cat > public/_redirects << 'EOF'
# Portal redirects
/login /admin/login 301
/portal /admin/partner-portal 301

# Prevent search engine indexing
/robots.txt 200
User-agent: *
Disallow: /

# SPA fallback
/*    /index.html   200
EOF
```

#### Source Directory - Admin Pages
```bash
# Från git backup eller tidigare commit
# Kopiera hela admin-strukturen

mkdir -p src/pages/admin/partner-portal
# Kopiera alla admin-sidor (från backup)
# Lista över filer finns i COMPLETE_SEPARATION_PLAN.md
```

#### Source Directory - Customer Pages
```bash
mkdir -p src/pages/customer
# Kopiera alla customer-sidor (från backup)
```

#### Source Directory - Admin Components
```bash
mkdir -p src/components/admin/{okr,strategic,ui}
mkdir -p src/components/customer
mkdir -p src/components/ui
# Kopiera alla admin-komponenter (från backup)
```

#### Source Directory - Lib Files
```bash
mkdir -p src/lib
# Kopiera alla lib-filer (från backup)
# Total: 39 filer inklusive alla AI services
```

#### Supabase
```bash
mkdir -p supabase/{migrations,functions}
# Kopiera alla migrations och functions (från backup)
```

#### Tests
```bash
mkdir -p src/tests/{unit,performance}
# Kopiera alla tests (från backup)
```

#### Locales
```bash
mkdir -p src/locales
# Kopiera translations (från backup)
```

#### Contexts & Hooks
```bash
mkdir -p src/{contexts,hooks}
# Kopiera contexts och hooks (från backup)
```

---

## 📋 STEG 3: SKAPA NY APP.TSX FÖR PORTAL

Skapa `src/App.tsx` med ENDAST portal routes:

```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import AdminErrorBoundary from './components/admin/AdminErrorBoundary';
import AdminLayout from './components/admin/AdminLayout';
import { ToastProvider } from './contexts/ToastContext';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import { SetupWizard } from './pages/admin/SetupWizard';
import PasswordResetPage from './pages/admin/PasswordResetPage';
import AdminDashboard from './pages/admin/AdminDashboard';
// ... importera alla andra admin-sidor

// Customer Portal
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerLayout from './components/customer/CustomerLayout';
// ... importera alla customer-sidor

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Analytics />
        <ScrollToTop />

        <Routes>
          {/* Root redirects to admin login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          
          {/* Admin Login & Setup */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<SetupWizard />} />
          <Route path="/admin/password-reset" element={<PasswordResetPage />} />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/partner-portal" element={
            <AdminErrorBoundary>
              <AdminLayout />
            </AdminErrorBoundary>
          }>
            {/* Alla admin routes här */}
          </Route>

          {/* Customer Portal Routes */}
          <Route path="/admin/customer/login" element={<CustomerLogin />} />
          <Route path="/admin/customer/portal" element={<CustomerLayout />}>
            {/* Alla customer routes här */}
          </Route>
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
```

---

## 📋 STEG 4: UPPDATERA KONFIGURATIONSFILER

### 4.1 package.json

```json
{
  "name": "northforce-portal",
  "description": "NorthForce Portal - Admin, Partner, and Customer management system",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
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
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### 4.2 index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/northforce-symbol-clean.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>NorthForce – Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 4.3 netlify.toml

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
```

---

## 📋 STEG 5: INSTALLERA OCH TESTA LOKALT

```bash
# Installera dependencies
npm install

# Starta dev server
npm run dev

# Testa att portalen fungerar
# Besök http://localhost:5173
# Bör omdirigera till /admin/login

# Testa build
npm run build
```

---

## 📋 STEG 6: SKAPA NETLIFY SITE

### 6.1 Gå till Netlify

Besök: https://app.netlify.com/

### 6.2 Skapa Ny Site

```
Add new site → Import an existing project
Connect to Git provider → GitHub
Select repository: northforce-portal

Build settings:
  Branch to deploy: main
  Build command: npm run build
  Publish directory: dist
  
Node version: 20
```

### 6.3 Sätt Environment Variables

I Netlify dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL=https://acafwflefwgdodpskfkm.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
```

### 6.4 Deploy

```bash
# Från lokalt projekt
git add .
git commit -m "Initial portal setup - complete separation"
git push origin main

# Netlify kommer auto-deploya
```

---

## 📋 STEG 7: KONFIGURERA DNS

### 7.1 Hitta Netlify URL

I Netlify dashboard → Site settings → Domain management

Din default URL: `[site-name].netlify.app`

### 7.2 Lägg till Custom Domain

I Netlify:
- Domain management → Add custom domain
- Enter: `portal.northforce.io`

### 7.3 Uppdatera DNS hos Leverantör

Hos din DNS-provider (t.ex. Cloudflare, AWS Route53):

```
Type: CNAME
Name: portal
Value: [site-name].netlify.app
TTL: 3600
```

Optional alias:
```
Type: CNAME
Name: admin
Value: [site-name].netlify.app
```

### 7.4 Aktivera HTTPS

I Netlify → Domain settings → HTTPS:
- Aktivera "Force HTTPS"
- Vänta på SSL certificate (kan ta 5-60 min)

---

## ✅ VERIFIERING

### Test 1: Portal Fungerar

```
Besök: https://portal.northforce.io
Förväntat: Omdirigeras till login-sidan
```

### Test 2: Publika Routes Finns INTE

```
Besök: https://portal.northforce.io/about
Förväntat: 404 eller redirect till login
```

### Test 3: Admin Routes Fungerar

```
Logga in och testa:
✓ /admin/partner-portal → Dashboard
✓ /admin/partner-portal/customers → Customers lista
✓ /admin/partner-portal/strategic-frameworks → Frameworks
```

### Test 4: Supabase Connection

```
✓ Login fungerar
✓ Data läses från Supabase
✓ RLS policies fungerar
```

### Test 5: Build Size

```
Förväntat: ~1.4MB bundle (acceptabelt för portal)
```

---

## 🎯 SLUTRESULTAT

**Du har nu två helt separata projekt:**

### NorthForce – Website (northforce.io)
```
Repository: northforce-website
Domain: northforce.io
Innehåll: ENDAST publik webb
Bundle: ~622KB
```

### NorthForce – Portal (portal.northforce.io)
```
Repository: northforce-portal
Domain: portal.northforce.io
Innehåll: ENDAST admin/portal
Bundle: ~1.4MB
```

**Projekten är 100% isolerade:**
- ✅ Olika repositories
- ✅ Olika Netlify sites
- ✅ Olika domäner
- ✅ Oberoende deploys
- ✅ Noll delad kod (utom Supabase config)

---

## 📞 SUPPORT

Om något går fel:

1. **Build fails:** Kontrollera att alla dependencies finns i package.json
2. **Routes fungerar inte:** Verifiera App.tsx och public/_redirects
3. **Supabase connection fails:** Kontrollera environment variables
4. **DNS fungerar inte:** Vänta 5-60 min för DNS propagation

---

## 📝 SLUTNOTER

**Viktigt:**
- Projekten delar samma Supabase database (normalt)
- RLS policies säkerställer att rätt användare får tillgång till rätt data
- Publika webbplatsen har access till public tables (contact_submissions, booking_submissions)
- Portal har access till admin tables (customers, partners, contracts, etc.)

**Framtida Arbetsflöde:**
- Publika webb → Arbeta i Bolt (northforce-website repo)
- Admin/Portal → Arbeta i IDE (northforce-portal repo)
- Noll risk för merge conflicts
- Oberoende deploys

**Separation slutförd: 2026-01-29**
