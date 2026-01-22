# Live Verification Guide - NorthForce.io

**Purpose:** Quick verification checklist to confirm deployment is successful
**Time Required:** 10-15 minutes
**Date:** 2026-01-22

---

## Quick Start: 3-Minute Smoke Test

After deployment completes, perform these critical checks:

### 1. Public Website (2 minutes)

**Visit:** https://northforce.io

- [ ] **Page loads** - No white screen
- [ ] **Images display** - NorthForce logo and graphics visible
- [ ] **Click "About"** - Page loads correctly
- [ ] **Click language switcher** (Globe icon) - Page changes to Swedish
- [ ] **Click "Contact"** - Form displays

**✅ If all pass:** Public site is working

---

### 2. Admin Portal (1 minute)

**Visit:** https://northforce.io/admin/login

- [ ] **Login page loads** - No white screen
- [ ] **Dashboard loads** after login - Stats display
- [ ] **Click "Customers"** - List displays
- [ ] **Click language switcher** in sidebar - Interface changes language

**✅ If all pass:** Admin portal is working

---

## Full Verification: 15-Minute Complete Test

### Phase 1: Public Website (5 minutes)

#### English Version
1. **Home Page** - https://northforce.io/
   - [ ] Hero section displays
   - [ ] Benefits section loads
   - [ ] Pricing visible
   - [ ] Footer displays

2. **Navigation Test:**
   - [ ] Click "About" → Page loads
   - [ ] Click "Services" → Page loads
   - [ ] Click "Pricing" → Page loads
   - [ ] Click "Contact" → Form displays

3. **Contact Form:**
   - [ ] Enter test name: "Test User"
   - [ ] Enter test email: "test@example.com"
   - [ ] Enter message: "Testing deployment"
   - [ ] Click "Send"
   - [ ] Should see success message (or validation)

#### Swedish Version
1. **Switch Language:**
   - [ ] Click Globe icon (top right)
   - [ ] Or visit: https://northforce.io/?lang=sv

2. **Verify Translation:**
   - [ ] Hero text is in Swedish
   - [ ] Navigation in Swedish ("Om Oss", "Tjänster", etc.)
   - [ ] Pricing in Swedish
   - [ ] Footer in Swedish

3. **Navigation Works:**
   - [ ] All links work in Swedish mode
   - [ ] Forms still functional
   - [ ] No English text visible (except brand names)

**✅ Public Website Complete**

---

### Phase 2: Admin Portal (5 minutes)

#### Login & Dashboard
1. **Login:**
   - Visit: https://northforce.io/admin/login
   - [ ] Enter admin credentials
   - [ ] Click "Login"
   - [ ] Redirects to dashboard

2. **Dashboard Check:**
   - [ ] Page loads (no white screen)
   - [ ] Sidebar visible
   - [ ] Stats cards display numbers
   - [ ] No error messages in red
   - [ ] Charts/graphs render

#### Navigation Menu
3. **Test Menu Items:**
   - [ ] Click "Customers" → List loads
   - [ ] Click "Projects" → List loads
   - [ ] Click "Contracts" → List loads
   - [ ] Click "Invoices" → List loads
   - [ ] Click "Settings" → Page loads

4. **Language Switch:**
   - [ ] Find Globe icon in sidebar (below menu)
   - [ ] Click to switch language
   - [ ] Menu text changes (EN ↔ SV)
   - [ ] Dashboard text updates
   - [ ] Click again to switch back

**✅ Admin Portal Complete**

---

### Phase 3: Strategic Frameworks (5 minutes)

#### Access Strategic Frameworks
1. **Navigate:**
   - [ ] In admin sidebar, find "Strategic Frameworks" section
   - [ ] Expand the accordion (click the section)
   - [ ] Should see list of frameworks

