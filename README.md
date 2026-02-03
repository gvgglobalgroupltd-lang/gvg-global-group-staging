# GVG Global Group - ERP & Corporate Portal

Enterprise-grade Next.js 14 application featuring a dual-brand identity system for GVG Metals (Industrial) and GVG Tech (IT Consulting).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎨 Brand Identity

### Color System
- **Industrial (GVG Metals)**: Slate-900 (#0f172a) - Deep navy for metal trading
- **Tech (GVG Tech)**: Indigo-600 (#4f46e5) - Electric blue for IT consulting
- **Accent**: Amber-500 (#f59e0b) - Safety orange for alerts/actions

## 🏗️ Architecture

### Layouts
- **RootLayout**: Global configuration with Geist fonts
- **PublicLayout**: Landing pages (`/`)
- **DashboardLayout**: Protected admin interface (`/admin`)

### Authentication
- Supabase Auth with middleware protection
- All `/admin/*` routes require authentication
- Auto-redirect to `/login` for unauthenticated users

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── layout.tsx     # Public layout
│   │   └── page.tsx       # Split Hero homepage
│   ├── admin/             # Protected admin routes
│   │   ├── layout.tsx     # Dashboard with sidebar
│   │   └── page.tsx       # Dashboard overview
│   ├── login/
│   │   └── page.tsx       # Corporate login page
│   └── globals.css        # TailwindCSS theme
├── lib/
│   └── supabase/          # Supabase clients
└── middleware.ts          # Route protection
```

## 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these from your [Supabase project](https://supabase.com/dashboard)

## ✨ Features

### Homepage - Split Hero Design
- **Left**: GVG Metals with industrial gradient
- **Right**: GVG Tech with digital nodes pattern
- Responsive, animated backgrounds
- Professional CTAs

### Login Page
- Corporate gradient design
- Supabase authentication
- Error handling
- Professional form validation

### Admin Dashboard
- Collapsible sidebar navigation
- Division overview cards (Metals & Tech)
- Quick stats display
- User profile in topbar
- Protected routes with middleware

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: Shadcn/UI
- **Auth & Database**: Supabase
- **Icons**: Lucide React

## 📖 Documentation

For detailed implementation guide, see the [walkthrough documentation](../brain/ddcd2246-136d-4d6a-be9b-e96b6148b55e/walkthrough.md).

## 🔧 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 Next Steps

1. Configure Supabase project
2. Create authentication users
3. Test login/logout flow
4. Build Metals division features
5. Build Tech division features
6. Integrate database operations

---

**Built with precision for GVG Global Group**
