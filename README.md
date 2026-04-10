# ARTHOUSE — Onchain Art Intelligence on Base & Zora

> The intelligence layer for onchain art. Score creators, discover builders, and find talent on Base and Zora before everyone else.

---

## Overview

**Arthouse** is an AI-powered onchain art intelligence platform built on Base and Zora. It separates real builders from flippers using a 5-dimension creator scoring system, surfacing talent before the crowd finds it.

The platform is powered by the **$ARTHOUSE** token and the **@arthousexbt** Telegram bot — an always-on intelligence agent that analyzes creators, detects red flags, and curates the best builders in the ecosystem.

---

## Features

### Creator Scoring System
A rigorous 5-dimension scoring model (0–100):
1. **Profile & Identity** (25 pts) — wallet age, bio completeness, consistency of online presence
2. **Content Consistency** (25 pts) — posting cadence, thematic coherence, series progression
3. **Currently Building** (30 pts) — active work-in-progress signals, Farcaster engagement
4. **Early Traction** (20 pts) — organic collector growth, mint velocity, community response

### @arthousexbt Bot
An AI agent on Telegram that provides:
- Full creator scoring reports on demand
- Red flag detection ("is this legit?")
- Weekly top builders roundup on Zora
- Builder vs flipper classification
- Collection intelligence on drops and coins

### Featured Builders
Weekly curated list of the highest-scoring creators on Base and Zora, updated by the Arthouse intelligence layer.

### $ARTHOUSE Token
A utility token on Base that unlocks:
- Unlimited bot analysis (vs. limited free tier)
- Early alerts on high-scoring creators
- Weekly builders report
- Curated watchlists
- Early access to new features

**Contract Address:** `0xd3216582e3e31578e01b7fd8eda6de969f3658ce`
**Network:** Base
**[View on DexScreener](https://dexscreener.com/base/0xd3216582e3e31578e01b7fd8eda6de969f3658ce)**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Custom CSS (no framework dependency) |
| Fonts | Bebas Neue, Syne, DM Mono, DM Sans, Space Grotesk |
| Token Data | DexScreener API (live, 30s refresh) |
| Routing | Wouter |
| Animations | CSS keyframes + IntersectionObserver |
| Monorepo | pnpm workspaces |
| Language | TypeScript |

---

## Project Structure

```
artifacts/arthouse/
├── src/
│   ├── pages/
│   │   └── Landing.tsx      # Full landing page component
│   ├── App.tsx              # Router setup
│   ├── index.css            # All styles (mobile-first)
│   └── main.tsx             # Entry point
├── index.html               # SEO-optimized HTML with structured data
├── vite.config.ts
└── package.json
```

---

## SEO Implementation

The site includes full SEO coverage:

- **Title & meta description** — optimized for "onchain art intelligence", "Base NFT", "Zora creator scoring"
- **Open Graph** — full og: tags for social sharing (title, description, image, type, locale)
- **Twitter Card** — `summary_large_image` format
- **Canonical URL** — prevents duplicate content issues
- **JSON-LD Structured Data** — three schemas:
  - `Organization` — Arthouse entity with all social channels
  - `WebSite` — with SearchAction potential action
  - `SoftwareApplication` — for the @arthousexbt bot
- **robots meta** — `index, follow`
- **Theme color** — dark navy matching brand

---

## Official Links

| Platform | URL |
|----------|-----|
| X (Twitter) | [@arthousebase](https://x.com/arthousebase) |
| Telegram Bot | [@arthousexbt_bot](https://t.me/arthousexbt_bot) |
| Zora | [zora.co/arthousebase](https://zora.co/arthousebase) |
| Base App | [base.app/profile/arthouse](https://base.app/profile/arthouse) |
| Instagram | [@arthousebase](https://www.instagram.com/arthousebase) |
| TikTok | [@arthousebase](https://www.tiktok.com/@arthousebase) |
| DexScreener | [View Chart](https://dexscreener.com/base/0xd3216582e3e31578e01b7fd8eda6de969f3658ce) |

---

## Mobile Compatibility

Full mobile-first responsive design:
- **Navigation**: Hamburger menu with full-screen overlay on mobile
- **Hero**: Droid scales from 560px (desktop) → 360px (tablet) → 260px (mobile)
- **Grids**: 3-column → 1-column on mobile for features, creators, social cards
- **Token section**: 2-column → 1-column stacked on tablet/mobile
- **Bot section**: Side-by-side → stacked vertically on mobile
- **Touch support**: Droid click/scan works on touch devices
- **Idle animations**: Droid eyes oscillate on mobile (no mouse tracking)
- **Tap highlight**: Removed on all interactive elements (`-webkit-tap-highlight-color: transparent`)

---

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm --filter @workspace/arthouse run dev

# Build for production
pnpm --filter @workspace/arthouse run build

# Type check
pnpm --filter @workspace/arthouse run typecheck
```

---

## GitHub Deployment

To deploy to GitHub Pages or connect a custom domain:

1. Build: `pnpm --filter @workspace/arthouse run build`
2. Output is in `artifacts/arthouse/dist/public/`
3. Deploy the `dist/public/` folder to any static host

For GitHub Actions deployment, connect your GitHub token in the Replit integrations panel.

---

## License

© 2026 Arthouse. All rights reserved.

> ONCHAIN FOREVER
