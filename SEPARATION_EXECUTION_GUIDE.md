# PROJEKTUPPDELNING - STEG-FÖR-STEG GUIDE

**Datum:** 2026-01-30
**Status:** Exekveringsfas påbörjad
**Säkerhetsregel:** Ingen kod raderas förrän nya portal-projektet är verifierat fungerande

---

## ÖVERSIKT

Vi kommer att:
1. ✅ Skapa nytt GitHub repository för portalen
2. ✅ Kopiera portal-kod till nya repositoryt
3. ✅ Konfigurera Netlify för portalen
4. ✅ Verifiera att portalen fungerar
5. ✅ EFTER VERIFIERING: Rensa publika webbprojektet

---

## FAS 1: SKAPA PORTAL-REPOSITORY (GitHub)

### Steg 1.1: Skapa nytt repository på GitHub

**Via GitHub Web:**
1. Gå till https://github.com/new
2. Fyll i:
   - Owner: `northforce8`
   - Repository name: `northforce-portal`
   - Description: `NorthForce Portal - Admin, Partner, and Customer management system`
   - Visibility: **Private** ✓
   - Initialize: ✓ Add a README file
3. Klicka "Create repository"

**Resultat:** Nytt tomt repository skapat på `https://github.com/northforce8/northforce-portal`

---

## FAS 2: FÖRBERED PORTAL-FILERNA (Lokalt)

Denna fas gör vi genom att skapa en komplett lista över vad som ska kopieras.

### Portal-projektets struktur:

```
northforce-portal/
├── .gitignore
├── .nvmrc
├── eslint.config.js
├── index.html (uppdaterad title)
├── netlify.toml (portal-specifik)
├── package.json (uppdaterat namn)
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md (ny portal-specifik)
├── .env (kopierad)
├── public/
│   ├── _redirects (portal-specifik)
│   └── northforce-symbol-clean.png
├── src/
│   ├── App.tsx (NY - endast portal routes)
│   ├── main.tsx
│   ├── i18n.ts
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── middleware.ts
│   ├── components/
│   │   ├── Analytics.tsx
│   │   ├── admin/ (HELA MAPPEN)
│   │   ├── customer/ (HELA MAPPEN)
│   │   └── ui/ (HELA MAPPEN)
│   ├── pages/
│   │   ├── admin/ (HELA MAPPEN)
│   │   └── customer/ (HELA MAPPEN)
│   ├── lib/ (ALLA filer)
│   ├── locales/
│   │   ├── en.json (komplett)
│   │   └── sv.json (komplett)
│   ├── contexts/
│   │   ├── LanguageContext.tsx
│   │   └── ToastContext.tsx
│   └── hooks/
│       └── useDarkMode.ts
└── supabase/ (om finns)
    ├── migrations/
    └── functions/
```

---

## FAS 3: KONFIGURERA NETLIFY FÖR PORTALEN

### Steg 3.1: Skapa ny Netlify site

**Via Netlify Dashboard:**
1. Gå till https://app.netlify.com/
2. Klicka "Add new site" → "Import an existing project"
3. Välj "GitHub"
4. Välj repository: `northforce8/northforce-portal`
5. Konfigurera:
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Klicka "Deploy site"

### Steg 3.2: Konfigurera site settings

**Site name:**
1. Gå till Site settings → General → Site details
2. Klicka "Change site name"
3. Ändra till: `northforce-portal`
4. Spara

### Steg 3.3: Lägg till environment variables

**Via Netlify Dashboard:**
1. Gå till Site settings → Environment variables
2. Lägg till:
   ```
   VITE_SUPABASE_URL = https://acafwflefwgdodpskfkm.supabase.co
   VITE_SUPABASE_ANON_KEY = [din anon key från .env]
   ```

---

## FAS 4: KONFIGURERA DNS

### Steg 4.1: Lägg till custom domain i Netlify

**Via Netlify Dashboard:**
1. Gå till Site settings → Domain management
2. Klicka "Add custom domain"
3. Ange: `portal.northforce.io`
4. Klicka "Verify"
5. Netlify visar DNS-instruktioner

### Steg 4.2: Uppdatera DNS hos domänleverantör

**Hos din DNS-leverantör:**
1. Logga in på din DNS-hantering
2. Lägg till nytt CNAME-record:
   - Type: `CNAME`
   - Name: `portal`
   - Value: `northforce-portal.netlify.app`
   - TTL: `3600` (eller automatic)
3. Spara

**Vänta:** DNS-propagering tar 5-60 minuter

### Steg 4.3: Aktivera SSL

**Via Netlify Dashboard:**
1. Gå till Site settings → Domain management → HTTPS
2. Netlify aktiverar automatiskt SSL när DNS är propagerat
3. Verifiera att `https://portal.northforce.io` fungerar

---

## FAS 5: VERIFIERA PORTAL-PROJEKTET

### Steg 5.1: Test lokalt (om möjligt)

```bash
cd northforce-portal
npm install
npm run build
npm run preview
```

**Testa:**
- ✓ / → AdminLogin visas
- ✓ Inga console errors
- ✓ Build success

### Steg 5.2: Test live site

**Besök:** https://portal.northforce.io

**Testa:**
- ✓ AdminLogin visas på /
- ✓ Ingen 404 errors
- ✓ Supabase connection fungerar (prova login om möjligt)

---

