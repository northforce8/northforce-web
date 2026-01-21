# Admin Portal Error Capture System

**Build Version:** 2025.01.15-1411
**Deployment Date:** 2026-01-21
**Status:** ACTIVE - White Screen Diagnostics Enabled

## Overview

Comprehensive error capture system deployed to diagnose and prevent admin portal white screens. This system captures ALL errors that would otherwise result in a blank screen and displays them with full diagnostic information.

## What Was Implemented

### 1. Enhanced AdminErrorBoundary Component
**Location:** `src/components/admin/AdminErrorBoundary.tsx`

**Features:**
- Captures all React component errors
- Displays full error stack traces (first 30 lines)
- Shows component stack traces (first 30 lines)
- Records route, language, timestamp, user agent
- Copy-to-clipboard functionality for error reports
- Console logging with structured format
- Visible red error screen instead of white screen

**Error Information Captured:**
- Error ID (unique identifier)
- Error message
- Full stack trace
- Component stack trace
- Route pathname
- Language setting (en/sv)
- User agent string
- Timestamp (ISO format)
- Build version marker

### 2. Global Window Error Handlers
**Location:** `src/components/admin/AdminLayout.tsx`

**Features:**
- Captures window-level errors (`window.addEventListener('error')`)
- Captures unhandled promise rejections (`window.addEventListener('unhandledrejection')`)
- Displays errors that occur outside React's error boundary
- Shows filename, line number, column number for errors
- Displays on red background for high visibility

**Error Information Captured:**
- Error message
- Source file and location (filename:line:column)
- Error stack trace
- Promise rejection reasons
- Route and language context
- Build version marker

### 3. Error Display System

Both error types display a prominent error screen instead of white screen:

**Visual Design:**
- Large red error indicator (AlertTriangle icon)
- Clear heading: "Admin UI Crashed - White Screen Captured"
- Red-bordered error details box
- Black terminal-style code blocks for stack traces
- Copy button for complete error report
- Reload and "Go to Dashboard" action buttons
- Build version displayed at bottom

**No More White Screens:**
- All errors are now visible
- Full diagnostic information displayed
- User can copy and share error details
- Recovery options provided (reload/go home)

## How To Use This System

### When White Screen Occurs:

1. **Error Screen Appears:** Instead of blank white screen, you'll see a red error screen
2. **Read Error Message:** Check the error message in the red box
3. **View Stack Traces:** Expand the black terminal windows to see:
   - Error Stack Trace (where in code the error occurred)
   - Component Stack (which React components were involved)
4. **Copy Report:** Click "Copy Report" button to copy full diagnostic info
5. **Share With Developer:** Paste the error report to diagnose the issue

### Console Logging

All errors are also logged to browser console with format:
```
=== ADMIN PORTAL ERROR CAPTURED ===
Error ID: [unique-id]
Route: /admin/partner-portal/...
Language: en
Error: [Error object]
Error Stack: [full stack trace]
Component Stack: [component hierarchy]
===================================
```

Open browser DevTools (F12) → Console tab to see these logs.

## Expected Error Information

When an error occurs, you should receive:

**Minimum Information:**
- Error message (what went wrong)
- Route (which page crashed)
- Stack trace (where in code)

**Ideal Information:**
- All of the above PLUS:
- Component stack (which components were rendering)
- Filename and line number
- Error ID for tracking
- Language and user agent context

## Verification Steps

After deployment to northforce.io:

1. Visit: `https://northforce.io/admin-login`
2. Log in with admin credentials
3. Navigate to various admin portal pages
4. **If white screen occurs:** Error screen should appear instead
5. **Take screenshot** of the error screen
6. **Click "Copy Report"** and save the text
7. **Share error information** for diagnosis

## Technical Details

**Error Boundary Wrapping:**
- All `/admin/*` routes wrapped in `<AdminErrorBoundary>`
- Located in `App.tsx` at route definition level
- Catches errors during render, in lifecycle methods, and in constructors

**Global Error Handler Scope:**
- Only active within AdminLayout (admin routes)
- Does NOT affect public website pages
- Automatically cleaned up when leaving admin section

**Build Marker:**
- Every error report includes: `Build: 2025.01.15-1411`
- Confirms error came from this specific deployment
- Helps distinguish from previous versions

## Files Modified

1. `src/components/admin/AdminErrorBoundary.tsx`
   - Added comprehensive error state tracking
   - Enhanced error display with stack traces
   - Added copy-to-clipboard functionality
   - Improved console logging

2. `src/components/admin/AdminLayout.tsx`
   - Added window error event listeners
   - Added unhandled rejection listeners
   - Added global error state display
   - Imported AlertTriangle, RefreshCw, Home icons

## Next Steps

1. **Monitor Production:** Watch for error screens appearing at northforce.io
2. **Collect Error Reports:** When errors occur, copy and save reports
3. **Analyze Patterns:** Look for common:
   - Error messages
   - Routes that crash
   - Stack trace patterns
   - Component names
4. **Fix Root Causes:** Use diagnostic info to fix underlying issues

## Success Criteria

✅ No more white screens - all errors display information
✅ Full stack traces visible for diagnosis
✅ Copy-able error reports for sharing
✅ Console logging for developer debugging
✅ Build version marker in all reports
✅ Window-level error capture for non-React errors

## Contact

If white screens still occur WITHOUT error information appearing:
- Check browser console for any errors
- Try different browser (Chrome, Firefox, Safari)
- Verify you're on latest deployment (check network for new bundle hash)
- Contact development team with browser details

---

**Deployment Pipeline:** GitHub → Netlify Auto-Deploy → northforce.io
**Expected Deployment Time:** 2-5 minutes after push
**Verification URL:** https://northforce.io/admin-login
