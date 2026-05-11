# Fab City Awards 2026 — Evaluator Platform

Private evaluation platform for the Fab City Awards 2026 jury (32 confirmed evaluators × ~5 submissions each = 153 evaluations).

**Live:** https://evaluate.fab.city

## Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Data layer:** Airtable REST API (FCF_Awards base — `appXKdirVdJb34gdN`)
- **Auth:** Magic links (signed JWTs in URL params; emails sent manually by ops)
- **Hosting:** Vercel (auto-deploy from `main` branch)
- **DNS:** Cloudflare (`evaluate` CNAME → `cname.vercel-dns.com`)

## Build versions

| Version | Scope |
|---|---|
| **v0.1** | Project scaffold + landing page. Proves Vercel + DNS + cert pipeline works. |
| v0.2 | Magic-link auth + evaluator dashboard with real assignments. |
| v0.3 | Submission detail view + scoring panel with autosave. |
| v0.4 | Submit flow + polish + admin link generator script. |

## Run locally

```bash
npm install
cp .env.local.example .env.local
# fill in env vars
npm run dev
```

## Environment variables

| Name | Description |
|---|---|
| `AIRTABLE_PAT` | Airtable Personal Access Token (scopes: `data.records:read`, `data.records:write`, `schema.bases:read`) |
| `AIRTABLE_BASE_ID` | `appXKdirVdJb34gdN` (FCF_Awards base) |
| `MAGIC_LINK_BASE` | `https://evaluate.fab.city` in production, `http://localhost:3000` locally |
| `JWT_SECRET` | 64-byte hex random string (used to sign magic-link tokens) |

Production env vars live in Vercel project settings, not in this repo.

## Maintainers

- **Operations / build:** Lucas Marangoni — luc@fab.city
- **Awards program lead:** Josefina Nano — josefina@fab.city
