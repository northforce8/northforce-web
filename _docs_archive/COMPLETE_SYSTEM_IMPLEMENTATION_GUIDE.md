# NorthForce Partner Portal - Complete Enterprise System Implementation Guide

**Version:** 3.0 FINAL
**Datum:** 2025-12-16
**Status:** PRODUCTION-READY MED FAKTURERINGS- OCH AVTALSSYSTEM

---

## ÖVERGRIPANDE PRINCIPER FÖR IMPLEMENTATION

### Kärnprinciper

1. **EN KÄLLA TILL SANNING (Single Source of Truth)**
   - Varje datapunkt existerar på ETT ställe i databasen
   - All annan data beräknas eller hämtas därifrån
   - Ingen duplicering av data mellan tabeller
   - Konsistens garanteras genom databastriggers och constraints

2. **SYNLIGHET OCH TRANSPARENS**
   - Allt som existerar i backend MÅSTE vara synligt i UI
   - Inga "dolda" funktioner eller data
   - Varje handling ger direkt feedback (success/error/loading)
   - Användaren ska alltid veta systemets tillstånd

3. **FUNKTIONALITET FÖRE FORM**
   - Fokus på att systemet FUNGERAR korrekt
   - UI/UX designas för effektivitet och tydlighet
   - Inga dekorativa element som inte tillför värde
   - Varje knapp, varje fält, varje vy har en tydlig affärsnytta

4. **KOMMERSIELL MODENHET**
   - Systemet designas för betalande kunder från dag 1
   - Professionell presentation av fakturor och avtal
   - Tydlig rapportering av kostnader och marginaler
   - Export och integration-ready

5. **INGEN DUPLICERING, INGA KONFLIKTER**
   - Kontrollera att funktionalitet inte redan finns innan du skapar den
   - En route → en komponent → en funktion
   - Använd befintliga komponenter och utilities
   - Refaktorera före duplicering

---

## DE FEM STEGEN - DETALJERAD IMPLEMENTATION

### STEG 1: AFFÄRSKEDJAN (Customer → Projects → Time → Credits → Cost)

#### 1.1 Dataflöde och Struktur

```
KUND (Customer)
  ↓
PROJEKT (Projects)
  ↓
TID (Time Entries)
  ↓
CREDITS FÖRBRUKNING (Automatic Calculation)
  ↓
KOSTNAD & MARGINAL (Internal Tracking)
  ↓
STATUS & RISK (Real-time Indicators)
  ↓
FAKTURERING (Invoice Generation)
```

#### 1.2 Databas Schema Integration

**customers table** - Källa för:
- Företagsinformation
- Credits allocation (monthly_credits_allocation)
- Credits balance (credits_balance)
- Pricing (credits_price_per_credit, monthly_recurring_revenue)
- Status dimensions (delivery_status, strategic_status, commercial_status, collaboration_status, impact_status)
- Risk indicators (overdelivery_risk_level)

**projects table** - Länkar:
- Alltid kopplad till EN customer (customer_id NOT NULL)
- Status (planning, active, on_hold, completed, cancelled)
- Expected credits per period
- Actual credits consumed (beräknas från time_entries)

**time_entries table** - Källdata för allt:
- Faktisk rapporterad tid (hours)
- Work type (work_type_id) som avgör credits-vikt
- Koppling till project OCH customer
- Partner som utförde arbetet

**Automatisk Credits Beräkning:**
```sql
credits_consumed = SUM(time_entries.hours × work_types.credits_per_hour)
WHERE time_entries.project_id = project.id
```

**Automatisk Kostnadsberäkning:**
```sql
internal_cost = SUM(time_entries.hours × partners.hourly_cost)
WHERE time_entries.partner_id = partner.id
```

**Marginalberäkning:**
```sql
revenue = credits_consumed × customer.credits_price_per_credit
cost = internal_cost
margin = revenue - cost
margin_percentage = (margin / revenue) × 100
```

#### 1.3 UI Implementation

**Customer Detail View (/admin/partner-portal/customers/:id)**

Visning:
- Header: Företagsnamn, org.nr, status badges
- KPI Cards (4 st):
  - Credits Remaining (progress bar med färgkodning)
  - Burn Rate (daily/weekly projection)
  - Margin This Month (percentage + SEK)
  - Risk Level (critical/high/medium/low)

- Tabs:
  1. **Overview** - Översikt med alla KPIs
  2. **Projects** - Lista aktiva projekt med Add Project knapp
  3. **Time Entries** - Alla tidrapporter för denna kund
  4. **Credits History** - Transaktionshistorik
  5. **Invoices** - Alla fakturor (NYT!)
  6. **Contracts** - Alla avtal (NYT!)

Funktioner:
- **Manage Credits Button**: Öppnar modal där man kan:
  - Justera monthly_allocation
  - Lägga till/dra credits från balance
  - Ändra price_per_credit
  - Uppdatera MRR

- **Add Project Button**: Öppnar modal med formulär:
  - Project name *required
  - Description
  - Workstream
  - Expected credits/period
  - Start/end date
  - Status (default: planning)
  - Priority (default: medium)
  - Auto-assigns customer_id

- **Inline Edit**: Alla fält editerbara:
  - Click på field → blir input
  - Save/Cancel knappar
  - Validering
  - Success/error feedback

#### 1.4 Validerings regler

**Skapa Projekt:**
- customer_id MÅSTE finnas
- name MÅSTE vara ifyllt
- start_date om ifylld måste vara > today eller tillåt backdate med warning

**Rapportera Tid:**
- project_id MÅSTE finnas
- customer_id automatiskt från project
- work_type_id MÅSTE finnas
- hours > 0 och < 24 per entry
- date får inte vara längre än 90 dagar tillbaka (konfigurerbart)

