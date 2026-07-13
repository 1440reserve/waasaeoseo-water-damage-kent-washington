# Kent Water Damage Pros

Marketing website for water damage restoration services in Kent, WA and the
surrounding South King County communities. Fast, statically generated, built
to connect homeowners with a licensed local restoration crew 24/7.

## Stack

- Next.js 16 (App Router, fully static generation)
- Tailwind CSS v4 (CSS-first, four-token brand system)
- next-intl (English now, Spanish-ready)
- Lead form via a serverless route (Resend), with honeypot and fill-time spam defense
- Deployed on Vercel

## Develop

```bash
pnpm install
SITE_ID=kent pnpm dev
```

## Build

```bash
SITE_ID=kent pnpm build
```

`SITE_ID` selects the client config under `clients/`. It defaults to `kent`.

## Environment

Copy `.env.example` to `.env` and fill in the values used by the lead form:

- `RESEND_API_KEY` for outbound lead email
- `LEAD_FROM_EMAIL` and the lead inbox address

The site builds and renders without these; the lead API logs only until they are set.
