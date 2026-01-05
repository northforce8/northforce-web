# NorthForce Enterprise Website

A modern, responsive website built with React, TypeScript, and Tailwind CSS.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Configure your environment variables in `.env.local`:
   - Set Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
   - Configure SMTP settings for email notifications (optional)
   - Add booking and integration URLs as needed

4. Start the development server:
```bash
npm run dev
```

## Admin Access

The admin area is protected with Supabase authentication. Access it at `/admin/login` using your Supabase admin credentials.

### Admin Features
- Customer and partner management
- Project and contract management
- Time tracking and billing
- Strategic frameworks (OKR, SWOT, etc.)
- Lead management and analytics

### Security Notes
- Admin users are managed through Supabase with role-based access (admin/partner/customer)
- All data access is protected by Row Level Security (RLS) policies
- Keep environment variables secure and never commit them to version control

## Environment Variables

See `.env.local.example` for all available configuration options.

## Deployment

The site is optimized for static deployment and can be deployed to any modern hosting platform.

```bash
npm run build
```

## Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **Build Tool**: Vite