**Justera Credits:**
- Negativ adjustment kan inte göra balance < 0 (eller tillåt med critical warning)
- Price per credit > 0
- Monthly allocation > 0

---

### STEG 2: WORK TYPES OCH VIKTNING

#### 2.1 Work Type System

**work_types table** - Konfigurerad i database med:

| ID | Name | Credits/Hour | Category | Plan Levels | Active |
|----|------|--------------|----------|-------------|--------|
| 1 | Leadership | 1.50 | strategic | All | true |
| 2 | Strategy | 1.50 | strategic | All | true |
| 3 | AI | 1.50 | technical | All | true |
| 4 | Architecture | 1.30 | technical | All | true |
| 5 | Automation | 1.30 | technical | All | true |
| 6 | Analytics | 1.00 | operational | All | true |
| 7 | Content | 1.00 | operational | All | true |
| 8 | SEO | 1.00 | operational | All | true |
| 9 | Development | 1.00 | technical | All | true |
| 10 | Operations | 1.00 | operational | All | true |
| 11 | Sales | 0.70 | admin | All | true |
| 12 | Coordination | 0.50 | admin | All | true |

#### 2.2 Synlighet i UI

**Time Reporting Page:**
- Dropdown med work types
- Visar namn + credits per hour
- Exempel: "Leadership (1.5x credits)"
- Beräkning visas INNAN submit: "2 timmar × 1.5 = 3.0 credits"

**Customer Detail - Time Entries Tab:**
- Tabell med kolumner:
  - Date
  - Partner
  - Project
  - Work Type
  - Hours
  - Credits (calculated)
  - Internal Cost (if admin)

**Work Types Management Page (Admin):**
- Lista alla work types
- Edit inline: namn, vikt, kategori, allowed plans
- Add new work type
- Deactivate (inte delete - historisk data)

#### 2.3 Plan-Based Access Control

**enterprise_plans table** definierar:
- starter: Begränsade work types (bara operational + coordination)
- growth: Alla operational + några technical
- scale: Alla utom highest strategic
- custom: Alla work types tillgängliga

**Enforcement i UI:**
- Time reporting dropdown filtrerar work types baserat på kundens plan
- När en kund når sin credits-limit → varning + förslag på upgrade
- Admin kan override men får warning

---

### STEG 3: PRISNIVÅER OCH KAPACITET

#### 3.1 Enterprise Plans

**Definierade Nivåer:**

**1. STARTER**
- 50 credits/månad
- Max 1 aktiv partner
- Max 2 parallella projekt
- Work types: Operations, Coordination, Content, SEO
- Pris: 50,000 SEK/månad (1,000 SEK/credit)
- Support: Email, 48h response
- Ingen SLA

**2. GROWTH**
- 150 credits/månad
- Max 2 aktiva partners
- Max 5 parallella projekt
- Work types: + Development, Analytics, Sales
- Pris: 135,000 SEK/månad (900 SEK/credit)
- Support: Email + Slack, 24h response
- Basic SLA

**3. SCALE**
- 400 credits/månad
- Max 4 aktiva partners
- Max 10 parallella projekt
- Work types: + Automation, Architecture
- Pris: 320,000 SEK/månad (800 SEK/credit)
- Support: Priority support, 12h response
- Standard SLA

**4. ENTERPRISE (Custom Add-On)**
- 800-1200+ credits eller custom
- Unlimited partners och projekt
- Alla work types inkl. Leadership, Strategy, AI
- Pris: Custom pricing, volume discounts
- Support: Dedicated success manager, 4h critical response
- Premium SLA med penalties

#### 3.2 Capacity Rules Implementation

**capacity_rules table** - Definierar begränsningar:

```sql
CREATE TABLE capacity_rules (
  id uuid PRIMARY KEY,
  rule_type text, -- 'max_partners', 'max_projects', 'work_type_access', etc.
  plan_level text, -- 'starter', 'growth', 'scale', 'custom'
  limit_value integer,
  applies_to text,
  is_active boolean
);
```

**Enforcement:**

Frontend:
- När användare försöker skapa nytt projekt → check mot capacity_rules
- Om limit nådd → Visa upgrade modal med nästa plan level
- Work type dropdown filtreras automatiskt

Backend:
- API validerar mot rules innan create/update
- Returns clear error: "You've reached the maximum of 2 projects for Starter plan. Upgrade to Growth for up to 5 projects."

#### 3.3 UI Indikation

**Customer Card i Lista:**
```
┌─────────────────────────────┐
│ Acme Corp          [GROWTH] │
│ 127/150 credits (85%)       │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░ 85%        │
│ 3/5 projects active         │
│ 2/2 partners assigned       │
└─────────────────────────────┘
```

**Customer Detail Header:**
```
Current Plan: GROWTH
- 150 credits/month @ 900 SEK/credit
- 2/2 active partners (AT LIMIT)
- 3/5 active projects
- 8/10 work types available

[Upgrade to SCALE] button
```

**Plan Comparison Modal:**
- Triggered när user når limit
- Visar current vs next plan
- Highlights nya features
- CTA: "Upgrade Now" eller "Contact Sales"

---

### STEG 4: BUSINESS INTELLIGENCE OCH REGELMOTOR

#### 4.1 Intelligensramverk

Systemet använder **regelbaserad intelligens**, INTE generativ AI för beslutsstöd.

**Varför?**
- Förutsägbart och kontrollerbart
- Transparent - användaren förstår VARFÖR en rekommendation ges
- Snabbt - ingen API latency
- Kostnadsfritt - ingen OpenAI kostnad
- Deterministiskt - samma input = samma output

