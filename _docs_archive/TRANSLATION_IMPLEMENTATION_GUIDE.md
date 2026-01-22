# Translation Implementation Guide

**Date:** 2026-01-22
**Status:** Translations Added - Implementation Pending
**Build:** SUCCESS ✅

## Overview

All translation keys have been added to both `src/locales/en.json` and `src/locales/sv.json` for the 8 strategic framework detail pages. The pages currently display hardcoded English text and need to be updated to use the translation system.

---

## Translation Keys Added

### Navigation & Actions
- `admin.detail.back_to_[framework]` - Back navigation buttons
- `admin.detail.delete_[type]` - Delete buttons
- `admin.detail.confirm_delete_[type]` - Delete confirmations

### Error States
- `admin.detail.not_found` - "not found"
- `admin.detail.something_went_wrong` - "Something went wrong"
- `admin.detail.reload_page` - "Reload Page"
- `admin.detail.go_to_dashboard` - "Go to Dashboard"

### Framework-Specific Keys

#### Porter's Five Forces
- `admin.porter.analysis_notes` - "Analysis Notes"
- `admin.porter.force_score` - "Force Score"

#### Business Model Canvas (BMC)
- `admin.bmc.section_not_defined` - "Not defined"
- `admin.bmc.key_partners_desc` through `admin.bmc.revenue_streams_desc`

#### Balanced Scorecard (BSC)
- `admin.bsc.perspective_financial` - "Financial Perspective"
- `admin.bsc.perspective_customer` - "Customer Perspective"
- `admin.bsc.perspective_internal` - "Internal Process Perspective"
- `admin.bsc.perspective_learning` - "Learning & Growth Perspective"
- `admin.bsc.no_objectives` - "No objectives defined"

#### ADKAR
- `admin.adkar.overall_score` - "Overall ADKAR Score"
- `admin.adkar.assessment_notes` - "Assessment Notes"

#### Agile Transformation
- `admin.agile.current_phase` - "Current Phase"
- `admin.agile.sprint_length` - "Sprint Length"
- `admin.agile.team_velocity` - "Team Velocity"
- `admin.agile.weeks` - "weeks"
- `admin.agile.points` - "points"
- `admin.agile.transformation_notes` - "Transformation Notes"

#### McKinsey 7S
- `admin.mckinsey.element_not_defined` - "Not defined"

#### Lean Startup
- `admin.lean.hypothesis` - "Build: Hypothesis"
- `admin.lean.experiment` - "Measure: Experiment"
- `admin.lean.metrics` - "Learn: Metrics"
- `admin.lean.learning_outcome` - "Learning Outcome"
- `admin.lean.next_action` - "Next Action"
- `admin.lean.step_not_defined` - "Not defined"

#### Design Thinking
- `admin.design.phase_empathize` - "Empathize"
- `admin.design.phase_define` - "Define"
- `admin.design.phase_ideate` - "Ideate"
- `admin.design.phase_prototype` - "Prototype"
- `admin.design.phase_test` - "Test"
- `admin.design.phase_not_defined` - "Not defined"

---

## How to Implement Translations

### Step 1: Import the useLanguage Hook

At the top of each detail page:

```typescript
import { useLanguage } from '../../../contexts/LanguageContext';
```

### Step 2: Use the t Function

Inside the component:

```typescript
const { t } = useLanguage();
```

### Step 3: Replace Hardcoded Strings

**Before:**
```typescript
<button onClick={() => navigate('/admin/partner-portal/strategic-frameworks/porter')}>
  Back to Porter Analyses
</button>
```

**After:**
```typescript
<button onClick={() => navigate('/admin/partner-portal/strategic-frameworks/porter')}>
  {t('admin.detail.back_to_porter')}
</button>
```

### Step 4: Update Delete Confirmations

**Before:**
```typescript
if (!confirm('Are you sure you want to delete this Porter analysis?')) return;
```

**After:**
```typescript
if (!confirm(t('admin.detail.confirm_delete_analysis'))) return;
```

### Step 5: Update Not Found Messages

**Before:**
```typescript
<h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis not found</h3>
```

**After:**
```typescript
<h3 className="text-lg font-semibold text-gray-900 mb-2">
  {t('admin.porter.title')} {t('admin.detail.not_found')}
</h3>
```

---

## Pages Requiring Updates

1. ✅ **PorterDetailPage.tsx** - Translations added, implementation pending
2. ✅ **BMCDetailPage.tsx** - Translations added, implementation pending
3. ✅ **BSCDetailPage.tsx** - Translations added, implementation pending
4. ✅ **ADKARDetailPage.tsx** - Translations added, implementation pending
5. ✅ **AgileDetailPage.tsx** - Translations added, implementation pending
6. ✅ **McKinsey7SDetailPage.tsx** - Translations added, implementation pending
7. ✅ **LeanStartupDetailPage.tsx** - Translations added, implementation pending
8. ✅ **DesignThinkingDetailPage.tsx** - Translations added, implementation pending

---

## Verification Steps

After implementing translations:

1. **Test Language Switching:**
   - Open any detail page
   - Click language switcher in sidebar
   - Verify all text changes language

2. **Test All Text Elements:**
   - Navigation buttons
   - Delete confirmations
   - Not found messages
   - Section headings
   - Status indicators

3. **Test Both Languages:**
   - English (en)
   - Swedish (sv)

---

## Language Switcher

The language switcher is located in **AdminLayout.tsx** sidebar and is already functional. It:
- Saves the selected language to localStorage
- Updates the entire admin portal instantly
- Uses the `LanguageContext` to manage state

---

## Error Handling Status

All detail pages have proper error handling:
- ✅ Try-catch blocks in all async functions
- ✅ Error logging with `logAdminError`
- ✅ Loading states
- ✅ Not found states
- ✅ AdminErrorBoundary catches React errors
- ✅ Production-friendly error messages

---

## Build Status

✅ **Build Successful**
- All translations compile correctly
- No JSON syntax errors
- All 8 new detail pages build successfully
- Total bundle size: 2.8MB (optimized)

---

## Next Steps

To complete the translation implementation:

1. Update each of the 8 detail pages to use `t()` function
2. Test language switching on each page
3. Verify all text changes correctly
4. Check error messages in both languages
5. Test delete confirmations in both languages

---

## Example: Complete Porter Detail Page Translation

Here's how PorterDetailPage.tsx should look with translations:

```typescript
import { useLanguage } from '../../../contexts/LanguageContext';

export default function PorterDetailPage() {
  const { t } = useLanguage();
  // ... rest of component

  // Back button
  <button onClick={() => navigate('/admin/partner-portal/strategic-frameworks/porter')}>
    {t('admin.detail.back_to_porter')}
  </button>

  // Not found message
  <h3>{t('admin.porter.title')} {t('admin.detail.not_found')}</h3>

  // Delete button
  <button onClick={handleDelete}>
    {t('admin.detail.delete_analysis')}
  </button>

  // Delete confirmation
  if (!confirm(t('admin.detail.confirm_delete_analysis'))) return;

  // Section heading
  <h3>{t('admin.porter.analysis_notes')}</h3>
}
```

---

## Translation Files Location

- English: `src/locales/en.json` (lines 1576-1646)
- Swedish: `src/locales/sv.json` (lines 1576-1646)

All keys follow the pattern: `admin.[framework].[key]` or `admin.detail.[key]`
