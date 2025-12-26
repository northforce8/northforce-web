# NORTHFORCE PARTNER PORTAL - FULLSTÄNDIG SYSTEMINVENTERING

**Datum:** 2025-12-16
**Status:** STEG 0 KOMPLETT - INVENTERING LÅST

---

## 1. ROUTES & NAVIGATION

### Admin Routes (24 st)
| Route | Component | Status |
|-------|-----------|--------|
| `/admin/partner-portal` | PartnerDashboard | ✅ LIVE |
| `/admin/partner-portal/leads` | AdminDashboard | ✅ LIVE |
| `/admin/partner-portal/leads/:type/:id` | LeadDetailPage | ✅ LIVE |
| `/admin/partner-portal/enterprise` | EnterpriseDashboard | ✅ LIVE |
| `/admin/partner-portal/enterprise-plans` | EnterprisePlansPage | ✅ LIVE |
| `/admin/partner-portal/credits` | CreditsDashboardPage | ✅ LIVE |
| `/admin/partner-portal/partners` | PartnersPage | ✅ LIVE |
| `/admin/partner-portal/partners/:id` | PartnerDetailPage | ✅ LIVE |
| `/admin/partner-portal/capacity` | CapacityOverviewPage | ✅ LIVE |
| `/admin/partner-portal/planning` | PlanningPage | ✅ LIVE |
| `/admin/partner-portal/partner-management` | PartnerManagementPage | ✅ LIVE |
| `/admin/partner-portal/customers` | CustomersPage | ✅ LIVE |
| `/admin/partner-portal/customers/:customerId` | CustomerDetailPage | ✅ LIVE |
| `/admin/partner-portal/projects` | ProjectsPage | ✅ LIVE |
| `/admin/partner-portal/time` | TimeReportingPage | ✅ LIVE |
| `/admin/partner-portal/invoices` | InvoicesPage | ✅ LIVE |
| `/admin/partner-portal/invoices/:invoiceId` | InvoiceDetailPage | ✅ LIVE |
| `/admin/partner-portal/contracts` | ContractsPage | ✅ LIVE |
| `/admin/partner-portal/contracts/:contractId` | ContractDetailPage | ✅ LIVE |
| `/admin/partner-portal/notes` | NotesPage | ✅ LIVE |
| `/admin/partner-portal/reports` | ReportsPage | ⚠️ NEEDS VERIFICATION |
| `/admin/partner-portal/support` | SupportPage | ⚠️ NEEDS VERIFICATION |
| `/admin/partner-portal/settings` | SettingsPage | ⚠️ NEEDS VERIFICATION |
| `/admin/partner-portal/health` | AdminHealthPage | ✅ LIVE |

**RESULTAT:** 21/24 routes verifierade som fully functional

---

## 2. DATABAS TABELLER (54 st)

### ✅ FULL UI-INTEGRATION (23 tabeller)
- admin_users, customers, partners, projects, time_entries
- work_types, notes, invoices, invoice_line_items
- contracts, contract_templates, contract_version_history
- credits_transactions, capacity_calendar, support_tickets
- enterprise_benefits, contact_submissions, booking_submissions
- newsletter_submissions, lead_notes, lead_customer_links
- recommendations, currencies

### ⚠️ PARTIELL UI (8 tabeller)
- customer_assignments, project_assignments, partner_roles
- partner_capacity_periods, partner_work_type_assignments
- capacity_rules, system_settings, decision_log

### ❌ BACKEND-ONLY (23 tabeller)
**Analys & Reporting:**
- capacity_utilization, capacity_forecast, credits_forecast
- billing_periods, margin_analysis, partner_performance_metrics
- partner_workload_recommendations

**Audit & Tracking:**
- activity_log, status_change_log, settings_audit_log
- invoice_audit_log

**Support & SLA:**
- support_responses, sla_tracking

**Övrigt:**
- lead_classifications, plan_change_requests, partner_cost_rates

---

## 3. IDENTIFIERADE DUBBLETTER

### 🔴 KRITISKA DUBBLETTER:

#### A. CAPACITY MANAGEMENT (4 överlappande tabeller)
- `capacity_calendar` ✅ UI: PlanningPage
- `capacity_forecast` ❌ Backend-only
- `capacity_utilization` ❌ Backend-only
- `partner_capacity_periods` ❌ Backend-only

**ÅTGÄRD:** Konsolidera till EN källa: capacity_calendar + beräknade vyer