#### 4.2 Regelkategorier

**A. CREDITS MANAGEMENT RULES**

```typescript
RULE: Low Credits Warning
WHEN: customer.credits_balance < (customer.credits_monthly_allocation * 0.20)
THEN:
  - Alert Type: WARNING
  - Title: "Low Credits - {customer_name}"
  - Description: "{balance} credits remaining ({percentage}%). Consider refilling."
  - Action: "Manage Credits" → /customers/{id}
  - Priority: MEDIUM
```

```typescript
RULE: Critical Credits Depletion
WHEN: customer.credits_balance < 10 AND credits_balance < (monthly_allocation * 0.10)
THEN:
  - Alert Type: CRITICAL
  - Title: "Critical: {customer_name} - Credits Depleted"
  - Description: "Only {balance} credits remaining. Immediate action required."
  - Action: "Add Credits Now" → /customers/{id}
  - Priority: CRITICAL
```

```typescript
RULE: Credits Surplus
WHEN: end_of_month AND credits_balance > (monthly_allocation * 0.50)
THEN:
  - Alert Type: INFO
  - Title: "{customer_name} - Underutilized Credits"
  - Description: "{balance} credits unused this month. Review scope or adjust allocation."
  - Action: "Review Projects" → /customers/{id}
  - Priority: LOW
```

**B. OVERDELIVERY RISK RULES**

```typescript
RULE: High Burn Rate
WHEN:
  current_burn_rate = credits_consumed_this_week / days_elapsed * 30
  projected_monthly = current_burn_rate
  projected_monthly > (monthly_allocation * 1.10)
THEN:
  - Set customer.overdelivery_risk_level = 'high'
  - Alert Type: WARNING
  - Title: "{customer_name} - High Overdelivery Risk"
  - Description: "Burn rate exceeds allocation by {percentage}%. Scope review recommended."
  - Action: "Review Scope" → /customers/{id}
  - Priority: HIGH
```

```typescript
RULE: Critical Overdelivery
WHEN:
  credits_consumed_this_month > (monthly_allocation * 1.25)
THEN:
  - Set customer.overdelivery_risk_level = 'critical'
  - Alert Type: CRITICAL
  - Title: "{customer_name} - Critical Overdelivery"
  - Description: "Consumed {consumed} of {allocation} credits ({percentage}% over). Stop work and reassess."
  - Action: "Immediate Action" → /customers/{id}
  - Priority: CRITICAL
```

**C. COLLABORATION STATUS RULES**

```typescript
RULE: Blocked Collaboration
WHEN: customer.collaboration_status = 'blockerad'
THEN:
  - Alert Type: CRITICAL
  - Title: "{customer_name} - Project Blocked"
  - Description: "Collaboration blocked. Unblock required to continue delivery."
  - Action: "Resolve Block" → /customers/{id}
  - Priority: CRITICAL
```

```typescript
RULE: Decision Required
WHEN: customer.collaboration_status = 'kraver_beslut'
THEN:
  - Alert Type: WARNING
  - Title: "{customer_name} - Decision Pending"
  - Description: "Customer decision required. Follow up to avoid delays."
  - Action: "Follow Up" → /customers/{id}
  - Priority: MEDIUM
```

**D. MARGIN RULES**

```typescript
RULE: Low Margin Warning
WHEN:
  margin_percentage = ((revenue - cost) / revenue) * 100
  margin_percentage < 20
THEN:
  - Alert Type: WARNING
  - Title: "{customer_name} - Low Margin"
  - Description: "Margin at {margin}%. Review cost structure or pricing."
  - Action: "Analyze Costs" → /customers/{id}
  - Priority: MEDIUM
```

```typescript
RULE: Negative Margin Critical
WHEN: margin_percentage < 0
THEN:
  - Alert Type: CRITICAL
  - Title: "{customer_name} - Negative Margin"
  - Description: "Operating at a loss. Immediate cost/price adjustment needed."
  - Action: "Urgent Review" → /customers/{id}
  - Priority: CRITICAL
```

**E. PROJECT HEALTH RULES**

```typescript
RULE: Stalled Project
WHEN:
  project.status = 'active'
  days_since_last_time_entry > 14
THEN:
  - Alert Type: WARNING
  - Title: "{project_name} appears stalled"
  - Description: "No time reported in {days} days. Check project status."
  - Action: "Review Project" → /projects/{id}
  - Priority: MEDIUM
```

```typescript
RULE: Overbudget Project
WHEN:
  project.actual_credits > project.expected_credits_per_period * 1.20
THEN:
  - Alert Type: WARNING
  - Title: "{project_name} overbudget"
  - Description: "Used {actual} of {expected} credits. Scope review needed."
  - Action: "Review Scope" → /projects/{id}
  - Priority: HIGH
```

**F. INVOICE RULES**

```typescript
RULE: Overdue Invoice
WHEN:
  invoice.status = 'sent'
  invoice.due_date < today
THEN:
  - Set invoice.status = 'overdue'
  - Alert Type: WARNING
  - Title: "Invoice {invoice_number} overdue"
  - Description: "{customer_name} - {amount} SEK overdue by {days} days."
  - Action: "Follow Up" → /invoices/{id}
  - Priority: HIGH
```

```typescript
RULE: Ready for Monthly Invoice
WHEN:
  day_of_month = 1
  customer.has_uninvoiced_time_entries = true
THEN:
  - Alert Type: INFO
  - Title: "Generate invoice for {customer_name}"
  - Description: "{hours} hours ready to invoice for previous month."
  - Action: "Create Invoice" → /invoices/new?customer={id}
  - Priority: MEDIUM
```

#### 4.3 Implementation i Kod

**recommendations table** - Lagrar genererade recommendations:

