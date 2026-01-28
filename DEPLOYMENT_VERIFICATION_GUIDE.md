# LIVE Deployment Verification Guide

## ✅ PRE-DEPLOYMENT CHECKLIST (COMPLETED)

### Local Verification
- ✅ **netlify.toml** → NODE_VERSION = "20"
- ✅ **.nvmrc** → 20
- ✅ **package.json** → engines.node = ">=20.0.0"
- ✅ **Local build** → SUCCESS (npm run build)
- ✅ **SPA redirect** → Configured (/* → /index.html)
- ✅ **Cache headers** → Configured (HTML no-cache, assets immutable)

### Files Changed
```
Modified: netlify.toml (NODE_VERSION 18→20)
Created: .nvmrc (20)
Modified: package.json (added engines)
Created: NODE_VERSION_FIX_REPORT.md
```

---

## 🚀 DEPLOYMENT STEPS (MANUAL - REQUIRED)

### Step 1: Push to GitHub
```bash
git add netlify.toml .nvmrc package.json NODE_VERSION_FIX_REPORT.md DEPLOYMENT_VERIFICATION_GUIDE.md
git commit -m "fix: upgrade Node version to 20 for Netlify builds (resolve EBADENGINE)"
git push origin main
```

### Step 2: Trigger Netlify Deploy (CRITICAL)

**Option A: Netlify Dashboard (RECOMMENDED)**
1. Go to: https://app.netlify.com/sites/[your-site-name]/deploys
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"** ← MUST USE THIS
4. Wait for deploy to complete

**Option B: Netlify CLI**
```bash
netlify deploy --prod --build --clear-cache
```

**WHY CLEAR CACHE?**
- Old cache might contain Node 18 binaries
- npm dependencies cached with wrong Node version
- Ensures clean build with Node 20

### Step 3: Verify Deploy Log

**Check for these lines in deploy log:**
```
✅ Node version: v20.x.x (NOT v18.x.x)
✅ No EBADENGINE warnings
✅ Build succeeded
✅ Site is live
```

**Red flags (means cache wasn't cleared):**
```
❌ Node version: v18.20.8
❌ npm ERR! code EBADENGINE
❌ npm ERR! engine Unsupported engine
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### 1. Check Production Site
```bash
# Test home page
curl -I https://[your-site].netlify.app/

# Test SPA routing (should return 200, not 404)
curl -I https://[your-site].netlify.app/admin

# Test assets (should have immutable cache)
curl -I https://[your-site].netlify.app/assets/index-*.js
```

**Expected:**
- HTTP 200 for all routes
- HTML has `Cache-Control: public, max-age=0, must-revalidate`
- Assets have `Cache-Control: public, max-age=31536000, immutable`

### 2. Browser Console Check
1. Open site in browser
2. Open DevTools (F12) → Console tab
3. Refresh page (Ctrl+Shift+R / Cmd+Shift+R for hard refresh)

**Success criteria:**
- ✅ No errors in console
- ✅ No "Something went wrong" message
- ✅ App loads correctly
- ✅ Navigation works

**If errors exist:**
- 📸 Screenshot exact error message
- 📋 Copy full stack trace
- 🔍 Check Network tab for failed requests

### 3. Deploy Preview Check
1. Create a new branch and push (triggers preview)
2. Verify preview uses Node 20 (check deploy log)
3. Test preview URL same as production

---

## 🐛 TROUBLESHOOTING

### Issue: Deploy still uses Node 18
**Solution:**
1. Verify netlify.toml is in root directory (not subdirectory)
2. Check Netlify site settings → Build & deploy → Environment
3. Remove any NODE_VERSION override in Netlify UI
4. Clear cache and redeploy

### Issue: EBADENGINE still appears
**Solution:**
1. Verify package.json engines matches netlify.toml
2. Check for .node-version file (conflicts with .nvmrc)
3. Delete package-lock.json and regenerate
4. Clear Netlify cache completely

### Issue: "Something went wrong" persists
**Solution:**
1. Get browser console error (exact message + stack trace)
2. Check Netlify Function logs (if using edge functions)
3. Verify environment variables are set in Netlify
4. Test locally with `npm run build && npm run preview`

### Issue: Routes return 404
**Solution:**
1. Verify netlify.toml redirects section exists
2. Check `/* → /index.html` status 200 rule
3. Ensure public/_redirects is NOT overriding netlify.toml
4. Clear browser cache and try again

---

## 📊 EXPECTED RESULTS

### Deploy Log (Success Example)
```
12:34:56 PM: Build ready to start
12:34:58 PM: build-image version: 123abc
12:35:00 PM: Node version: v20.11.1 ✅
12:35:02 PM: npm version: 10.2.4 ✅
12:35:10 PM: Installing dependencies
12:35:15 PM: Dependencies installed ✅ (no EBADENGINE)
12:35:20 PM: Running build command
12:36:00 PM: Build succeeded ✅
12:36:05 PM: Site is live ✅
```

### Browser Console (Success Example)
```
(no errors)
[Vite] connected.
[i18next] initialized
```

### Production URL (Success Example)
```
https://[your-site].netlify.app/
Status: 200 OK ✅
Content loads ✅
Navigation works ✅
No errors ✅
```

---

## 📝 VERIFICATION REPORT TEMPLATE

After deployment, fill in this template:

```markdown
## Node 20 Deployment Verification

**Deploy Date:** [DATE]
**Deploy ID:** [NETLIFY_DEPLOY_ID]

### Build Configuration
- [x] netlify.toml NODE_VERSION = "20"
- [x] .nvmrc = "20"
- [x] package.json engines.node = ">=20.0.0"

### Deploy Log Verification
- [ ] Node version: v20.x.x (actual: _____)
- [ ] No EBADENGINE warnings
- [ ] Build succeeded
- [ ] Deploy duration: _____ seconds

### Production Verification
- [ ] Home page loads (https://[site].netlify.app)
- [ ] Admin routes work (https://[site].netlify.app/admin)
- [ ] Browser console: no errors
- [ ] Network tab: all assets load 200 OK

### Deploy Preview Verification
- [ ] Preview uses Node 20
- [ ] Preview site works correctly

### Issues Found
- [ ] None
- [ ] List any issues: _____

### Resolution Status
- [ ] ✅ RESOLVED - "Something went wrong" eliminated
- [ ] ⚠️ PARTIAL - Some issues remain (list above)
- [ ] ❌ UNRESOLVED - Needs further investigation
```

---

## 🎯 SUCCESS CRITERIA

**All of these MUST be true:**

1. ✅ Netlify builds with Node v20.x.x (verify in deploy log)
2. ✅ No EBADENGINE errors in deploy log
3. ✅ Production site loads without errors
4. ✅ Browser console shows no errors
5. ✅ "Something went wrong" message is gone
6. ✅ All routes work (SPA routing functional)
7. ✅ Assets load correctly with proper caching
8. ✅ Deploy previews use same Node version

**If ANY of above fail:**
- Document exact failure
- Check corresponding troubleshooting section
- Collect logs/screenshots
- Report findings for further investigation

---

## 🔗 QUICK LINKS

**Netlify Dashboard:**
- Site Overview: https://app.netlify.com/sites/[your-site]
- Deploys: https://app.netlify.com/sites/[your-site]/deploys
- Build Settings: https://app.netlify.com/sites/[your-site]/settings/deploys
- Environment: https://app.netlify.com/sites/[your-site]/settings/deploys#environment

**Documentation:**
- Netlify Node Version: https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript
- SPA Redirects: https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps

---

## 💡 PREVENTION

**To prevent this issue in future:**

1. **Lock Node version** in all three places:
   - netlify.toml (Netlify builds)
   - package.json engines (npm install check)
   - .nvmrc (local development)

2. **Monitor dependencies:**
   ```bash
   npm outdated
   npm audit
   ```

3. **Test before deploy:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Use same Node version locally as production**
   ```bash
   nvm install 20
   nvm use 20
   ```

5. **Clear cache on major changes:**
   - New Node version
   - Major dependency updates
   - Build configuration changes
