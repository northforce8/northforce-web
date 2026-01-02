# Customer Portal Structure Overview

## Purpose

This document describes the Customer Portal from the user's perspective. It explains what the portal is, how it is organized, and what value it provides to customers.

---

## What is the Customer Portal?

The Customer Portal is a secure, dedicated interface that provides customers with visibility into their ongoing engagement with NorthForce. It enables customers to:

- Monitor project progress and status
- Review detailed work activity logs
- Track capacity consumption and utilization
- Access deliverables and documentation
- Understand engagement health and trajectory

The portal ensures transparency and enables customers to stay informed without requiring manual reporting or status meetings.

---

## Portal Areas

The Customer Portal is organized into four primary sections:

### 1. Overview (Dashboard)

**Purpose:** Provide an at-a-glance summary of engagement status and health.

**What Customers See:**

- **Active Projects** – Current count of projects in progress
- **Completed Deliveries** – Total number of finished projects
- **Capacity Remaining** – Available credits for future work
- **Capacity Utilization** – Percentage of capacity consumed to date
- **Recent Activity** – Latest deliveries, milestones, and updates
- **Capacity Breakdown** – Visual representation of consumed vs. available capacity

**Customer Value:** Immediate understanding of current engagement status without needing to parse detailed reports or request updates from account managers.

---

### 2. Activity

**Purpose:** Provide detailed transparency into all work performed.

**What Customers See:**

- Chronological log of all work entries
- For each entry: project name, work type, description, date, hours, and credits consumed
- Filter options to view specific time periods (week, month, all time)

**Customer Value:** Complete visibility into what work has been done, when it was completed, and how capacity is being utilized. This enables customers to verify value delivery and understand resource allocation.

---

### 3. Documents

**Purpose:** Centralize access to deliverables and engagement documentation.

**What Customers See:**

- Project deliverables
- Progress reports
- Engagement documentation

**Note:** This section is currently in preparation and will be activated when document management capabilities are deployed.

**Customer Value:** Single location for accessing all engagement outputs, eliminating the need to search email threads or shared drives.

---

### 4. Help

**Purpose:** Enable self-service learning and reduce dependency on support.

**What Customers See:**

- Getting Started guide
- Detailed explanations of each portal area
- Key concepts (capacity, credits, projects, utilization)
- Instructions for interpreting data

**Customer Value:** Customers can onboard themselves and answer questions without contacting support. Help content is written in clear, non-technical language suitable for business users.

---

## Design Principles

The Customer Portal follows these principles:

### Clarity Over Complexity

Information is presented clearly and directly. Technical jargon and internal terminology are avoided. Customers should understand what they see without specialized knowledge.

### Transparency

All relevant engagement data is visible. There are no hidden metrics or restricted views. If work is performed, it appears in the portal.

### Focus on Status and Progress

The portal emphasizes current status, recent activity, and forward-looking capacity planning. It answers the questions customers naturally ask: "Where are we now?" and "What can we still accomplish?"

### Self-Service

Customers can access information independently without requiring account manager intervention. The portal reduces administrative overhead while improving customer experience.

---

## Differentiation from Admin Portal

The Customer Portal is **not** the admin portal. Key differences:

| Aspect | Customer Portal | Admin Portal |
|--------|----------------|--------------|
| Audience | Customers | Internal consultants, partners, admins |
| Focus | Status, progress, consumption | Operations, delivery, management |
| Tone | Business-focused, clear, simple | Operational, detailed, technical |
| Functionality | Read-only visibility | Full CRUD operations |
| Navigation | Minimal, focused | Comprehensive, multi-layered |

The Customer Portal is designed for executives, project sponsors, and business stakeholders who need oversight without operational involvement.

---

## Access Control

Access to the Customer Portal is controlled through:

- **Authentication:** Users log in with email and password
- **Authorization:** User profiles specify role (customer, partner, admin)
- **Data Filtering:** Customers see only their own engagement data

Security is enforced at both the authentication layer (Supabase Auth) and the database layer (Row Level Security policies).

---

## Language Support

The Customer Portal is fully bilingual:

- All interface text is available in English and Swedish
- Help content is completely translated
- Language selection persists across sessions
- No mixed-language states occur

This ensures customers can use the portal in their preferred language without encountering untranslated content.

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Audience:** Internal (Product, Implementation, Support teams)
