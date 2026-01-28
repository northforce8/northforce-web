# Node Version Fix Report

## Problem (Bevis)

**Root Cause:** Netlify byggde med Node v18.20.8 medan kritiska paket kräver Node >=20:
- `react-router@7.8.2` → kräver Node >=20
- `@supabase/supabase-js@2.57.4` → kräver Node >=20
- Flera devDependencies → kräver Node >=20

**Symptom:** EBADENGINE errors i deploy-logg → "Something went wrong" i production/preview

**Proof:**
```
netlify.toml (before):
  NODE_VERSION = "18"  ❌
```

## Ändringar (Minimal Impact)

### 1. netlify.toml
```diff
[build.environment]
- NODE_VERSION = "18"
+ NODE_VERSION = "20"
```

### 2. package.json
```diff
{
  "name": "northforce-website",
  "private": true,
  "version": "0.0.0",
  "type": "module",
+  "engines": {
+    "node": ">=20.0.0",
+    "npm": ">=10.0.0"
+  },
```

### 3. .nvmrc (ny fil)
```
20
```

## Verifiering

✅ **Lokal build:** Lyckad (npm run build)
✅ **Bundle size:** Oförändrad (dist/index.html 5.99 kB)
✅ **All chunks:** Genererade korrekt
✅ **No breaking changes:** Endast Node version-bump

## Deployment Instruktioner

### Netlify Deploy (Production)
1. Push ändringar till main branch
2. Trigger deploy på Netlify Dashboard
3. **VIKTIGT:** Clear build cache innan deploy:
   - Netlify Dashboard → Site settings → Build & deploy → Clear cache and redeploy

### Netlify Deploy (Preview)
- Deploy previews använder automatiskt samma NODE_VERSION från netlify.toml

## Förebyggande Åtgärder

✅ **Triple Lock:** Node version nu specificerad i 3 platser:
1. `netlify.toml` → Netlify builds
2. `package.json engines` → npm install check
3. `.nvmrc` → Lokal utveckling (nvm use)

✅ **Future-proof:** Node 20 är LTS till April 2026

## Förväntad Effekt

**Efter redeploy:**
- ✅ EBADENGINE errors försvinner
- ✅ "Something went wrong" försvinner
- ✅ App laddas korrekt i production/preview
- ✅ Alla routes fungerar (SPA fallback redan konfigurerad)
- ✅ Assets cachas korrekt (immutable headers redan konfigurerade)

## Fallback Plan

Om "Something went wrong" kvarstår efter Node 20 deploy:
1. Check browser console för exact error message
2. Check Netlify Function logs (om edge functions används)
3. Verify SPA redirect fungerar: `curl -I https://[site].netlify.app/any-route`
4. Test asset loading: `curl -I https://[site].netlify.app/assets/index-*.js`

## Teknisk Kontext

**Varför Node 20?**
- react-router v7 använder moderna Node.js APIs
- @supabase/supabase-js v2.57+ kräver native fetch/crypto
- Node 20 är current LTS (Long Term Support)

**Varför inte Node 22?**
- Node 20 är tillräckligt och mer stabilt
- Netlify default för många projekt
- Backward compatible med all befintlig kod