```typescript
interface Recommendation {
  id: string;
  customer_id?: string;
  project_id?: string;
  recommendation_type: 'credits_low' | 'overdelivery_risk' | 'margin_warning' | 'stalled_project' | 'invoice_due';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action_url?: string;
  action_label?: string;
  status: 'active' | 'dismissed' | 'resolved';
  created_at: timestamp;
  resolved_at?: timestamp;
  ai_score?: number; // 0-100, för framtida ML integration
}
```

**Rule Engine (TypeScript):**

```typescript
// src/lib/business-rules-engine.ts

class BusinessRulesEngine {
  async evaluateAll(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const customers = await partnerPortalApi.customers.getAll();
    const projects = await partnerPortalApi.projects.getAll();
    const invoices = await partnerPortalApi.invoices.getAll();

    // Evaluate all rules
    for (const customer of customers) {
      recommendations.push(...this.evaluateCustomerRules(customer));
    }

    for (const project of projects) {
      recommendations.push(...this.evaluateProjectRules(project));
    }

    for (const invoice of invoices) {
      recommendations.push(...this.evaluateInvoiceRules(invoice));
    }

    // Save to database
    await this.saveRecommendations(recommendations);

    return recommendations;
  }

  private evaluateCustomerRules(customer: Customer): Recommendation[] {
    const recs: Recommendation[] = [];

    // Rule: Low Credits
    const creditsPercentage = (customer.credits_balance / customer.credits_monthly_allocation) * 100;
    if (creditsPercentage < 10 && customer.credits_balance < 10) {
      recs.push({
        customer_id: customer.id,
        recommendation_type: 'credits_low',
        priority: 'critical',
        title: `Critical: ${customer.company_name} - Credits Depleted`,
        description: `Only ${customer.credits_balance.toFixed(1)} credits remaining (${creditsPercentage.toFixed(0)}%). Immediate action required.`,
        action_url: `/admin/partner-portal/customers/${customer.id}`,
        action_label: 'Add Credits Now',
        status: 'active',
      });
    } else if (creditsPercentage < 20) {
      recs.push({
        customer_id: customer.id,
        recommendation_type: 'credits_low',
        priority: 'medium',
        title: `${customer.company_name} - Low Credits`,
        description: `${customer.credits_balance.toFixed(1)} credits remaining (${creditsPercentage.toFixed(0)}%). Consider refilling.`,
        action_url: `/admin/partner-portal/customers/${customer.id}`,
        action_label: 'Manage Credits',
        status: 'active',
      });
    }

    // Rule: Overdelivery Risk
    if (customer.overdelivery_risk_level === 'critical' || customer.overdelivery_risk_level === 'high') {
      recs.push({
        customer_id: customer.id,
        recommendation_type: 'overdelivery_risk',
        priority: customer.overdelivery_risk_level === 'critical' ? 'critical' : 'high',
        title: `${customer.company_name} - ${customer.overdelivery_risk_level === 'critical' ? 'Critical ' : ''}Overdelivery Risk`,
        description: `Burn rate exceeds allocation. Scope review ${customer.overdelivery_risk_level === 'critical' ? 'urgently ' : ''}needed.`,
        action_url: `/admin/partner-portal/customers/${customer.id}`,
        action_label: 'Review Scope',
        status: 'active',
      });
    }

    // Rule: Blocked
    if (customer.collaboration_status === 'blockerad') {
      recs.push({
        customer_id: customer.id,
        recommendation_type: 'project_blocked',
        priority: 'critical',
        title: `${customer.company_name} - Project Blocked`,
        description: `Collaboration blocked. Unblock required to continue.`,
        action_url: `/admin/partner-portal/customers/${customer.id}`,
        action_label: 'Resolve Block',
        status: 'active',
      });
    }

    return recs;
  }

  // Similar methods for projects and invoices...
}
```

**Dashboard Integration:**

```typescript
// src/pages/admin/partner-portal/PartnerDashboard.tsx

const [alerts, setAlerts] = useState<Recommendation[]>([]);

useEffect(() => {
  const loadAlerts = async () => {
    const recommendations = await partnerPortalApi.recommendations.getAll({
      status: 'active',
      limit: 5,
      orderBy: 'priority'
    });
    setAlerts(recommendations);
  };
  loadAlerts();
}, []);

// Display alerts section
{alerts.length > 0 && (
  <div className="mb-8">
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary-600" />
          Business Intelligence & Alerts
        </h2>
        <p className="text-sm text-gray-600 mt-1">Rule-based recommendations requiring attention</p>
      </div>
      <div className="p-6 space-y-3">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
        ))}
      </div>
    </div>
  </div>
)}
```

#### 4.4 Scheduled Rule Execution

**Supabase Edge Function** - Körs varje timme:

