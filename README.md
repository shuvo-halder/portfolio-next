# 🛡️ Shuvo Halder — DevOps & Systems Engineer Dynamic Portfolio & Control Room

> **Production-grade, database-driven personal portfolio and content management control room engineered with Next.js 16 (App Router), PostgreSQL 16, Prisma ORM, TypeScript (Strict), Tailwind CSS v4, and an Infrastructure Control Room design system.**

[![CI Pipeline](https://github.com/shuvo-halder/portfolio-next/actions/workflows/ci.yml/badge.svg)](https://github.com/shuvo-halder/portfolio-next/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Alpine%20Multi--Stage-2496ED?logo=docker)](Dockerfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Operational-10B981.svg)](https://shuvohalder.dev)

---

## 📋 System Overview

This portfolio website is built for **DevOps Engineers, Systems Engineers, and Linux Administrators**. Rather than a static brochure, it operates as a full-fledged dynamic web platform and control plane:

* **Single-Admin Control Plane (`/admin`):** Secure session-authenticated portal with full CRUD for Profile, Projects (with automated GitHub repository importer), Blog Posts (Markdown live preview editor), Skills Bento Grid & Proficiencies, Timeline (Experience & Education), Credentials (Certifications & Badges), Media Library, Contact Messages Inbox, and System Audit Logs.
* **Production Database Layer:** PostgreSQL 16 managed via Prisma ORM with 14 models, atomic migrations, automated seeding script (`prisma/seed.ts`), and offline fallback resilience.
* **Instant Tagged ISR (Incremental Static Regeneration):** Public pages are rendered as Server Components with tag-based revalidation (`updateTag` & `revalidatePath`). Any admin update reflects instantly on the public site without needing a rebuild or redeployment.
* **Interactive Terminal Widget:** Terminal console on the hero section with command parsing (`whoami`, `ls`, `cat skills.txt`, `uptime`, `status`, `contact`).
* **Command Palette (`⌘K` / `Ctrl+K`):** Global keyboard-driven quick launcher across all routes, projects, and administrative actions.
* **Animated CI/CD Pipeline:** Interactive SVG architecture diagram visualizing `Commit ➔ Build ➔ Test ➔ Scan ➔ Deploy ➔ Monitor`.
* **Security & Hardening:** Single-admin account provisioning, bcrypt password hashing with strong salt rounds, sliding-window rate limiting on login, optional TOTP 2FA (RFC 6238), CSRF protection, strict Next.js 16 proxy routing guards, and automated database backup/restore scripts.

---

## 🏛️ Architecture & Data Flow

```mermaid
graph TD
    Client["Browser Client (Desktop / Mobile)"] --> Proxy["Next.js 16 Proxy Guard (/admin/*)"]
    Proxy --> PublicRoutes["Public Server Components (Tagged ISR)"]
    Proxy --> AdminRoutes["Admin Control Panel (/admin)"]
    
    subgraph "Application Core"
        PublicRoutes --> DBQueries["Cached DB Queries (src/lib/db/queries.ts)"]
        AdminRoutes --> ServerActions["Server Actions (Zod Validated)"]
        ServerActions --> CacheInvalidator["Cache Invalidation (updateTag / revalidatePath)"]
        ServerActions --> AuditLogger["Audit Log Engine (AuditLog Model)"]
        ServerActions --> Storage["StorageAdapter (Local Disk Volume / S3)"]
    end
    
    DBQueries --> PrismaClient["Prisma ORM Client (Singleton)"]
    ServerActions --> PrismaClient
    PrismaClient --> PostgresDB[("PostgreSQL 16 Database")]
    
    subgraph "External Integrations"
        ServerActions --> GitHubAPI["GitHub REST API (Repo Import)"]
        ServerActions --> DevToAPI["Dev.to Articles Sync"]
        PublicRoutes --> RSS["Dynamic RSS Feed (/feed.xml)"]
        PublicRoutes --> Health["/api/health (DB Ping + Telemetry)"]
    end
```

---

## 🛠️ Tech Stack & Architecture Choices

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Server Components, Partial Prerendering (PPR), Turbopack, and Tagged ISR caching. |
| **Database & ORM** | **PostgreSQL 16 + Prisma ORM** | Relational integrity, type-safe schema, migrations, and automatic client generation. |
| **Authentication** | **Session Engine + Bcrypt + TOTP 2FA** | Single-admin access, secure `httpOnly` cookies, rate-limiting, and optional Authenticator 2FA. |
| **Language** | **TypeScript (Strict Mode)** | Complete type safety across database schemas, server actions, and UI components. |
| **Styling** | **Tailwind CSS v4** | CSS variables-driven dark/light theme, custom terminal utilities, and zero runtime overhead. |
| **Storage** | **StorageAdapter (Local / S3)** | Decoupled abstraction allowing seamless switching between local persistent volumes and S3/MinIO/R2. |
| **Testing** | **Vitest** | Sub-second unit test execution verifying authentication, rate limiting, and storage security. |
| **Containerization** | **Docker Multi-Stage (Alpine)** | Non-root container (`nextjs:nodejs`), automated startup migrations, and health checks. |

---

## 📂 Repository Structure

```text
portfolio-next/
├── .github/
│   ├── dependabot.yml                 # Automated dependency updates
│   └── workflows/
│       └── ci.yml                     # Prisma generate, lint, typecheck, tests, build
├── backups/                           # Automated backup archives (ignored by git)
├── docker-compose.yml                 # Production App + PostgreSQL 16 + Nginx
├── docker-compose.dev.yml             # Development PostgreSQL + MinIO S3 Mock
├── Dockerfile                         # Production multi-stage Alpine container
├── docker-entrypoint.sh               # Container startup script (runs prisma db push)
├── nginx.conf                         # Production Nginx reverse proxy & SSL config
├── prisma/
│   ├── schema.prisma                  # Prisma ORM schema (14 models)
│   └── seed.ts                        # Seed script ingesting real profile & project data
├── scripts/
│   ├── backup.sh                      # Automated pg_dump & uploads tarball backup
│   ├── restore.sh                     # Disaster recovery / restore utility
│   └── capture-screenshots.mjs        # Playwright automated UI verification
├── src/
│   ├── actions/                       # Zod-validated Server Actions for Admin CRUD
│   │   ├── auth.ts                    # Login, logout, rate-limiting
│   │   ├── blog.ts                    # Blog posts creation, editing & markdown parsing
│   │   ├── credentials.ts             # Certifications & achievements management
│   │   ├── media.ts                   # File upload & deletion actions
│   │   ├── messages.ts                # Contact inbox actions
│   │   ├── profile.ts                 # Profile info & socials update
│   │   ├── projects.ts                # Projects CRUD & GitHub repository importer
│   │   ├── settings.ts                # General settings & TOTP 2FA setup
│   │   ├── skills.ts                  # Skills & skill categories CRUD
│   │   └── timeline.ts                # Experience & education entries CRUD
│   ├── app/
│   │   ├── admin/                     # Secure Admin Control Panel routes
│   │   │   ├── audit-logs/            # Audit trail viewer
│   │   │   ├── blog/                  # Post manager & markdown editor with preview
│   │   │   ├── credentials/           # Certifications & badges manager
│   │   │   ├── login/                 # Terminal-styled secure login
│   │   │   ├── media/                 # File manager & asset uploader
│   │   │   ├── messages/              # Contact form inbox
│   │   │   ├── profile/               # Profile info editor
│   │   │   ├── projects/              # Projects list, editor & GitHub import modal
│   │   │   ├── settings/              # System settings & TOTP 2FA configuration
│   │   │   ├── skills/                # Skills matrix & categories manager
│   │   │   ├── timeline/              # Career & education manager
│   │   │   └── page.tsx               # Admin dashboard overview & analytics
│   │   ├── api/
│   │   │   ├── contact/route.ts       # Contact form submission endpoint
│   │   │   └── health/route.ts        # Telemetry healthcheck with PostgreSQL ping
│   │   ├── blog/                      # Dynamic blog listing & reading routes
│   │   ├── feed.xml/route.ts          # Dynamic RSS feed generator
│   │   ├── projects/[slug]/           # Dynamic project case study routes
│   │   ├── globals.css                # Control room tokens & scanlines
│   │   ├── layout.tsx                 # Root layout with theme provider & navigation
│   │   ├── opengraph-image.tsx        # Dynamic OpenGraph social card
│   │   ├── page.tsx                   # Main public portfolio page
│   │   ├── robots.ts                  # Dynamic robots.txt (excludes /admin)
│   │   └── sitemap.ts                 # Dynamic sitemap generator
│   ├── components/                    # UI components, layout, sections & widgets
│   ├── data/                          # Seed source & static fallback data
│   ├── lib/
│   │   ├── auth/                      # Session engine, bcrypt hashing & guard
│   │   ├── db/                        # Prisma singleton, queries layer & cache invalidation
│   │   ├── storage/                   # StorageAdapter interface & LocalStorageAdapter
│   │   ├── rate-limit.ts              # In-memory sliding window rate limiter
│   │   └── utils.ts                   # Date formatters, string slugifiers, cn()
│   └── proxy.ts                       # Next.js 16 proxy routing guard for /admin/*
└── tests/
    └── unit/                          # Vitest test suites (auth, storage, rate-limit, utils)
```

---

## 🚀 Quick Start & Development

### 1. Prerequisites
* **Node.js**: v20 or higher
* **Package Manager**: `pnpm` v10+ (or v12)
* **Docker & Docker Compose** (for local PostgreSQL)

### 2. Setup Environment
```bash
# 1. Clone repository
git clone https://github.com/shuvo-halder/portfolio-next.git
cd portfolio-next

# 2. Install dependencies
pnpm install

# 3. Create environment file
cp .env.example .env.local
```

### 3. Start Local Database & Seed Data
```bash
# 1. Start local PostgreSQL via Docker Compose
docker compose -f docker-compose.dev.yml up -d postgres

# 2. Push schema to database
pnpm db:push

# 3. Seed initial real data & create the singleton admin user
pnpm db:seed
```

### 4. Start Next.js Development Server
```bash
pnpm dev
```
* **Public Portfolio:** Visit `http://localhost:3000`
* **Admin Control Panel:** Visit `http://localhost:3000/admin/login`
  * Default Email: `shuvo-halder@outlook.com` (configurable in `.env.local`)
  * Default Password: `change_this_secure_password_in_production` (configurable in `.env.local`)

---

## 🧪 Testing, Quality & Build

```bash
# Run ESLint validation
pnpm lint

# Run strict TypeScript type checking
pnpm type-check

# Run Vitest unit tests
pnpm test

# Build production standalone bundle
pnpm build
```

---

## 🚢 Production Deployment

### Option A: Self-Hosted Docker Compose (Recommended for DevOps Engineers)

The project includes a production-ready `docker-compose.yml` orchestrating Next.js, PostgreSQL 16, persistent volumes, and optional Nginx with SSL:

```bash
# 1. Configure production environment variables in .env
cat <<EOF > .env
DATABASE_URL=postgresql://postgres:StrongProdPassword@postgres:5432/portfolio?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=StrongProdPassword
POSTGRES_DB=portfolio
ADMIN_EMAIL=shuvo-halder@outlook.com
ADMIN_PASSWORD=YourSuperSecureAdminPasswordHere!
SESSION_SECRET=$(openssl rand -hex 32)
STORAGE_PROVIDER=local
CONTACT_TO_EMAIL=shuvo-halder@outlook.com
EOF

# 2. Build and launch the stack
docker compose up -d

# 3. Verify health status
curl -s http://localhost:3000/api/health | jq
```

The container automatically runs `node ./node_modules/prisma/build/index.js db push --skip-generate` on startup before launching the Next.js standalone server.

### Option B: Cloud Deployment (Vercel + Managed PostgreSQL / Neon / Supabase)

1. Provision a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Connect your GitHub repository to Vercel.
3. Add the following Environment Variables in the Vercel Dashboard:
   * `DATABASE_URL`: Your pooled PostgreSQL connection string with `?sslmode=require`.
   * `ADMIN_EMAIL`: Your admin email.
   * `ADMIN_PASSWORD`: Your chosen admin password.
   * `SESSION_SECRET`: A 32+ character random secret (`openssl rand -hex 32`).
4. Set the Build Command:
   ```bash
   pnpm prisma generate && pnpm build
   ```
5. Deploy. Seed your database once by running locally:
   ```bash
   DATABASE_URL="your_remote_url" pnpm db:seed
   ```

---

## 💾 Automated Backup & Disaster Recovery

### Automated Backup
Run the backup script manually or configure a daily cron job:
```bash
./scripts/backup.sh
```
* Generates compressed PostgreSQL dump (`.dump` format via `pg_dump -Fc`).
* Creates tarball archive of uploaded media files.
* Automatically prunes backups older than 7 days (configurable via `RETENTION_DAYS`).

### Disaster Recovery / Restore
To restore database and media files from a previous backup:
```bash
./scripts/restore.sh ./backups/db_portfolio_YYYYMMDD_HHMMSS.dump ./backups/uploads_YYYYMMDD_HHMMSS.tar.gz
```

---

## 🔒 Security Architecture

1. **Next.js 16 Proxy Guard (`src/proxy.ts`):** Unauthenticated requests to `/admin/*` (except `/admin/login`) are automatically redirected to the login screen.
2. **Double-Layer Server Action Verification:** Every server mutation independently verifies the active session against PostgreSQL before modifying data, preventing unauthorized API calls even if proxy routing was bypassed.
3. **Password Security:** Multi-round bcrypt hashing (`bcryptjs` salt rounds 12).
4. **Brute Force Protection:** Sliding-window rate limiting on login attempts with automatic temporary IP backoff.
5. **TOTP Two-Factor Authentication:** Optional standard 6-digit TOTP (Google Authenticator, Bitwarden, 1Password) implemented using `otplib` and RFC 6238.
6. **File Upload Hardening:** Whitelisted MIME types (JPEG, PNG, WebP, GIF, SVG, PDF), strict blacklisting of executable scripts (`.sh`, `.exe`, `.php`, etc.), maximum 5MB image / 10MB PDF limits, UUID-randomized filenames, and directory traversal prevention.
7. **Search Engine Protection:** Robots.txt explicitly disallows `/admin/` and admin routes carry `x-robots-tag: noindex, nofollow`.

---

## 📊 Telemetry & Health Monitoring

The website exposes an unauthenticated health endpoint for synthetic monitors, uptime checks, and container orchestrators:

```bash
curl -s http://localhost:3000/api/health | jq
```

Response payload:
```json
{
  "status": "healthy",
  "service": "portfolio-next",
  "uptime": 86420,
  "timestamp": "2026-10-23T22:20:00.000Z",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "latencyMs": 4
  },
  "memory": {
    "rssMB": 52.15,
    "heapTotalMB": 34.50,
    "heapUsedMB": 22.32
  },
  "environment": "production"
}
```

---

## 📜 License

Licensed under the [MIT License](LICENSE). Built with ❤️ by [Shuvo Halder](https://github.com/shuvo-halder).
