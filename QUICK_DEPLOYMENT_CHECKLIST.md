# QUICK DEPLOYMENT CHECKLIST

## 🎯 CURRENT STATUS

### ✅ COMPLETED (Local Changes Ready)
- [x] netlify.toml updated (NODE_VERSION = "20")
- [x] .nvmrc created (20)
- [x] package.json engines added (node >=20.0.0)
- [x] Local build verified (SUCCESS)
- [x] All configurations correct

### ⏳ PENDING (Manual Deployment Required)
- [ ] Push changes to GitHub
- [ ] Trigger Netlify deploy with cache clear
- [ ] Verify Node 20 in deploy log
- [ ] Verify site works in production
- [ ] Verify "Something went wrong" is gone

---

## 🚀 ACTION REQUIRED (DO THIS NOW)

### 1. Push to GitHub (1 min)
```bash
cd /path/to/your/project
git add netlify.toml .nvmrc package.json *.md
git commit -m "fix: upgrade Node to v20 for Netlify (resolve EBADENGINE)"
git push origin main
```

### 2. Clear Cache Deploy (2-3 min)
**Go to Netlify Dashboard:**
1. https://app.netlify.com → Select your site
2. Click "Deploys" tab
3. Click "Trigger deploy" → **"Clear cache and deploy site"**
4. Wait for deploy to finish

**⚠️ CRITICAL:** Must use "Clear cache" - regular deploy won't work!

### 3. Verify Success (1 min)
**Check Deploy Log for:**
```
Node version: v20.x.x ✅ (NOT v18.x.x)
Dependencies installed ✅ (no EBADENGINE)
Build succeeded ✅
```

**Check Production Site:**
- Open: https://[your-site].netlify.app
- Verify: Page loads (no "Something went wrong")
- Check: Browser console (no errors)

---

## 📋 VERIFICATION CHECKLIST

### Build Log Checks
- [ ] Shows "Node version: v20.x.x" (not v18)
- [ ] No "EBADENGINE" errors
- [ ] No "Unsupported engine" warnings
- [ ] Build completed successfully
- [ ] Deploy published successfully

### Production Site Checks
- [ ] Homepage loads correctly
- [ ] No "Something went wrong" message
- [ ] Browser console: no errors
- [ ] Admin routes work (if applicable)
- [ ] Images/assets load correctly

### Technical Checks
- [ ] HTML has correct cache headers (max-age=0)
- [ ] Assets have immutable cache headers
- [ ] SPA routing works (no 404 on refresh)
- [ ] All environment variables loaded

---

## 🐛 IF SOMETHING FAILS

### Deploy Log Still Shows Node v18
**Action:**
1. Check netlify.toml is in project root (not subfolder)
2. Verify commit was pushed to correct branch
3. Check Netlify site settings for NODE_VERSION override
4. Try deploy one more time with cache clear

### EBADENGINE Still Appears
**Action:**
1. Delete package-lock.json locally
2. Run `npm install`
3. Commit new package-lock.json
4. Push and deploy again

### "Something went wrong" Still Appears
**Action:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Hard refresh page (Ctrl+Shift+R)
4. Copy exact error message + stack trace
5. Report findings with screenshots

---

## 📊 EXPECTED TIMELINE

- **Push to GitHub:** 1 min
- **Netlify build:** 2-3 min
- **Verification:** 1 min
- **Total:** ~5 min

---

## ✅ SUCCESS CONFIRMATION

**You'll know it worked when:**

1. Deploy log shows: `Node version: v20.x.x` ✅
2. No EBADENGINE errors in log ✅
3. Site loads without errors ✅
4. No "Something went wrong" ✅
5. Browser console is clean ✅

---

## 📞 NEXT STEPS AFTER SUCCESS

1. ✅ Test all major routes
2. ✅ Test on mobile
3. ✅ Check analytics (if enabled)
4. ✅ Monitor error logs (first 24h)
5. ✅ Update documentation
6. ✅ Mark issue as resolved

---

## 📁 FILES TO COMMIT

```
netlify.toml (modified)
.nvmrc (new)
package.json (modified)
NODE_VERSION_FIX_REPORT.md (new)
DEPLOYMENT_VERIFICATION_GUIDE.md (new)
QUICK_DEPLOYMENT_CHECKLIST.md (new)
```

**Git Commands:**
```bash
git status  # verify files
git add netlify.toml .nvmrc package.json *.md
git commit -m "fix: upgrade Node to v20 for Netlify (resolve EBADENGINE)"
git push origin main
```

---

## 🎯 REMINDER

**This MUST be done to fix production:**
1. Changes are ready locally ✅
2. Must push to GitHub ⏳
3. Must deploy with cache clear ⏳
4. Then verify success ⏳

**Do not skip cache clear** - it's critical for Node version change!