2. **Test Framework List Pages:**

   **OKR (Objectives & Key Results):**
   - [ ] Click "OKR - Objectives & Key Results"
   - [ ] List page loads (may be empty, that's OK)
   - [ ] See "Add Objective" or similar button
   - [ ] No white screen

   **SWOT Analysis:**
   - [ ] Click "SWOT Analysis"
   - [ ] List page loads
   - [ ] Can see grid or cards
   - [ ] No errors

   **Porter's Five Forces:**
   - [ ] Click "Porter's Five Forces"
   - [ ] List page loads
   - [ ] Shows analyses or empty state
   - [ ] No white screen

   **Business Model Canvas:**
   - [ ] Click "Business Model Canvas"
   - [ ] List page loads
   - [ ] Shows canvases or empty state
   - [ ] No errors

3. **Test ONE Detail Page:**

   **If data exists:**
   - [ ] Click on any existing item in any framework
   - [ ] Detail page loads
   - [ ] Shows data (not white screen)
   - [ ] "Back to [Framework]" button visible
   - [ ] Can navigate back

   **If no data exists:**
   - [ ] Try URL: `/admin/partner-portal/strategic-frameworks/okr/99999`
   - [ ] Should show "Objective not found" or similar
   - [ ] Should NOT show white screen
   - [ ] Should have back/navigation options

**✅ Strategic Frameworks Complete**

---

## Error Checking

### Browser Console Check
1. **Open DevTools:**
   - Press F12 (Windows/Linux)
   - Press Cmd+Option+I (Mac)

2. **Click "Console" Tab:**
   - [ ] Look for red error messages
   - [ ] Yellow warnings are OK
   - [ ] Red errors should be investigated

3. **Common Acceptable Messages:**
   - Translation warnings
   - Missing optional images
   - Analytics warnings
   - Deprecated warnings

4. **Critical Errors to Report:**
   - "Failed to load resource" (for main assets)
   - "Uncaught TypeError"
   - "Cannot read property of undefined"
   - Any white screen

---

## Known Limitations (Expected Behavior)

These are NOT bugs:

1. **Strategic Framework Detail Pages:**
   - Will show English text (not translated yet)
   - This is expected - translations added but not implemented
   - Pages should still load and function

2. **Empty Data States:**
   - Lists may be empty (no data yet)
   - This is normal for new installations
   - Should show "No data" messages, not errors

3. **Performance:**
   - First load may be slower (loading assets)
   - Subsequent loads should be fast (cached)

---

## Success Criteria

### Must Pass (Critical):
- [ ] No white screens on public site
- [ ] No white screens in admin portal
- [ ] Language switcher works on public site
- [ ] Can login to admin portal
- [ ] Dashboard displays after login
- [ ] Main navigation works

### Should Pass (Important):
- [ ] All public pages load in both languages
- [ ] All admin list pages load
- [ ] Detail pages show data or friendly error
- [ ] Forms work (contact form, login)
- [ ] Language switcher works in admin

### Nice to Have:
- [ ] Fast load times (< 3 seconds)
- [ ] No console errors
- [ ] All images load
- [ ] Smooth navigation

---

## If Something Fails

### White Screen Appears:
1. Open browser console (F12)
2. Check for red error messages
3. Note the URL where it happened
4. Try hard refresh (Ctrl+Shift+R)
5. Try incognito/private mode
6. If still fails, report the error

### Language Not Switching:
1. Hard refresh page (Ctrl+Shift+R)
2. Clear browser cache
3. Check localStorage (DevTools → Application → Local Storage)
4. Try clicking switcher multiple times
5. Check if URL updates or localStorage changes

### Admin Login Fails:
1. Verify credentials are correct
2. Check Supabase dashboard (database is accessible)
3. Check browser console for errors
4. Try different browser
5. Check network tab for 401/403 errors

### Page Loads But Shows Error:
1. **This is actually GOOD!**
2. It means error handling is working
3. Verify error message is user-friendly
4. Check if user can navigate away
5. Note what action caused the error

---

## Reporting Issues

If you find issues, collect this information:

**Environment:**
- Browser: (Chrome, Firefox, Safari, etc.)
- Browser Version:
- Operating System:
- Device: (Desktop, Mobile, Tablet)

**Issue Details:**
- URL where issue occurred:
- What you were doing:
- Expected behavior:
- Actual behavior:
- Error message (if any):
- Screenshot (if possible):

**Console Log:**
- Open DevTools (F12)
- Go to Console tab
- Copy any red error messages
- Include in report

---

## Quick Reference URLs

**Public:**
- Home: https://northforce.io/
- About: https://northforce.io/about
- Contact: https://northforce.io/contact
- Swedish: https://northforce.io/?lang=sv

**Admin:**
- Login: https://northforce.io/admin/login
- Dashboard: https://northforce.io/admin
- Customers: https://northforce.io/admin/partner-portal/customers
- Strategic Frameworks: https://northforce.io/admin/partner-portal/strategic-frameworks

---

## Deployment Timeline

**Expected Process:**
1. Push to GitHub: Instant
2. Netlify detects push: < 10 seconds
3. Build starts: Immediate
4. Build completes: ~2 minutes
5. Deploy to CDN: ~30 seconds
6. Site live: ~5 seconds DNS

**Total: ~3 minutes from push to live**

---

## Post-Verification Steps

After successful verification:

1. **Document Results:**
   - [ ] All tests passed
   - [ ] Note any issues found
   - [ ] Record any unexpected behavior

2. **Notify Team:**
   - [ ] Deployment complete
   - [ ] Verification passed
   - [ ] Site is live

3. **Monitor:**
   - [ ] Check error logs (if available)
   - [ ] Monitor user feedback
   - [ ] Watch for reports of issues

---

**Last Updated:** 2026-01-22
**Version:** 2025.01.22-0135
**Status:** READY FOR VERIFICATION ✅
