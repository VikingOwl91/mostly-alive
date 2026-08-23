# Mostly Alive

> A practical guide to remaining so.

Human civilisation has existed for several thousand years and has, somewhat surprisingly, still not shipped a particularly good user manual.

**Mostly Alive** is an open-source, web-first safety and survival knowledge base that teaches rare-but-vital emergency knowledge through memorable, dry, absurdist humor with strictly verified, authoritative emergency instructions.

The jokes are optional. The safety information is not.

---

## Key Architectural Principles

1. **Safety Layer Supremacy**: Emergency instructions are prioritized above humorous commentary. Critical actions appear in high-contrast boxes at the top of every guide.
2. **Strict Provenance & Empirical Verification**: Every actionable claim is traceable to official statutory bodies or medical consensus (ERC, NOAA, NFPA, BBK, CDC, DWD, DGUV). Zero invented citations.
3. **Bilingual (EN / DE)**: Full native English and German content parity with synchronized review cycles.
4. **Offline & Fast**: Zero-database static/edge deployment on Cloudflare Workers, pre-indexed client-side fuzzy search, and PWA caching for emergency basics.
5. **Integrated Web Studio**: Built-in `/editor` for drafting, schema validation, and GitHub pull request workflows.

---

## Tech Stack

- **Framework**: [SvelteKit 2](https://kit.svelte.dev/) with Svelte 5 runes
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Content & Validation**: Markdown with [Zod](https://zod.dev/) frontmatter schema validation
- **Search**: [MiniSearch](https://lucaong.github.io/minisearch/) client-side fuzzy index
- **Hosting**: [Cloudflare Workers](https://workers.cloudflare.com/) via `@sveltejs/adapter-cloudflare`
- **Testing**: [Vitest](https://vitest.dev/)

---

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/VikingOwl91/mostly-alive.git
cd mostly-alive

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## Content Validation & Tests

To validate that all articles conform to the Zod content schema and provenance rules:

```bash
# Validate content schema and source URLs
pnpm run validate:content

# Run TypeScript typechecks
pnpm run check

# Run Vitest test suites
pnpm run test

# Build for Cloudflare production
pnpm run build
```

---

## Licenses

- **Software**: [MIT License](LICENSE)
- **Content & Text**: [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
