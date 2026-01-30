# SNABB CHECKLISTA - Projektuppdelning

**Följ stegen i ordning. Bocka av när klart.**

---

## ☑️ STEG 1: BACKUP (5 min)
- [ ] Gå till GitHub → northforce-web → Releases
- [ ] Skapa release: `backup-before-separation-2026-01-30` från main branch
- [ ] Verifiera att release är skapad

---

## ☑️ STEG 2: SKAPA PORTAL REPOSITORY (2 min)
- [ ] Gå till https://github.com/new
- [ ] Owner: `northforce8`
- [ ] Name: `northforce-portal`
- [ ] Visibility: Private ✓
- [ ] **INTE** "Add README" (lämna tom)
- [ ] Skapa repository
- [ ] Verifiera: `https://github.com/northforce8/northforce-portal` finns

---

## ☑️ STEG 3: KOPIERA KOD TILL PORTAL (30 min)

**Terminal:**
```bash
mkdir ~/northforce-portal-temp
cd ~/northforce-portal-temp
git clone -b main https://github.com/northforce8/northforce-web.git .
rm -rf .git
git init
git branch -M main
```

**Uppdatera filer:**
- [ ] `index.html`: Ändra title till "NorthForce – Portal"
- [ ] `package.json`: Ändra name till "northforce-portal"
- [ ] `public/_redirects`: Använd portal-specifik version
- [ ] `netlify.toml`: Använd portal-specifik version
- [ ] `README.md`: Kopiera från `PORTAL_FILES/README.md`

**Ta bort publika filer:**
- [ ] Ta bort publika sidor från `src/pages/`
- [ ] Ta bort publika komponenter från `src/components/`
- [ ] Ta bort publika bilder från `public/`
- [ ] Ta bort `robots.txt` och `sitemap.xml`

**Skapa portal App.tsx:**
- [ ] Skapa ny `src/App.tsx` med endast portal routes

**Push:**
```bash
git add .
git commit -m "Initial portal setup"
git remote add origin https://github.com/northforce8/northforce-portal.git
git push -u origin main
```

- [ ] Verifiera kod finns på GitHub

---

## ☑️ STEG 4: NETLIFY FÖR PORTAL (10 min)
- [ ] Gå till https://app.netlify.com/
- [ ] Add site → Import from GitHub
- [ ] Välj `northforce8/northforce-portal`
- [ ] Build: `npm run build`, Publish: `dist`
- [ ] Deploy site
- [ ] Ändra site name till: `northforce-portal`
- [ ] Lägg till environment variables:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Trigger redeploy
- [ ] Verifiera deploy success

---

## ☑️ STEG 5: DNS (10 min + väntetid)
- [ ] Netlify → Add domain: `portal.northforce.io`
- [ ] Hos DNS-leverantör: Lägg till CNAME
  - Type: `CNAME`
  - Name: `portal`
  - Target: `northforce-portal.netlify.app`
- [ ] Spara DNS
- [ ] **Vänta:** 5-60 min för DNS-propagering
- [ ] Verifiera: `https://portal.northforce.io` fungerar
- [ ] Verifiera: SSL aktiverat (grön hänglås)

---

## ☑️ STEG 6: VERIFIERA PORTAL (15 min)
- [ ] Besök: `https://portal.northforce.io`
- [ ] ✓ Sidan laddas
- [ ] ✓ AdminLogin eller liknande visas
- [ ] ✓ Inga console errors
- [ ] ✓ Kan navigera i admin
- [ ] ✓ Supabase fungerar

**OM NÅGOT INTE FUNGERAR - STOPPA HÄR OCH FELSÖK!**

---

## ☑️ STEG 7: UPPDATERA MAIN BRANCH (10 min)

**Via GitHub Web:**
- [ ] Gå till: `https://github.com/northforce8/northforce-web`
- [ ] Pull requests → New pull request
- [ ] Base: `main`, Compare: `NorthForce-Portal`
- [ ] Titel: "Replace main with clean public website code"
- [ ] Create pull request
- [ ] **Granska ändringarna noga**
- [ ] Merge pull request
- [ ] Verifiera: Main branch uppdaterad

---

## ☑️ STEG 8: SLUTVERIFIERING (10 min)

**Test publik webb:**
- [ ] Besök: `https://northforce.io`
- [ ] ✓ Alla publika sidor fungerar
- [ ] ✓ Kontaktformulär fungerar
- [ ] ✓ `/admin` ger 404 (korrekt!)

**Test portal:**
- [ ] Besök: `https://portal.northforce.io`
- [ ] ✓ Admin fungerar
- [ ] ✓ Portal fungerar
- [ ] ✓ `/about` eller `/contact` ger 404 (korrekt!)

**Verifiera GitHub:**
- [ ] `northforce-web/main`: Endast publik webb-kod
- [ ] `northforce-portal/main`: Endast portal-kod

**Verifiera Netlify:**
- [ ] Två separata sites
- [ ] Båda deployas korrekt
- [ ] Olika domäner

---

## ✅ KLART!

**Du har nu:**
- ✓ Två separata GitHub repositories
- ✓ Två separata Netlify sites
- ✓ Två oberoende domäner
- ✓ Fullständig isolering
- ✓ Backup av original-kod

**Nästa steg:**
- Jobba med publik webb via Bolt (northforce-web repository)
- Jobba med portal via din IDE (northforce-portal repository)
- Deploy oberoende
- Noll risk för sammanblandning

---

## 🆘 FELSÖKNING

**Portal bygger inte:**
- Kontrollera Node version: 20+
- Kontrollera att alla admin-sidor finns
- Kontrollera App.tsx routes

**DNS fungerar inte:**
- Vänta längre (kan ta 60 min)
- Kontrollera CNAME record hos DNS-leverantör
- Testa: `nslookup portal.northforce.io`

**Supabase fungerar inte:**
- Verifiera environment variables i Netlify
- Kontrollera `.env` lokalt
- Testa connection i browser console

**Build size för stor:**
- Normalt för portal (1.4MB med AI services etc.)
- Publik webb ska vara ~600KB

---

## 📞 BEHÖVER HJÄLP?

Om något går fel:
1. Återgå till backup-release
2. Dubbelkolla environment variables
3. Kontrollera Netlify build logs
4. Kontrollera browser console