```typescript
// supabase/functions/evaluate-business-rules/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Fetch all customers with active data
  const { data: customers } = await supabase
    .from('customers')
    .select('*, projects(*), time_entries(*)')
    .eq('is_active', true);

  const recommendations = [];

  for (const customer of customers || []) {
    // Evaluate rules
    const creditsPercentage = (customer.credits_balance / customer.credits_monthly_allocation) * 100;

    if (creditsPercentage < 10) {
      recommendations.push({
        customer_id: customer.id,
        recommendation_type: 'credits_low',
        priority: 'critical',
        title: `Critical: ${customer.company_name} - Credits Depleted`,
        description: `Only ${customer.credits_balance} credits remaining.`,
        action_url: `/admin/partner-portal/customers/${customer.id}`,
        status: 'active',
      });
    }

    // ... more rules
  }

  // Insert new recommendations
  if (recommendations.length > 0) {
    await supabase.from('recommendations').insert(recommendations);
  }

  return new Response(JSON.stringify({
    evaluated: customers?.length || 0,
    recommendations: recommendations.length
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Cron Setup** (in Supabase dashboard):
- Function: evaluate-business-rules
- Schedule: 0 * * * * (every hour)

---

### STEG 5: FAKTURERING OCH AVTAL

#### 5.1 Faktureringssystem

**Automatisk Månadsfakturering**

Process:
1. Dag 1 varje månad → system identifierar kunder med unfactured time entries
2. Skapar draft invoice med invoice_number (auto-generated: INV25XXXX)
3. Lägger till line items från time entries:
   - Gruppering per project/work type
   - Description: "{Project Name} - {Work Type} ({Period})"
   - Quantity: Total hours
   - Unit Price: Credits-baserat pris
   - Amount: Quantity × Unit Price
4. Beräknar totals automatically (via trigger):
   - Subtotal = SUM(line_items.amount)
   - Tax = Subtotal × 0.25 (25% moms)
   - Total = Subtotal + Tax
5. Status: draft → admin kan review
6. Admin godkänner → status: sent + PDF generates
7. Payment tracking → status: paid

**Invoice Data Model:**

```typescript
interface Invoice {
  id: string;
  invoice_number: string; // Auto: INV250001
  customer_id: string;
  invoice_date: Date;
  due_date: Date; // Typically +30 days
  period_start: Date;
  period_end: Date;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_rate: number; // 25.00
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  currency: 'SEK';
  payment_date?: Date;
  payment_method?: string;
  notes?: string;
  terms: string; // "Payment due within 30 days."
  pdf_url?: string;
}

interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  line_number: number;
  description: string; // "Website Rebuild - Development (Nov 2025)"
  quantity: number; // 24.5 hours
  unit_price: number; // 900 SEK (price per credit × work type weight)
  unit: 'hours';
  amount: number; // quantity × unit_price
  time_entry_id?: string;
  project_id?: string;
  work_type_id?: string;
}
```

**UI Implementation:**

**Invoices List Page** (/admin/partner-portal/invoices)

```typescript
// Table columns
- Invoice Number (clickable)
- Customer
- Date
- Due Date
- Amount
- Status Badge (color-coded)
- Actions (View, Download PDF, Mark Paid, Cancel)

// Filters
- Status dropdown
- Customer search
- Date range
- Amount range

// Actions
- [Create Invoice] button → manual invoice creation
- [Generate Monthly Invoices] button → batch create from time entries
```

**Invoice Detail/Edit Page** (/admin/partner-portal/invoices/:id)

Layout:
```
┌─────────────────────────────────────────────────────┐
│ INVOICE INV250042                     [Draft]       │
│ Customer: Acme Corp                                 │
│ Date: 2025-12-01    Due: 2025-12-31                │
│                                                      │
│ [Edit Details] [Add Line Item] [Send] [Download]   │
└─────────────────────────────────────────────────────┘

LINE ITEMS:
┌────────────────────────────────────────────────────┐
│ # | Description | Qty | Price | Amount | Actions  │
│ 1 | Website - Development | 24.5h | 900 | 22,050 │✏️❌│
│ 2 | SEO Optimization | 12h | 900 | 10,800 │✏️❌│
│ 3 | Content Creation | 8h | 900 | 7,200 │✏️❌│
└────────────────────────────────────────────────────┘
                                    Subtotal: 40,050 SEK
                                    Moms 25%: 10,012 SEK
                                    ─────────────────────
                                    TOTAL:    50,062 SEK

PAYMENT INFORMATION:
□ Mark as Paid
  Date: [Date Picker]
  Method: [Bank Transfer ▼]
  Reference: [_____________]

NOTES:
[Text area for additional notes]

AUDIT LOG:
- 2025-12-01 10:23: Created by Johan
- 2025-12-01 15:45: Status changed draft → sent
```

**PDF Generation:**

```typescript
// Use jsPDF or similar library
import { jsPDF } from 'jspdf';

function generateInvoicePDF(invoice: Invoice, lineItems: InvoiceLineItem[], customer: Customer) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('FAKTURA', 20, 20);
  doc.setFontSize(12);
  doc.text(`Nr: ${invoice.invoice_number}`, 20, 30);
  doc.text(`Datum: ${formatDate(invoice.invoice_date)}`, 20, 36);
  doc.text(`Förfallodatum: ${formatDate(invoice.due_date)}`, 20, 42);

  // Sender
  doc.setFontSize(10);
  doc.text('NorthForce AB', 20, 60);
  doc.text('Organisationsnummer: 559408-4707', 20, 66);
  doc.text('info@northforce.io', 20, 72);

  // Recipient
  doc.text(customer.company_name, 120, 60);
  doc.text(`Org.nr: ${customer.org_number}`, 120, 66);
  doc.text(customer.contact_email, 120, 72);

  // Line items table
  let y = 100;
  doc.text('Beskrivning', 20, y);
  doc.text('Antal', 100, y);
  doc.text('Pris', 130, y);
  doc.text('Belopp', 160, y);

  y += 6;
  lineItems.forEach(item => {
    doc.text(item.description, 20, y);
    doc.text(item.quantity.toString(), 100, y);
    doc.text(formatCurrency(item.unit_price), 130, y);
    doc.text(formatCurrency(item.amount), 160, y);
    y += 6;
  });

  // Totals
  y += 10;
  doc.text('Delsumma:', 130, y);
  doc.text(formatCurrency(invoice.subtotal), 160, y);
  y += 6;
  doc.text('Moms 25%:', 130, y);
  doc.text(formatCurrency(invoice.tax_amount), 160, y);
  y += 6;
  doc.setFontSize(12);
  doc.text('TOTALT:', 130, y);
  doc.text(formatCurrency(invoice.total_amount), 160, y);

  // Terms
  y += 20;
  doc.setFontSize(10);
  doc.text(invoice.terms, 20, y);

  // Bank details
  y += 10;
  doc.text('Bankgiro: 123-4567', 20, y);
  y += 6;
  doc.text('Swish: 123 456 78 90', 20, y);

  return doc.output('blob');
}
```

Upload PDF to Supabase Storage:
```typescript
const pdfBlob = generateInvoicePDF(invoice, lineItems, customer);
const fileName = `invoices/${invoice.invoice_number}.pdf`;