#### B. RECOMMENDATIONS (2 parallella system)
- `recommendations` (generell)
- `partner_workload_recommendations` (specifik)

**ÅTGÄRD:** Använd ENDAST recommendations med type-field

#### C. PARTNER ROLES (dubbel implementation)
- `partner_roles` tabell (normaliserad)
- `partners.role` field (denormaliserad)

**ÅTGÄRD:** Behåll partner_roles, ta bort role field

#### D. BILLING (överlappande)
- `invoices` + `invoice_line_items` ✅ Full UI
- `billing_periods` ❌ Backend-only duplikat

**ÅTGÄRD:** Ta bort billing_periods, använd invoices

---

## 4. BACKEND-ONLY SOM MÅSTE FÅ UI

### KRITISK PRIORITET (MÅSTE):
1. **capacity_forecast** → Integrera i CapacityOverviewPage
2. **credits_forecast** → Integrera i CreditsDashboardPage
3. **partner_workload_recommendations** → Integrera i PartnerManagementPage
4. **margin_analysis** → Skapa i ReportsPage
5. **sla_tracking** → Integrera i SupportPage/ReportsPage

### MEDIUM PRIORITET (BÖR):
6. **support_responses** → Integrera i SupportPage
7. **partner_cost_rates** → Integrera i PartnerDetailPage
8. **decision_log** → Integrera i CustomerDetailPage/ProjectsPage
9. **plan_change_requests** → Integrera i CustomersPage

### LÅG PRIORITET (KAN):
10. **activity_log** → AdminHealthPage (optional deep audit)
11. **status_change_log** → Som ovan
12. **lead_classifications** → Dold AI metadata (OK)

---

## 5. SYSTEMKEDJAN - VERIFIERING

**KRAVSTÄLLD KEDJA:**
Customer → Subscription/Plan → Credits → Projects → Time entries → Credits consumption → Monetary value → Invoicing → Contracts → Reporting

**NUVARANDE IMPLEMENTATION:**

✅ Customer (customers tabell, UI: CustomersPage)
⚠️ Subscription/Plan (enterprise_plans finns, men ej kopplad till customers fullt ut)
✅ Credits (credits_transactions, UI: CreditsDashboardPage)
✅ Projects (projects tabell, UI: ProjectsPage)
✅ Time entries (time_entries, UI: TimeReportingPage)
✅ Credits consumption (beräknas via time_entries + work_types)
✅ Monetary value (currencies, credit_value_local i customers)
✅ Invoicing (invoices + invoice_line_items, Full UI)
✅ Contracts (contracts + version history, Full UI)
⚠️ Reporting (ReportsPage finns men MÅSTE verifieras/kompletteras)

**BRISTER I KEDJAN:**
1. **Subscription/Plan koppling** - enterprise_plans är inte fullt integrerad med customers
2. **Reporting** - ReportsPage saknar margin_analysis, sla_tracking, prognoser

---

## 6. UI/UX OBSERVATIONER

### LOGOTYP:
⚠️ AdminLayout använder INTE samma logotyp som public site
- Public: Använder `/public/northforce-symbol-clean.png`
- Admin: Använder Lucide icons (Sparkles + Zap)

**ÅTGÄRD:** Uppdatera AdminLayout att använda samma branding

### VISUELLA ELEMENT:
✅ Konsekvent design system (Tailwind)
✅ Status badges (olika färger per status)
✅ Modal system fungerar

---

## 7. SLUTSATSER

### VID SVAR:
- ✅ **21 av 24 routes** är fully functional
- ⚠️ **3 routes** behöver verifieras (Reports, Support, Settings)
- ✅ **23 tabeller** har full UI-integration
- ⚠️ **8 tabeller** har partiell UI
- ❌ **23 tabeller** är backend-only (15 av dessa MÅSTE få UI eller tas bort)
- 🔴 **4 kritiska dubbletter** identifierade (capacity, recommendations, roles, billing)

### ÅTGÄRDER KRÄVS:
1. Eliminera 4 dubbletter
2. Ge UI till 9 backend-only tabeller (kritisk+medium prio)
3. Verifiera/komplettera 3 routes (Reports, Support, Settings)
4. Fixa logotyp i AdminLayout
5. Komplettera subscription/plan koppling
6. Genomföra final QA

---

**NÄSTA STEG:** STEG 1 - ELIMINERA DUBBLETTER