## FAS 6: RENSA PUBLIKA WEBBPROJEKTET

**VIKTIGT:** Genomför endast efter att portal-projektet är verifierat fungerande!

### Steg 6.1: Skapa backup

```bash
# I northforce-web repository
git tag backup-before-cleanup-2026-01-30
git push origin backup-before-cleanup-2026-01-30
```

### Steg 6.2: Växla till main branch

```bash
git checkout main
```

### Steg 6.3: Ta bort portal-relaterad kod

Detta kommer att göras genom Bolt när portal-projektet är verifierat.

**Filer som kommer tas bort:**
- src/components/admin/ (hela mappen)
- src/components/customer/ (hela mappen)
- src/components/ui/ (hela mappen)
- src/pages/admin/ (hela mappen)
- src/pages/customer/ (hela mappen)
- Större delen av src/lib/ (behåller endast supabase.ts, email-service.ts, error-handler.ts, logger.ts)

**Filer som kommer uppdateras:**
- src/App.tsx (endast publika routes)
- package.json (ta bort jspdf dependencies)
- public/_redirects (endast publika redirects)
- src/locales/en.json och sv.json (endast publika översättningar)

---

## FAS 7: SLUTVERIFIERING

### Steg 7.1: Test publik webb

**Besök:** https://northforce.io

**Testa:**
- ✓ Alla publika sidor fungerar
- ✓ Kontaktformulär fungerar
- ✓ Snabb laddning (<1.5s)
- ✓ /admin ger 404 (korrekt!)

### Steg 7.2: Test portal

**Besök:** https://portal.northforce.io

**Testa:**
- ✓ AdminLogin fungerar
- ✓ Admin dashboard fungerar
- ✓ Alla portal-funktioner fungerar

### Steg 7.3: Verifiera isolering

**Kontrollera:**
- ✓ northforce-web repository innehåller ENDAST publik webb-kod
- ✓ northforce-portal repository innehåller ENDAST portal-kod
- ✓ Båda projekten deployas oberoende
- ✓ Inga korsberoenden

---

## CHECKLISTA FÖR GENOMFÖRANDE

### GitHub Setup
- [ ] Skapa `northforce8/northforce-portal` repository
- [ ] Verifiera att repository är skapat och privat

### Portal-projekt Setup
- [ ] Kopiera alla portal-filer till nya repositoryt
- [ ] Uppdatera index.html title till "NorthForce – Portal"
- [ ] Uppdatera package.json name till "northforce-portal"
- [ ] Skapa ny App.tsx med endast portal routes
- [ ] Skapa portal-specifik _redirects
- [ ] Skapa portal-specifik README.md
- [ ] Commit och push till GitHub

### Netlify Setup
- [ ] Skapa ny Netlify site för portal-repositoryt
- [ ] Konfigurera build settings
- [ ] Lägg till environment variables
- [ ] Ändra site name till "northforce-portal"
- [ ] Verifiera första deploy success

### DNS Setup
- [ ] Lägg till CNAME för portal.northforce.io
- [ ] Vänta på DNS-propagering (5-60 min)
- [ ] Verifiera att portal.northforce.io är tillgänglig
- [ ] Aktivera SSL-certifikat
- [ ] Verifiera att https://portal.northforce.io fungerar

### Portal Verifiering
- [ ] Test local build (om möjligt)
- [ ] Test live site på portal.northforce.io
- [ ] Verifiera AdminLogin visas
- [ ] Verifiera Supabase connection
- [ ] Inga console errors
- [ ] Alla portal routes fungerar

### Rensa Publika Webbprojektet (EFTER portal-verifiering)
- [ ] Skapa backup-tag i northforce-web
- [ ] Växla till main branch
- [ ] Ta bort admin/customer/ui komponenter
- [ ] Ta bort admin/customer sidor
- [ ] Rensa lib-filer (behåll endast 4 grundläggande)
- [ ] Uppdatera App.tsx (endast publika routes)
- [ ] Rensa package.json dependencies
- [ ] Uppdatera locales (ta bort admin-texter)
- [ ] Uppdatera _redirects (endast publika)
- [ ] Test local build
- [ ] Commit och push
- [ ] Verifiera deploy success

### Slutverifiering
- [ ] Test northforce.io (alla publika sidor)
- [ ] Test portal.northforce.io (alla portal funktioner)
- [ ] Verifiera att /admin ger 404 på northforce.io
- [ ] Verifiera isolering (inga korsberoenden)
- [ ] Performance test båda sites
- [ ] Dokumentation uppdaterad

---

## NÄSTA STEG

**Nu:** Börja med GitHub Setup (FAS 1)
**Sedan:** Portal-projekt Setup (FAS 2)
**Sist:** Rensa publika webbprojektet (FAS 6) - endast efter verifiering!

**Viktigt att komma ihåg:**
- Ingen kod raderas förrän portal-projektet är verifierat fungerande
- Skapa backup-tag innan varje större ändring
- Testa efter varje fas innan du går vidare
- Båda projekt ska fungera oberoende när vi är klara

---

## SUPPORT OCH FELSÖKNING

Om något går fel i någon fas:
1. Återgå till senaste backup-tag
2. Verifiera att environment variables är korrekta
3. Kontrollera Netlify build logs
4. Kontrollera browser console för errors
5. Verifiera DNS-propagering (kan ta upp till 60 min)