const { data, error } = await supabase.storage
  .from('documents')
  .upload(fileName, pdfBlob, {
    contentType: 'application/pdf',
    upsert: true
  });

if (!error) {
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  await supabase
    .from('invoices')
    .update({ pdf_url: publicUrl, pdf_generated: true, pdf_generated_at: new Date() })
    .eq('id', invoice.id);
}
```

#### 5.2 Avtalssystem (Contracts)

**Contract Templates**

Systemet kommer med färdiga mallar:
1. **Master Service Agreement (MSA)** - Ramavtal
2. **Statement of Work (SOW)** - Projektspecifik
3. **Non-Disclosure Agreement (NDA)** - Sekretess
4. **Amendment** - Tillägg till befintligt avtal

**Variables System:**

Template innehåller placeholders:
```
{{customer_name}}
{{customer_org_number}}
{{monthly_credits}}
{{price_per_credit}}
{{monthly_mrr}}
{{start_date}}
{{northforce_signatory_name}}
{{customer_signatory_name}}
```

Vid generering → hämta data från customer + fyll i:
```typescript
function populateContractTemplate(template: ContractTemplate, customer: Customer, variables: Record<string, any>) {
  let content = template.content;

  // Auto-fill from customer
  content = content.replace('{{customer_name}}', customer.company_name);
  content = content.replace('{{customer_org_number}}', customer.org_number || '');
  content = content.replace('{{monthly_credits}}', customer.credits_monthly_allocation.toString());
  content = content.replace('{{price_per_credit}}', customer.credits_price_per_credit.toString());
  content = content.replace('{{monthly_mrr}}', customer.monthly_recurring_revenue.toString());

  // Manual variables
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(`{{${key}}}`, value);
  });

  return content;
}
```

**Contract UI:**

**Contracts List** (/admin/partner-portal/contracts)
- Filter by: Customer, Status, Type
- Table: Number, Customer, Title, Type, Status, Start Date, Actions
- [Create Contract] button

**Create Contract Page** (/admin/partner-portal/contracts/new)

Steps:
1. **Select Template**
   - Radio buttons för MSA, SOW, NDA, etc.
   - Preview template

2. **Select Customer**
   - Dropdown (required)
   - Auto-fills customer data

3. **Fill Variables**
   - Form fields för alla {{variables}}
   - Pre-filled where possible from customer data
   - Date pickers för start_date, end_date

4. **Review Content**
   - Preview full contract med ifyllda värden
   - Edit button → open in rich text editor

5. **Add Signatories**
   - NorthForce signatory (dropdown av admins)
   - Customer signatory (name + title)

6. **Create**
   - Status: draft
   - contract_number auto-generated: CON250001

**Contract Detail Page** (/admin/partner-portal/contracts/:id)

```
┌─────────────────────────────────────────┐
│ CONTRACT CON250012        [Signed] ✓    │
│ Customer: Acme Corp                     │
│ Type: Master Service Agreement          │
│ Start: 2025-01-01  End: 2026-01-01     │
│                                         │
│ [Edit] [Send for Signature] [Download] │
└─────────────────────────────────────────┘

CONTENT:
[Full contract text displayed, read-only when signed]

SIGNATURES:
✓ NorthForce AB
  Signed by: Johan Andersson, CEO
  Date: 2025-01-15

✓ Acme Corp
  Signed by: Jane Smith, CFO
  Date: 2025-01-17

VERSION HISTORY:
- v1.0: Created 2025-01-10
- v1.1: Amended pricing 2025-03-15 (see CON250045)

