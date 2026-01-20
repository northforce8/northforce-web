# NorthForce Deployment Guide

## Deployment Source: Netlify (Git Auto-Deploy)

**northforce.io** deploys automatically from Git via Netlify.

**Build Configuration:** See `netlify.toml`
- Build command: `npx vite build`
- Publish directory: `dist`

---

## SINGLE SOURCE OF TRUTH - Deployment Process

### Step 1: Push Code to Git

```bash
git add .
git commit -m "deploy: update frontend"
git push
```

Netlify will automatically:
1. Detect the push
2. Run `npx vite build`
3. Deploy the `dist` folder to northforce.io

### Step 2: Configure Environment Variables in Netlify

Go to: **Netlify Dashboard** → **Site Settings** → **Environment Variables**

**REQUIRED Variables:**

| Variable Name | Purpose | Example Value |
|--------------|---------|---------------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://acafwflefwgdodpskfkm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key for client auth | `eyJhbGci...` (long JWT token) |

**Where to Find These Values:**
- Supabase Dashboard → Project Settings → API
- Or check your local `.env` file

**CRITICAL:** These MUST be set in Netlify for admin to work. Without them, admin login will show a configuration error (not crash/blank).

---

## Verification on LIVE Site

### 1. Test Public Pages
Visit these URLs and verify they load:
- https://northforce.io/
- https://northforce.io/pricing
- https://northforce.io/contact

### 2. Test Admin Login (Critical)

**URL:** https://northforce.io/admin-login

**Expected Behavior:**

**IF env vars are configured correctly:**
- Login form is active
- Can enter credentials
- Login works normally

**IF env vars are missing:**
- Red error box appears at top
- Shows exact missing variables: `VITE_SUPABASE_URL` and/or `VITE_SUPABASE_ANON_KEY`
- Form is disabled (grayed out)
- Clear message: "Please configure these in your deployment platform (Netlify)"

**NEVER:** Blank/white page, JavaScript crash, or silent failure

### 3. Test Admin Routes (After Login)

After successful login, verify these work:
- https://northforce.io/admin
- https://northforce.io/admin/partner-portal/dashboard
- All menu items in Partner Portal

---

## Quick Troubleshooting

### Problem: Admin login shows config error

**Solution:** Add environment variables in Netlify
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy (Netlify → Deploys → Trigger deploy)

### Problem: Changes not visible on live site

**Causes:**
1. Code not pushed to Git
2. Netlify build failed
3. Browser cache

**Solutions:**
```bash
# 1. Verify git push worked
git status
git log -1

# 2. Check Netlify deploy logs in dashboard

# 3. Clear browser cache
# Chrome: Ctrl+Shift+Delete → Cached images and files
# Or: Hard refresh with Ctrl+F5
```

### Problem: Admin shows blank/white page

**This should NOT happen** after these fixes. The new error handling will show a clear configuration error instead.

If it still happens:
1. Open browser console (F12)
2. Screenshot any errors
3. Check Network tab for failed requests

---

## Environment Variables Summary

### Local Development (.env)
```
VITE_SUPABASE_URL=https://acafwflefwgdodpskfkm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Production (Netlify Dashboard)
Same variables, configured in:
**Site Settings → Environment Variables → Add a variable**

**CRITICAL:** Variable names must start with `VITE_` to be included in the build.

---

## Deploy Checklist

Before every deployment:

- [ ] Code changes committed to Git
- [ ] Local build works: `npm run build`
- [ ] No TypeScript errors
- [ ] Environment variables set in Netlify
- [ ] Pushed to Git: `git push`
- [ ] Netlify deploy succeeded (check dashboard)
- [ ] Test on live site: https://northforce.io
- [ ] Clear browser cache before testing
- [ ] Test admin login specifically

---

## Important Notes

1. **NO manual deploys needed** - Netlify auto-deploys on Git push
2. **NO local .env needed in Git** - Keep `.env` in `.gitignore`
3. **Environment variables MUST be in Netlify** - Not just in code
4. **Admin will never be blank** - Shows clear error if misconfigured
5. **Always test on actual live URL** - Not just localhost

---

## Support

If deployment issues persist:
1. Check Netlify deploy logs
2. Verify environment variables are set
3. Test in incognito mode (avoids cache)
4. Check browser console for errors
