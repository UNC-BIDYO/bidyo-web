# BIDYO roadmap

Generated from `.github/roadmap.json` by `npm run roadmap:md`. Live progress is on GitHub → **Issues → Milestones**.

Legend: ✅ done · ⬜ open · 🙋 needs Kurt (account, decision or content)

## M1 · Setup (1/6)

Repo, Cloudflare Workers deploy, design tokens, theme toggle, uncbidyo.org DNS on Cloudflare.

- ✅ Scaffold Next.js 16 project for Cloudflare Workers `infra`
- ⬜ Create GitHub org and push the repo 🙋 `infra`
- ⬜ Create Cloudflare account and connect Workers Builds 🙋 `infra`
- ⬜ Move uncbidyo.org DNS to Cloudflare 🙋 `infra`
- ⬜ Attach new.uncbidyo.org preview domain `infra`
- ⬜ Branch protection and PR workflow `infra`

## M2 · Public site (0/13)

All wireframe sections built as components with placeholder content, responsive and accessible.

- ⬜ Navbar and mobile menu `site`
- ⬜ Hero with background reel `site`
- ⬜ Proof strip (5+ organizations) `site`
- ⬜ Services list `site`
- ⬜ Album section with filters `site`
- ⬜ How it works (4 steps) `site`
- ⬜ Who we serve cards `site`
- ⬜ About and team grid `site`
- ⬜ FAQ accordion `site`
- ⬜ Booking section UI `site` `booking`
- ⬜ Footer `site`
- ⬜ Responsive, accessibility and performance pass `site`
- ⬜ Collect hero reel and sample photos 🙋 `content`

## M3 · Data (Supabase) (0/5)

Supabase project, schema, storage and security rules; site sections read real data.

- ⬜ Create Supabase project on the org account 🙋 `data`
- ⬜ Database schema and migrations `data`
- ⬜ Row-level security and roles `data`
- ⬜ Storage buckets and image resizing `data`
- ⬜ Site sections read from the database `data` `site`

## M4 · Booking (0/4)

Request form saves to the database, enforces the 7-day rule and sends emails.

- ⬜ Submit requests to the database `booking`
- ⬜ Spam protection `booking`
- ⬜ Set up Resend on uncbidyo.org 🙋 `booking`
- ⬜ Request emails `booking`

## M5 · Admin (0/5)

Invite-only dashboard: requests inbox with accept/decline, albums, team, organizations.

- ⬜ Admin sign-in (invite only) `admin`
- ⬜ Requests inbox with accept/decline `admin`
- ⬜ Album manager `admin`
- ⬜ Team and organizations manager `admin`
- ⬜ Decide approver access 🙋 `admin`

## M6 · Launch (0/4)

Real content, performance, SEO and accessibility checks, uncbidyo.org switched to the new site.

- ⬜ Real content pass 🙋 `content`
- ⬜ SEO and social sharing `site`
- ⬜ Final QA `site`
- ⬜ Switch uncbidyo.org to the new site 🙋 `infra`