LINKED DOCUMENTS:
- Invoice INV250023
- Invoice INV250067
- Amendment CON250045
```

**Digital Signature Flow:**

1. Admin marks contract as "sent"
2. Email sent to customer contact with unique signing link
3. Customer views contract online
4. Customer types name + clicks "Sign"
5. System records:
   - customer_signed = true
   - customer_signature_date = now()
   - customer_signatory_name
6. Status → "signed"
7. PDF regenerated with signature block
8. Both parties notified

**Auto-Renewal:**

```typescript
// Scheduled function runs daily
async function checkContractRenewals() {
  const expiringContracts = await supabase
    .from('contracts')
    .select('*')
    .eq('status', 'active')
    .eq('auto_renew', true)
    .lte('end_date', addDays(new Date(), 30)); // 30 days before expiry

  for (const contract of expiringContracts) {
    // Create renewal recommendation
    await createRecommendation({
      type: 'contract_renewal',
      priority: 'high',
      title: `Contract ${contract.contract_number} expiring soon`,
      description: `MSA with ${contract.customer.company_name} expires ${contract.end_date}. Renew or renegotiate.`,
      action_url: `/admin/partner-portal/contracts/${contract.id}`,
    });

    // If auto_renew enabled and within renewal window
    if (contract.auto_renew && daysUntilExpiry <= contract.renewal_notice_days) {
      // Auto-create renewal contract
      const renewalContract = {
        ...contract,
        id: undefined,
        contract_number: undefined, // Will auto-generate
        parent_contract_id: contract.id,
        start_date: contract.end_date,
        end_date: addYears(contract.end_date, 1),
        status: 'draft',
        version: 1,
        customer_signed: false,
        northforce_signed: false,
      };

      const { data: newContract } = await supabase
        .from('contracts')
        .insert(renewalContract)
        .select()
        .single();

      // Link original to renewal
      await supabase
        .from('contracts')
        .update({ renewed_by_contract_id: newContract.id })
        .eq('id', contract.id);
    }
  }
}
```

---

## IMPLEMENTATION CHECKLIST

När detta implementeras, följ denna ordning:

### ☑ Fas 1: Databas och Backend (KLAR)
- [x] Contract templates table
- [x] Contracts table
- [x] Invoices table
- [x] Invoice line items table
- [x] Invoice audit log table
- [x] Auto-generate functions (invoice_number, contract_number)
- [x] Auto-calculate totals trigger
- [x] RLS policies
- [x] Default MSA template

### ☐ Fas 2: API Layer
- [ ] Extend partner-portal-api.ts med:
  - invoices.getAll(), getById(), create(), update(), delete()
  - invoices.generateFromTimeEntries(customerId, periodStart, periodEnd)
  - invoices.markAsPaid(id, paymentInfo)
  - invoices.generatePDF(id)
  - contracts.getAll(), getById(), create(), update(), delete()
  - contracts.generateFromTemplate(templateId, customerId, variables)
  - contracts.send(id, recipientEmail)
  - contracts.sign(id, signatory, type: 'customer' | 'northforce')

### ☐ Fas 3: UI Components
- [ ] Create InvoicesList page
- [ ] Create InvoiceDetail page
- [ ] Create InvoiceForm component (create/edit)
- [ ] Create InvoiceLineItemsTable component
- [ ] Create ContractsList page
- [ ] Create ContractDetail page
- [ ] Create ContractForm component
- [ ] Create ContractTemplateSelector component
- [ ] Add navigation items för Invoices och Contracts
- [ ] Update CustomerDetailPage med Invoices och Contracts tabs

### ☐ Fas 4: PDF Generation
- [ ] Install jsPDF eller liknande
- [ ] Create invoice PDF template function
- [ ] Create contract PDF template function
- [ ] Implement Supabase Storage upload
- [ ] Email integration för sending PDFs

### ☐ Fas 5: Business Rules Engine
- [ ] Implement BusinessRulesEngine class
- [ ] Create evaluateCustomerRules()
- [ ] Create evaluateProjectRules()
- [ ] Create evaluateInvoiceRules()
- [ ] Create Supabase Edge Function för scheduled evaluation
- [ ] Setup cron job (hourly)
- [ ] Display recommendations in Dashboard

### ☐ Fas 6: Automations
- [ ] Monthly invoice generation scheduled function
- [ ] Overdue invoice checker
- [ ] Contract renewal checker
- [ ] Credits burn rate calculator (daily)
- [ ] Email notifications för critical alerts

### ☐ Fas 7: Testing och Verification
- [ ] Test alla CRUD operations för invoices
- [ ] Test alla CRUD operations för contracts
- [ ] Test PDF generation
- [ ] Test business rules evaluation
- [ ] Test scheduled functions locally
- [ ] Verify RLS policies
- [ ] Test från partner account (begränsad access)

### ☐ Fas 8: Documentation och Training
- [ ] API documentation
- [ ] User guide för fakturering
- [ ] User guide för avtal
- [ ] Training video (optional)

---

## KVALITETSKRAV

### Code Quality

**1. TypeScript Strict Mode**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**2. Konsekvent Felhantering**
```typescript
// ALLTID wrappa API calls
try {
  const result = await partnerPortalApi.invoices.create(data);
  setSuccess('Invoice created successfully');
  navigate(`/admin/partner-portal/invoices/${result.id}`);
} catch (error) {
  console.error('Failed to create invoice:', error);
  setError('Failed to create invoice. Please try again.');
} finally {
  setSubmitting(false);
}
```

**3. Loading States**
```typescript
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);

// Initial load
useEffect(() => {
  loadData().finally(() => setLoading(false));
}, []);

// Action
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    await saveData();
  } finally {
    setSubmitting(false);
  }
};
```

**4. Optimistic UI Updates**
```typescript
// Update UI immediately, revert on error
const handleMarkAsPaid = async (invoiceId: string) => {
  const originalInvoices = [...invoices];

  // Optimistic update
  setInvoices(invoices.map(inv =>
    inv.id === invoiceId
      ? { ...inv, status: 'paid' }
      : inv
  ));

  try {
    await partnerPortalApi.invoices.markAsPaid(invoiceId);
    setSuccess('Invoice marked as paid');
  } catch (error) {
    // Revert on error
    setInvoices(originalInvoices);
    setError('Failed to mark as paid');
  }
};
```

**5. Validering**
```typescript
// Client-side validation INNAN API call
const validateInvoice = (invoice: Partial<Invoice>): string[] => {
  const errors: string[] = [];

  if (!invoice.customer_id) errors.push('Customer is required');
  if (!invoice.due_date) errors.push('Due date is required');
  if (invoice.due_date && invoice.due_date < invoice.invoice_date) {
    errors.push('Due date must be after invoice date');
  }

  return errors;
};

const handleSubmit = () => {
  const errors = validateInvoice(formData);
  if (errors.length > 0) {
    setError(errors.join(', '));
    return;
  }

  // Proceed with save
};
```

### UI/UX Standards

**1. Feedback Överallt**
```typescript
// Success toast
{success && (
  <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg">
    <div className="flex items-center gap-2">
      <CheckCircle className="h-5 w-5" />
      {success}
    </div>
  </div>
)}

