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
   - Set `ADMIN_USER` and `ADMIN_PASS` for admin access
   - Configure SMTP settings for email notifications (optional)
   - Add booking and integration URLs as needed

4. Start the development server:
```bash
npm run dev
```

## Admin Access

The admin area is protected with Basic Authentication. Access it at `/admin` using the credentials configured in your environment variables.

### Admin Features
- Lead management and export
- System logs and monitoring
- Configuration management

### Security Notes
- Always use strong passwords for admin access
- Keep environment variables secure and never commit them to version control
- The admin area is automatically protected - no additional setup required

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