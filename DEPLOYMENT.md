# Zwane Auto View — Deployment Guide

This guide covers two things:

1. **Supabase** — migrating the database from local SQLite to hosted PostgreSQL
2. **Netlify** — deploying the Next.js app to production

> **AWS note:** When you're ready to move to AWS later, the Supabase database connection string in your environment variables is the only thing that changes. The application code stays identical.

---

## Part 1 — Supabase Database Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Fill in:
   - **Name:** `zwane-auto-view`
   - **Database Password:** Choose a strong password and **save it somewhere safe** — you'll need it.
   - **Region:** Choose `South Africa (Cape Town)` (af-south-1) for lowest latency.
4. Click **Create new project** and wait ~2 minutes for provisioning.

---

### Step 2: Get Your Connection Strings

Once the project is ready:

1. In the left sidebar click **Project Settings → Database**.
2. Scroll down to **Connection string**.
3. Select the **URI** tab.
4. You'll see two important strings:

   **Direct connection** (used for migrations):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

   **Session mode / Pooler** (used by the running app — use port 5432 Pooler or the Transaction pooler at port 6543):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-af-south-1.pooler.supabase.com:6543/postgres
   ```

> **Which to use where:**
> - `DATABASE_URL` in your `.env` = **Transaction pooler** (port 6543) — used by the app at runtime.
> - `DIRECT_URL` in your `.env` = **Direct connection** (port 5432) — used only by `prisma migrate`.

---

### Step 3: Update Your Code for PostgreSQL

You need to make **3 code changes** before running migrations.

#### 3a. Install the PostgreSQL packages

```bash
npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3
npm install pg @types/pg
```

#### 3b. Update `prisma/schema.prisma`

Replace the `datasource` block and `generator` block:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

> The `directUrl` is required by Prisma when using Supabase's connection pooler — it lets `prisma migrate` bypass the pooler and connect directly.

#### 3c. Update `prisma.config.ts`

Replace the entire file contents:

```ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
```

#### 3d. Update `src/lib/prisma.ts`

Replace the entire file with:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> No adapter needed — the standard Prisma client handles PostgreSQL natively.

---

### Step 4: Update Your `.env` File

Open your `.env` file and replace the `DATABASE_URL` line, then add `DIRECT_URL`:

```env
# Supabase — Transaction Pooler (port 6543) — used by the app at runtime
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-af-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase — Direct Connection (port 5432) — used by prisma migrate only
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

NEXTAUTH_SECRET="zwane-auto-view-secret-key-change-in-production-2024"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@zwaneautoview.co.za"
ADMIN_PASSWORD="Admin@ZwaneAuto2024"
```

> Replace `[PROJECT-REF]` with your Supabase project reference (visible in your project URL: `https://supabase.com/dashboard/project/[PROJECT-REF]`).

---

### Step 5: Run Migrations on Supabase

```bash
npx prisma migrate deploy
```

This creates all the tables (`Vehicle`, `Image`, `Admin`) in your Supabase database.

Verify in Supabase: go to **Table Editor** in the sidebar — you should see the three tables.

---

### Step 6: Seed the Database

```bash
npm run seed
```

This populates Supabase with the 10 demo vehicles.

---

### Step 7: Test Locally Against Supabase

```bash
npm run dev
```

Open `http://localhost:3000` — the site should load with all vehicles, now served from Supabase.

---

### Image Uploads on Supabase (Important)

The current setup saves uploaded images to `/public/uploads/` on the local filesystem. On a deployed server (Netlify or AWS), this directory is **ephemeral** — files are lost on each deploy.

**For production, use Supabase Storage:**

1. In Supabase, go to **Storage → New bucket**.
2. Name it `vehicle-images`, set it to **Public**.
3. Install the Supabase JS client: `npm install @supabase/supabase-js`
4. Update `src/app/api/upload/route.ts` to upload to the bucket instead of the local filesystem.

This is the recommended path before going live. The local file upload still works fine for development and demos.

---

## Part 2 — Netlify Deployment

### Step 1: Push Your Code to GitHub

If you haven't already:

```bash
git add .
git commit -m "feat: initial Zwane Auto View build"
git remote add origin https://github.com/YOUR-USERNAME/zwane-auto-view.git
git push -u origin main
```

---

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorise Netlify.
4. Select your `zwane-auto-view` repository.

---

### Step 3: Configure Build Settings

Netlify should detect Next.js automatically. Confirm these settings:

| Setting | Value |
|---|---|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Node version** | `20` (set under Site Settings → Build & Deploy → Environment) |

Install the Netlify Next.js plugin to enable SSR (server-rendered pages):

```bash
npm install -D @netlify/plugin-nextjs
```

Then create a `netlify.toml` file in the root of your project:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Commit this file:

```bash
git add netlify.toml
git commit -m "chore: add Netlify config"
git push
```

---

### Step 4: Set Environment Variables on Netlify

In Netlify, go to **Site Settings → Environment Variables → Add variable**.

Add each of these:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase Transaction Pooler URL |
| `DIRECT_URL` | Your Supabase Direct Connection URL |
| `NEXTAUTH_SECRET` | A long random string (generate one at [generate-secret.vercel.app](https://generate-secret.vercel.app/32)) |
| `NEXTAUTH_URL` | `https://your-site-name.netlify.app` (your actual Netlify URL) |
| `ADMIN_EMAIL` | `admin@zwaneautoview.co.za` |
| `ADMIN_PASSWORD` | Your chosen admin password |

> **Important:** `NEXTAUTH_URL` must match your live Netlify URL exactly — no trailing slash.

---

### Step 5: Deploy

Click **Deploy site** in Netlify. The first build takes 2–3 minutes.

Once live, visit your Netlify URL and verify:
- The homepage loads with all vehicles
- `/admin` redirects to `/admin/login`
- Logging in with your admin credentials works
- The "Add New Vehicle" form works

---

### Step 6: Set Up a Custom Domain (Optional)

1. In Netlify, go to **Domain Management → Add custom domain**.
2. Enter your domain (e.g., `zwaneautoview.co.za`).
3. Update your domain's DNS records as instructed by Netlify.
4. Netlify provisions an SSL certificate automatically via Let's Encrypt.
5. Update `NEXTAUTH_URL` to your custom domain (e.g., `https://zwaneautoview.co.za`).

---

## Part 3 — Moving to AWS Later

When you're ready to move from Supabase to AWS RDS:

1. **Export your Supabase data** — Supabase dashboard → Settings → Database → Backups → Download.
2. **Create an RDS PostgreSQL instance** on AWS in the `af-south-1` (Cape Town) region.
3. **Import the dump** into RDS using `pg_restore`.
4. **Update `DATABASE_URL` and `DIRECT_URL`** in Netlify's environment variables to point to your RDS endpoint.
5. Trigger a redeploy on Netlify — no code changes required.

For the web app itself, if you move from Netlify to AWS (EC2, ECS, or Amplify):
- The app is a standard Next.js build — it runs anywhere Node.js runs.
- Run `npm run build` then `npm start` (port 3000 by default).
- Put it behind an ALB or CloudFront for HTTPS.

---

## Quick Reference

```bash
# Run database migrations
npx prisma migrate deploy

# Seed demo data
npm run seed

# Generate Prisma client after schema changes
npx prisma generate

# Local development
npm run dev

# Production build
npm run build
```

### Useful Links

- Supabase Dashboard: https://supabase.com/dashboard
- Netlify Dashboard: https://app.netlify.com
- Prisma Supabase Guide: https://www.prisma.io/docs/guides/database/supabase
- NextAuth Docs: https://next-auth.js.org