// Error toast
{error && (
  <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg">
    <div className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      {error}
    </div>
  </div>
)}
```

**2. Loading Indicators**
```typescript
// Button with loading
<button
  onClick={handleSave}
  disabled={submitting}
  className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
>
  {submitting ? (
    <>
      <Loader className="animate-spin h-4 w-4 mr-2 inline" />
      Saving...
    </>
  ) : (
    'Save Invoice'
  )}
</button>
```

**3. Confirmation Dialogs**
```typescript
// Innan destructive actions
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this invoice? This cannot be undone.')) {
    return;
  }

  try {
    await partnerPortalApi.invoices.delete(id);
    setSuccess('Invoice deleted');
    await loadInvoices();
  } catch (error) {
    setError('Failed to delete invoice');
  }
};
```

**4. Empty States**
```typescript
{invoices.length === 0 ? (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Yet</h3>
    <p className="text-gray-600 mb-4">Create your first invoice to get started.</p>
    <button
      onClick={() => setShowCreateModal(true)}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg"
    >
      Create Invoice
    </button>
  </div>
) : (
  // Display invoices
)}
```

**5. Responsiv Design**
```typescript
// Mobile-first, scale up
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Performance

**1. Lazy Loading**
```typescript
// Lazy load pages
const InvoicesPage = lazy(() => import('./pages/admin/partner-portal/InvoicesPage'));
const ContractsPage = lazy(() => import('./pages/admin/partner-portal/ContractsPage'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <InvoicesPage />
</Suspense>
```

**2. Memoization**
```typescript
// Memo expensive calculations
const totalRevenue = useMemo(() => {
  return invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);
}, [invoices]);

// Memo components
const InvoiceRow = memo(({ invoice, onUpdate }: Props) => {
  // Component content
});
```

**3. Pagination**
```typescript
const [page, setPage] = useState(1);
const [pageSize] = useState(50);

useEffect(() => {
  loadInvoices({
    offset: (page - 1) * pageSize,
    limit: pageSize
  });
}, [page, pageSize]);
```

**4. Debouncing**
```typescript
// Search input debounced
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    searchInvoices(query);
  }, 300),
  []
);

<input
  type="text"
  onChange={(e) => debouncedSearch(e.target.value)}
  placeholder="Search invoices..."
/>
```

### Security

**1. RLS Verification**
```sql
-- Test as different users
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "user-id-here"}';

SELECT * FROM invoices; -- Should only return invoices user has access to
```

**2. Input Sanitization**
```typescript
// Sanitera användarinput
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

**3. Secrets Management**
```typescript
// ALDRIG hardcoda secrets
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// För server-side (Edge Functions)
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
```

---

## SLUTLIGA VERIFIERINGSSTEG

Innan deploy, kör igenom denna checklist:

### Build & Compile
```bash
npm run build
# MÅSTE lyckas utan errors
# Warnings OK, men granska dem
```

### Type Checking
```bash
npx tsc --noEmit
# Inga type errors
```

### Manual Testing
- [ ] Login som admin
- [ ] Navigera till varje sida i admin
- [ ] Testa skapa ny invoice
- [ ] Testa skapa nytt contract
- [ ] Testa edit invoice
- [ ] Testa delete draft invoice
- [ ] Testa mark invoice as paid
- [ ] Testa generera PDF
- [ ] Testa business intelligence alerts visas
- [ ] Testa från customer detail → skapa invoice
- [ ] Testa från customer detail → skapa contract
- [ ] Logout och in igen → allt fungerar fortfarande

### Data Integrity
```sql
-- Verifiera credits calculations
SELECT
  c.company_name,
  c.credits_monthly_allocation,
  c.credits_balance,
  SUM(te.hours * wt.credits_per_hour) as consumed_credits
FROM customers c
LEFT JOIN time_entries te ON te.customer_id = c.id
LEFT JOIN work_types wt ON wt.id = te.work_type_id
GROUP BY c.id, c.company_name, c.credits_monthly_allocation, c.credits_balance;

-- Verifiera invoice totals
SELECT
  i.invoice_number,
  i.subtotal as stored_subtotal,
  SUM(ili.amount) as calculated_subtotal,
  i.subtotal - SUM(ili.amount) as difference
FROM invoices i
LEFT JOIN invoice_line_items ili ON ili.invoice_id = i.id
GROUP BY i.id, i.invoice_number, i.subtotal
HAVING ABS(i.subtotal - SUM(ili.amount)) > 0.01;
-- Should return 0 rows
```

### Performance Check
```bash
# Check bundle size
npm run build
ls -lh dist/assets/*.js

# Should be < 1.5MB för main bundle
```

### Security Audit
```sql
-- Test RLS as non-admin
BEGIN;
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "random-user-id"}';

SELECT * FROM invoices; -- Should return 0 rows or error
SELECT * FROM contracts; -- Should return 0 rows or error

ROLLBACK;
```

---

## SLUTORD

Detta system är designat för:

1. **LÅNGSIKTIG STABILITET** - Inget behöver byggas om när ni växer
2. **TRANSPARENT AFFÄRSSTYRNING** - Alltid koll på marginaler, kostnader, risker
3. **PROFESSIONELL KUNDHANTERING** - Fakturor och avtal på samma nivå som er tjänst
4. **SKALBAR INTELLIGENS** - Regelmotor som växer med er affärslogik
5. **KOMMERSIELL MOGNAD** - Redo att sälja från dag 1

Följ denna guide. Avviker inte från strukturen. Implementera metodiskt. Testa noggrant. Publicera med förtroende.

**NorthForce Partner Portal är er affärsmotor.**
