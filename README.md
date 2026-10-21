# UNC BIDYO — uncbidyo.org

The client site for UNC BIDYO, the University of Nueva Caceres photo and video organization. It's built with **Next.js 16** and deployed to **Cloudflare Workers** through the OpenNext adapter.

## Stack

| Part | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + BIDYO design tokens (light & dark) |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` |
| Fonts | Instrument Serif, Archivo, IBM Plex Mono, self-hosted in `src/fonts` |
| Later | Supabase (requests, albums, auth), Resend (email) |

## Run it locally

Requires Node 20.9+ (22 LTS recommended).

```bash
npm install
npm run dev          # http://localhost:3000 (works on Windows, macOS, Linux)
```

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server with hot reload |
| `npm run build` | Plain Next.js production build (quick check) |
| `npm run preview` | Builds for Workers and runs it locally in the real Workers runtime. **Windows: run inside WSL.** |
| `npm run deploy` | Builds and deploys from your machine (normally Cloudflare does this on every push) |
| `npm run tokens` | Regenerates `src/styles/tokens.css` from `design/tokens.json` |
| `npm run lint` | ESLint |

## Design tokens and themes

- `design/tokens.json` is exported from the BIDYO Design System. Don't hand-edit `src/styles/tokens.css`. Change the JSON and run `npm run tokens`.
- Tailwind classes map to the tokens: `bg-bg`, `bg-surface`, `bg-band`, `bg-hero`, `text-text`, `text-text-muted`, `text-accent`, `bg-primary`, `text-on-primary`, `text-on-band`, `border-border`, `border-hairline`.
- Type styles are plain classes: `type-display`, `type-h1`–`type-h3`, `type-body-lg`, `type-body`, `type-small`, `type-label`, `type-meta`.
- Themes come from `<html data-theme="light|dark">`. An inline script in `src/app/layout.tsx` sets the theme before first paint, from the saved choice (`localStorage["bidyo-theme"]`) or the device setting. `ThemeToggle` switches it.

## Project layout

```
design/tokens.json            design system export (source of truth for colors/type/spacing)
scripts/sync-tokens.mjs       tokens.json → src/styles/tokens.css
src/app/                      routes (public site now; /admin later)
src/components/site/          page sections (Navbar, Hero, Services, Album, …)
src/components/ui/            small building blocks (ThemeToggle, Button, Field, …)
src/fonts/                    self-hosted woff2 files (OFL)
public/brand/                 logos
wrangler.jsonc                Cloudflare Worker config (name: bidyo-web)
open-next.config.ts           OpenNext adapter config
```

## Decisions worth knowing

- **Cache Components is off.** In Next 16.4 with OpenNext, it makes requests hang in the Workers runtime. Revisit when OpenNext supports it there.
- **Incremental cache = static assets.** Prerendered pages are served from the Worker's assets, which is free and needs no R2 or KV. When the admin dashboard needs on-demand updates, switch `open-next.config.ts` to the KV or R2 cache.
- **`images.unoptimized: true`.** Next's image optimizer on Cloudflare needs the paid Images service. Photos will be resized by Supabase Storage or Cloudinary instead.
- **Fonts are self-hosted**, so builds never depend on reaching Google Fonts.
- Worker size today is about 1 MB gzipped. The free plan's limit is 3 MiB, so keep big libraries out of the server bundle.

## Environment variables

- Local secrets go in `.dev.vars`. Copy `.dev.vars.example`. This file is git-ignored.
- Production secrets go in Cloudflare: **Workers & Pages → bidyo-web → Settings → Variables and Secrets**.
- Nothing secret is needed yet.

---

# Setup checklist

Do these once, signed in with the **BIDYO org email** so the project can be handed over to future officers.

## 1. GitHub

1. Create a GitHub account with the org email (or use an existing one).
2. Create a free **organization** named `uncbidyo` (or similar). Invite your personal GitHub account as an **Owner**.
3. In the org, create an **empty private repository** named `bidyo-web`. Don't add a README; this project already has one.
4. Push this project:

   ```bash
   cd bidyo-web
   npm install
   git remote add origin https://github.com/uncbidyo/bidyo-web.git
   git push -u origin main
   ```

## 2. Cloudflare account

1. Sign up at dash.cloudflare.com with the org email (Free plan).
2. **Manage Account → Members → Invite** your personal email as Administrator, so you can work without sharing the org password.

## 3. Connect the repo (automatic deploys)

1. In the dashboard: **Workers & Pages → Create → Import a repository**.
2. Connect GitHub. When asked, install the Cloudflare app on the `uncbidyo` org and allow the `bidyo-web` repo.
3. Settings:
   - **Project name:** `bidyo-web`. It must match `name` in `wrangler.jsonc`.
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx wrangler deploy`
   - **Non-production branch deploy command:** `npx wrangler versions upload`. This gives every branch or PR a preview link.
   - Root directory: `/`
4. Deploy. You get a URL like `https://bidyo-web.<your-subdomain>.workers.dev`.
5. From then on, every push to `main` deploys automatically.

## 4. Move uncbidyo.org's DNS to Cloudflare

The old site keeps working throughout this step. Cloudflare copies your existing DNS records.

1. **Add a domain → uncbidyo.org → Free plan.** Review the imported DNS records. They should include the records pointing to the current Vercel site.
2. Cloudflare shows **two nameservers**. At your domain registrar, replace the current nameservers with those two.
3. Wait until Cloudflare marks the domain **Active**. It usually takes minutes, but can take up to 24 hours.
4. Optional: in **Email → Email Routing**, forward addresses like `hello@uncbidyo.org` to the org inbox.

## 5. Preview on a subdomain, then launch

- **Now:** Workers → bidyo-web → Settings → **Domains & Routes → Add → Custom domain** → `new.uncbidyo.org`. The team can review the new site while uncbidyo.org still shows the old one.
- **Launch day:**
  1. In DNS, delete the old Vercel records for `uncbidyo.org` and `www`.
  2. Add custom domains `uncbidyo.org` and `www.uncbidyo.org` to the `bidyo-web` Worker.
  3. Remove the domain from the old Vercel project.

## Windows notes

- `npm run dev` works normally.
- `npm run preview` and `npm run deploy` use the Workers build tooling, which isn't officially supported on Windows. Run them in WSL, or just push to GitHub and let Cloudflare build.
