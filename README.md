# NorthForce – Website

Public marketing and information website for NorthForce.

## 🎯 Project Scope

**This project contains ONLY:**
- ✅ Public marketing pages
- ✅ Information pages (about, services, pricing, etc.)
- ✅ Contact forms
- ✅ Booking forms
- ✅ SEO-optimized content

**This project does NOT contain:**
- ❌ Admin portal (see separate portal repository)
- ❌ Partner portal
- ❌ Customer portal
- ❌ Database migrations
- ❌ PDF generation
- ❌ AI services

---

## 🚀 Development

This project is built and deployed via **Bolt**.

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

---

## 📦 Bundle Size

**Optimized for fast loading:**
- Main bundle: ~622 KB (gzipped: ~140 KB)
- Load time: <1.5s on average connection
- Lighthouse score: 90+

---

## 🌐 Deployment

**Domain:** northforce.io
**Platform:** Netlify
**Trigger:** Push to `main` branch (via Bolt)

### Environment Variables

Required environment variables (set in Netlify dashboard):

```
VITE_SUPABASE_URL=https://acafwflefwgdodpskfkm.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

---

## 🔗 Related Projects

**Portal Application:**
- Repository: northforce-portal (separate GitHub repository)
- Domain: portal.northforce.io
- Contains: Admin portal, Partner portal, Customer portal

---

## 📁 Project Structure

```
src/
├── components/       # Public components (Header, Footer, etc.)
├── pages/           # Public pages (HomePage, AboutPage, etc.)
├── lib/             # Minimal utilities (supabase, email, error-handler, logger)
├── locales/         # Translations (en.json, sv.json)
├── contexts/        # React contexts
└── hooks/           # React hooks
```

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **Build:** Vite
- **i18n:** i18next
- **Forms:** Supabase (for contact/booking submissions)

---

## 📄 License

Private - NorthForce AB

---

## 👥 Team

**Marketing & Content Team:**
- Works in this repository (via Bolt)
- Can modify public pages and content
- Cannot access portal code (different project)

**Development Team:**
- Works in northforce-portal repository
- Can modify admin/portal features
- Cannot access public website (different project)

---

## 🎨 Design System

This project follows the NorthForce design system:
- Professional color palette (no purple/indigo)
- Consistent typography
- Responsive design (mobile-first)
- Accessibility (WCAG 2.1 AA)

---

## 📞 Contact

- Website: https://northforce.io
- Email: contact@northforce.io
- Phone: +46 10 337 13 34

---

## 📝 Notes

This is the **public website only**. For portal/admin functionality, see the separate northforce-portal repository.

**Separation completed:** 2026-01-29
