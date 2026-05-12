# Fab City Awards 2026 — Evaluator Platform

Private evaluation platform for the Fab City Awards 2026 jury.

**Live:** https://evaluate.fab.city

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- Airtable REST API (FCF_Awards base — `appXKdirVdJb34gdN`)
- Magic-link auth using signed JWTs (jose library)
- Hosting: Vercel (auto-deploy from `main`)

## Build versions

| Version | Scope |
|---|---|
| v0.1 | Landing page + deploy pipeline |
| **v0.2** | Magic-link auth + evaluator dashboard with real Airtable data |
| v0.3 | Submission detail view + scoring panel with autosave |
| v0.4 | Submit flow + final polish |
| v0.5 | /guide page (Awards 2026 jury guide, brand-locked) + dashboard link 

## Env vars

| Name | Value |
|---|---|
| `AIRTABLE_PAT` | Personal Access Token with `data.records:read+write`, `schema.bases:read` |
| `AIRTABLE_BASE_ID` | `appXKdirVdJb34gdN` |
| `MAGIC_LINK_BASE` | `https://evaluate.fab.city` |
| `JWT_SECRET` | 64-byte hex random string |

## Generating a magic link

After deployment:

```bash
JWT_SECRET=<value> MAGIC_LINK_BASE=https://evaluate.fab.city \
  npm run gen:link -- recXXXXXXXXXXXXXX
```

Outputs a URL that authenticates the evaluator with that People record ID for 30 days.

## Maintainers

- Operations / build: Lucas Marangoni (luc@fab.city)
- Awards program lead: Josefina Nano (josefina@fab.city)
