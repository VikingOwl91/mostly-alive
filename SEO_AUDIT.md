# SEO & Discoverability Audit — Mostly Alive

**Audit Date**: August 23, 2026  
**Audited Target**: Production (`https://mostly-alive.christian-d81.workers.dev`) & Codebase  
**Auditor**: Antigravity AI (Pair Programming Safety & SEO Specialist)  
**Status**: AUDIT COMPLETE — Awaiting Pass 2 Implementation Approval  

---

## Executive Summary

| Metric | Assessment |
|---|---|
| **Overall SEO Health Rating** | **Needs Work** |
| **Indexability & SSR** | **Excellent** (100% SSR, server-rendered markdown & immediate actions, zero client-only content gates) |
| **Semantic HTML & Structure** | **Good** (Single `<h1>` per page, clean `<h2>`/`<h3>` hierarchy, proper HTML5 landmarks) |
| **International SEO (EN/DE)** | **Needs Work** (Missing `hreflang`, missing canonicals, `<html lang="en">` hardcoded on German pages) |
| **Search Infrastructure** | **Significant Problems** (No `robots.txt` bot directives, `sitemap.xml` returns 404, no OpenGraph/Twitter tags, no JSON-LD) |
| **YMYL / Safety Transparency** | **Good** (SourceInspector, explicit guideline versions, reviewed dates, editorial policies present) |

### Verdict

Mostly Alive possesses an exceptionally solid architectural foundation: **100% server-side rendered HTML** on Cloudflare Workers, instant edge delivery (~20–40ms TTFB), strict frontmatter schemas, a clean 1:1 bilingual slug structure across all 50 guides, and rich provenance metadata.

However, the site currently lacks fundamental technical SEO infrastructure:
1. **Missing `sitemap.xml`** (returns HTTP 404).
2. **Missing bot directives in `robots.txt`** (serves generic Cloudflare AI copyright text with no `User-agent`, `Allow`, `Disallow`, or `Sitemap` lines).
3. **No canonical URLs** (`<link rel="canonical">` is absent across all pages).
4. **No `hreflang` tags** (search engines cannot formally detect EN $\leftrightarrow$ DE translations).
5. **Hardcoded `<html lang="en">`** on all German pages (`/de/*`).
6. **Zero structured data** (no JSON-LD for `WebSite`, `Article`, `Organization`, or `BreadcrumbList`).
7. **No OpenGraph / Twitter social card metadata**.

None of these issues require rewriting the site's voice or compromising human-first design. All problems can be resolved through pure metadata, infrastructure endpoints, and non-destructive layout enhancements in a focused Pass 2.

---

## Critical Findings

### Finding C1: Missing Search Engine Directives in `robots.txt` & Missing `sitemap.xml`
- **Problem**: `/sitemap.xml` returns HTTP 404. `/robots.txt` contains no crawler directives, no `User-agent: *`, no `Disallow` rules for private endpoints (`/editor/`, `/api/`), and no `Sitemap:` pointer.
- **Evidence**:
  - Live probe `GET /sitemap.xml` $\rightarrow$ `HTTP 404 (text/html)`.
  - Live probe `GET /robots.txt` $\rightarrow$ Returns Cloudflare AI content-signal notice with no search robot instructions.
- **Affected Routes**: Entire domain (`/*`).
- **Impact**: Crawlers must discover 100+ deep article, category, and static pages solely by link traversal, risking incomplete indexing and unindexed updates. Internal `/editor/*` routes risk being crawled.
- **Recommended Fix**:
  - Add a static or dynamic `robots.txt` with standard search directives:
    ```txt
    User-agent: *
    Allow: /
    Disallow: /editor/
    Disallow: /api/
    Disallow: /*/random$

    Sitemap: https://mostly-alive.christian-d81.workers.dev/sitemap.xml
    ```
  - Implement a dynamic SvelteKit endpoint `/sitemap.xml/+server.ts` that generates an XML sitemap covering all EN and DE pages with `<xhtml:link rel="alternate" hreflang="..." />` tags and `<lastmod>` timestamps derived from article `reviewed_at`.

---

### Finding C2: Missing Canonical URLs & Missing `hreflang` Alternates
- **Problem**: No pages output `<link rel="canonical">` or `<link rel="alternate" hreflang="...">`.
- **Evidence**:
  - `<head>` inspection on `/en/guide/hair-suddenly-vertical` and `/de/guide/hair-suddenly-vertical` contains 0 canonical and 0 hreflang tags.
- **Affected Routes**: All routes (`/en/*`, `/de/*`).
- **Impact**: Search engines may struggle to identify the authoritative URL, especially with trailing slash variations or query parameters (e.g. `?ref=...`). Crucially, without `hreflang`, Google cannot map English and German versions of the same article, risking misattribution or duplicate content flags in international search results.
- **Recommended Fix**:
  - In `src/routes/[lang]/+layout.svelte` (or a dedicated SEO head helper), inject:
    ```html
    <link rel="canonical" href="https://mostly-alive.christian-d81.workers.dev{canonicalPath}" />
    <link rel="alternate" hreflang="en" href="https://mostly-alive.christian-d81.workers.dev/en{relativePath}" />
    <link rel="alternate" hreflang="de" href="https://mostly-alive.christian-d81.workers.dev/de{relativePath}" />
    <link rel="alternate" hreflang="x-default" href="https://mostly-alive.christian-d81.workers.dev/en{relativePath}" />
    ```

---

### Finding C3: Hardcoded `<html lang="en">` on German Pages
- **Problem**: `src/app.html` sets `<html lang="en">` statically. German routes (`/de/*`) render with `lang="en"`.
- **Evidence**:
  - Live probe `GET /de/guide/hair-suddenly-vertical` $\rightarrow$ `<html lang="en" class="dark ...">`.
- **Affected Routes**: All German pages (`/de`, `/de/guide`, `/de/guide/*`, `/de/categories/*`, `/de/emergency`, etc.).
- **Impact**: Screen readers mispronounce German text using English phonetics; search engines receive contradictory language signals (HTML says English, text is German).
- **Recommended Fix**:
  - In `src/app.html`, replace `lang="en"` with `%lang%`.
  - In `src/hooks.server.ts`, use `transformPageChunk` to dynamically replace `%lang%` with `event.params.lang || 'en'`.

---

### Finding C4: Lack of `noindex` on Web Studio & Random Entry Utility
- **Problem**: `/editor/login` and `/en/random` do not include `<meta name="robots" content="noindex, nofollow">`.
- **Evidence**:
  - `GET /editor/login` renders `<title>Restricted Access — Mostly Alive Web Studio</title>` with default indexing status.
  - `GET /en/random` renders the interactive random picker without `noindex` or canonical guidance.
- **Affected Routes**: `/editor/login`, `/editor/*`, `/[lang]/random`.
- **Impact**: Administrative login screens and random utility wrappers can enter public search engine indexes as low-quality or thin content.
- **Recommended Fix**:
  - Add `<meta name="robots" content="noindex, nofollow" />` to `src/routes/editor/+layout.svelte` (or login page).
  - Add `<meta name="robots" content="noindex, follow" />` to `src/routes/[lang]/random/+page.svelte` (or redirect `/random` via 307 directly to a chosen article).

---

## High-Value Improvements

### Improvement H1: Complete OpenGraph and Twitter Card Metadata
- **Problem**: Pages lack `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:site_name`, `og:locale`, and `twitter:card`.
- **Impact**: Links shared on Discord, Slack, iMessage, Twitter/X, and WhatsApp render with generic or blank link previews rather than rich summary cards.
- **Recommended Fix**:
  - Add standardized OpenGraph tags to all layouts and pages:
    - `og:site_name`: `Mostly Alive`
    - `og:locale`: `en_US` (on `/en/*`) and `de_DE` (on `/de/*`)
    - `og:image`: Default brand card (`/logo.png` or dedicated social card)
    - `og:type`: `article` on guides, `website` on indexes
    - `twitter:card`: `summary_large_image`

---

### Improvement H2: Structured Data (JSON-LD) Implementation
- **Problem**: 0 JSON-LD schema blocks exist on the live site.
- **Impact**: Search engines cannot generate rich snippets (article dates, breadcrumbs, site search).
- **Recommended Fix**:
  - **`WebSite` Schema** (Homepage):
    - Name: `Mostly Alive`
    - URL: `https://mostly-alive.christian-d81.workers.dev`
    - InLanguage: `en` / `de`
    - Description: Practical survival and emergency knowledge base.
  - **`Article` Schema** (Guide Pages `/[lang]/guide/[slug]`):
    - `headline`: Article title
    - `description`: Article subtitle / memory hook
    - `datePublished` / `dateModified`: From `reviewed_at` frontmatter
    - `inLanguage`: `en` / `de`
    - `mainEntityOfPage`: Full canonical URL
    - `publisher`: `{"@type": "Organization", "name": "Mostly Alive", "url": "https://mostly-alive.christian-d81.workers.dev"}`
  - **`BreadcrumbList` Schema** (Guides & Categories):
    - Formally defines the hierarchy: `Home > Handbook > [Category] > [Article]`.

---

### Improvement H3: Missing Meta Descriptions on Directory & Category Pages
- **Problem**: Meta descriptions are missing on `/[lang]/guide`, `/[lang]/categories`, `/[lang]/categories/[category]`, and `/[lang]/random`.
- **Impact**: Search result snippets for category and handbook listing pages are dynamically generated from miscellaneous UI strings.
- **Recommended Fix**:
  - Add curated bilingual meta descriptions for all directory and category pages:
    - Guide Index EN: `"Browse all 50 evidence-backed survival guides, emergency protocols, and hazard mitigation instructions."`
    - Guide Index DE: `"Alle 50 quellenbasierten Überlebensleitfäden, Notfallprotokolle und Handlungsanweisungen im Überblick."`
    - Category Pages: `"Emergency survival guides and safety protocols for ${category.title} hazards."`

---

### Improvement H4: Semantic Breadcrumbs & Internal Relationship Linking
- **Problem**: Guide pages (`/[lang]/guide/[slug]`) lack visible breadcrumbs and do not link to related articles in the same category.
- **Impact**: Users and crawlers have single-path navigation back to `/guide` without horizontal inter-article linking.
- **Recommended Fix**:
  - Add an accessible `<nav aria-label="Breadcrumb">` on guide pages: `Handbook / {Category} / {Title}`.
  - Add a 2–3 card "Related Survival Guides" section at the footer of each guide (e.g. other guides within the same category or related threat level).

---

## Nice-to-Have Improvements

### Improvement N1: Root `/` Redirection Status Code
- **Observation**: `GET /` issues an HTTP `307 Temporary Redirect` to `/en`.
- **Recommendation**: In a production environment with a fixed primary default language, consider `308 Permanent Redirect` (or language-negotiated redirect) so crawlers consolidate domain authority onto `/en`.

### Improvement N2: Font Loading Optimization
- **Observation**: Google Fonts (`JetBrains Mono`, `Plus Jakarta Sans`) are loaded from `fonts.googleapis.com` with `preconnect`.
- **Recommendation**: Ensure `display=swap` is preserved and evaluate self-hosting font files in `static/fonts/` to eliminate external DNS/TLS lookups during first paint.

### Improvement N3: Dynamic Social Preview Image Generation
- **Observation**: Currently `/logo.png` is the sole raster image asset.
- **Recommendation**: Create category-specific or automated SVG/PNG social sharing cards with the threat gauge badge and title for rich previews.

---

## Things Already Done Well

Explicitly preserving these strong existing implementations is critical:

1. **100% Server-Side Rendering (SSR)**:
   - All article bodies, immediate actions, memory hooks, source tables, and emergency cards render directly into the initial HTML response.
   - Crawlers receive full, un-obfuscated content without needing JavaScript execution.

2. **Clean Single-`<h1>` Semantic Hierarchy**:
   - Every page has exactly one `<h1>`.
   - Markdown headers inside article bodies consistently render as `<h3>` beneath the primary `<h2>` action sections, preserving document outline validity.

3. **1:1 Bilingual Slug Symmetry**:
   - Because English and German articles share identical slugs (`/en/guide/hair-suddenly-vertical` $\leftrightarrow$ `/de/guide/hair-suddenly-vertical`), generating programmatic `hreflang`, canonicals, and language pickers is trivial and robust.

4. **Human-First Memorability & Subtitle Semantics**:
   - The memorable titles (*"Hair, Suddenly Vertical"*, *"Blood Sugar Has Left the Chat"*) are paired with descriptive, technical, search-friendly `subtitle` fields that already exist in frontmatter.
   - We do **not** need to compromise human-facing titles to achieve high search discoverability.

5. **Strict Provenance & Trust UI**:
   - `SourceInspector` cleanly documents institutional sources, guideline versions, jurisdictions, and review dates directly on the page.
   - Trust Center sub-navigation (`methodology`, `sources`, `editorial-policy`, `disclaimer`, `terms`, `privacy`) is accessible across all static pages.

---

## YMYL / Trust Assessment

Because Mostly Alive provides life-safety and first-aid instructions, search engines (specifically Google's Quality Rater Guidelines for YMYL) evaluate transparency, provenance, and accuracy rigor.

### What is Already Strong:
- **Transparent Sourcing**: Citations reference established international bodies (ERC, AHA, NOAA, VDE, Wilderness Medical Society) with explicit publication editions.
- **Provenance Attributes**: Articles declare `reviewed_at`, `review_due`, and `reviewer`.
- **Clear Limitations**: Explicit disclaimers state that Mostly Alive is a rapid-recall handbook, not a substitute for professional dispatch or medical advice.
- **Correction Mechanism**: Prominent footer link inviting feedback on outdated guidelines with a published editorial corrections policy.

### What is Missing / Gaps:
- Search engine crawlers cannot read provenance through structured data because no `Article` / `isBasedOn` JSON-LD exists.
- The `sources` and `methodology` pages are not formally linked to article entities in schema.

### What Would Genuinely Improve Trust:
- Adding `reviewed_at` as `dateModified` in `Article` JSON-LD.
- Referencing primary source URLs in `citation` / `isBasedOn` fields in structured data.
- Maintaining the existing policy: **Never fabricate fake medical reviewer credentials or manufactured authority claims.** Transparent editorial synthesis of public authoritative guidelines is legitimate and honest.

---

## Route Indexing Matrix

| Route Pattern | Purpose | Index? | Follow? | Canonical Strategy | Sitemap? |
|---|---|:---:|:---:|---|:---:|
| `/` | Root Language Redirect | No (Redirect) | Yes | N/A (307/308 $\rightarrow$ `/en`) | No |
| `/[lang]` | Homepage | **Yes** | Yes | Self (`https://.../[lang]`) | **Yes** |
| `/[lang]/guide` | Handbook Directory | **Yes** | Yes | Self (`https://.../[lang]/guide`) | **Yes** |
| `/[lang]/guide/[slug]` | Survival Guide Article (50 EN + 50 DE) | **Yes** | Yes | Self (`https://.../[lang]/guide/[slug]`) | **Yes** |
| `/[lang]/categories` | Category Directory Index | **Yes** | Yes | Self (`https://.../[lang]/categories`) | **Yes** |
| `/[lang]/categories/[category]` | Individual Category Page | **Yes** | Yes | Self (`https://.../[lang]/categories/[category]`) | **Yes** |
| `/[lang]/emergency` | Emergency Quick-Reference | **Yes** | Yes | Self (`https://.../[lang]/emergency`) | **Yes** |
| `/[lang]/random` | Random Entry Picker | **No** | Yes | Canonical to `/[lang]/guide` or `noindex` | No |
| `/[lang]/[page]` | Trust Center Static Pages (7 EN + 7 DE) | **Yes** | Yes | Self (`https://.../[lang]/[page]`) | **Yes** |
| `/api/*` | JSON APIs (`search-index.json`, etc.) | **No** | No | N/A | No |
| `/editor` | Web Studio Workspace (Auth Required) | **No** | No | `noindex, nofollow` | No |
| `/editor/login` | Web Studio Auth Screen | **No** | No | `noindex, nofollow` | No |
| `/editor/*` | Web Studio OAuth / Endpoints | **No** | No | `noindex, nofollow` | No |

---

## International SEO Assessment

### Bilingual Architecture Summary
- **Current State**: 50 articles in English (`content/articles/en/`), 50 corresponding articles in German (`content/articles/de/`).
- **Path Mapping**: Exact 1:1 parity on slugs (`/[lang]/guide/[slug]`).
- **Status**: The content is completely translated with 100% structural parity.

### Required International Fixes:
1. **Dynamic HTML `lang`**:
   - Update `src/hooks.server.ts` to replace `%lang%` in `app.html` with `de` for German routes and `en` for English routes.
2. **Bidirectional `hreflang` Links**:
   - On every English page:
     ```html
     <link rel="alternate" hreflang="en" href="https://mostly-alive.christian-d81.workers.dev/en/..." />
     <link rel="alternate" hreflang="de" href="https://mostly-alive.christian-d81.workers.dev/de/..." />
     <link rel="alternate" hreflang="x-default" href="https://mostly-alive.christian-d81.workers.dev/en/..." />
     ```
   - On every German page: identical set pointing to corresponding URLs.
3. **Sitemap Alternate Language Extensions**:
   - The generated XML sitemap should include `<xhtml:link rel="alternate" hreflang="..." href="..." />` tags for every entry.

---

## Structured Data Plan

Only schemas providing genuine semantic value and reflecting verified site data are included:

### 1. `WebSite` Schema
- **Target**: `/[lang]` (Homepage)
- **Data Source**: Site branding and language parameter.
- **Fields**:
  - `@type`: `WebSite`
  - `name`: `Mostly Alive`
  - `url`: `https://mostly-alive.christian-d81.workers.dev/[lang]`
  - `inLanguage`: `en` / `de`
  - `description`: Site tagline.

### 2. `Article` Schema
- **Target**: `/[lang]/guide/[slug]` (All 100 guide articles)
- **Data Source**: Frontmatter metadata (`title`, `subtitle`, `reviewed_at`, `status`, `sources`, `category`).
- **Fields**:
  - `@type`: `Article`
  - `headline`: `{article.title}`
  - `description`: `{article.subtitle}`
  - `inLanguage`: `{lang}`
  - `dateModified`: `{article.reviewed_at}`
  - `mainEntityOfPage`: Canonical URL
  - `articleSection`: `{article.category}`
  - `publisher`: `{"@type": "Organization", "name": "Mostly Alive", "url": "https://mostly-alive.christian-d81.workers.dev"}`

### 3. `BreadcrumbList` Schema
- **Target**: `/[lang]/guide/[slug]` and `/[lang]/categories/[category]`
- **Data Source**: URL path structure and category titles.
- **Fields**:
  - Step 1: `Home` (`/[lang]`)
  - Step 2: `Handbook` (`/[lang]/guide`)
  - Step 3: `Category` (`/[lang]/categories/[category]`)
  - Step 4: `Article Title` (`/[lang]/guide/[slug]`)

---

## Pass 2 Implementation Plan

### P0 — Fix Before Further SEO Work (Correctness & Indexing Core)
- [ ] **Dynamic HTML `lang` Attribute**: Replace hardcoded `lang="en"` in `src/app.html` with `%lang%` resolved dynamically in `src/hooks.server.ts`.
- [ ] **Canonical URL Tag Injection**: Add canonical tag helper to root layout rendering full canonical URLs for all routes.
- [ ] **Bilingual `hreflang` Alternates**: Add `hreflang="en"`, `hreflang="de"`, and `hreflang="x-default"` links on all pages.
- [ ] **Robots Directives**:
  - Add standard `static/robots.txt` allowing general crawling while disallowing `/editor/`, `/api/`, and `/random`.
  - Add `<meta name="robots" content="noindex, nofollow" />` to Web Studio routes and `/random`.
- [ ] **XML Sitemap Endpoint**: Implement `src/routes/sitemap.xml/+server.ts` generating full XML index of all 100 guides, category pages, emergency pages, and static Trust Center pages with `<xhtml:link>` alternates.

---

### P1 — High-Value Discoverability & Metadata Improvements
- [ ] **OpenGraph & Twitter Cards**: Add standard social preview tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`) across all layouts.
- [ ] **Missing Meta Descriptions**: Add curated meta descriptions to `/[lang]/guide`, `/[lang]/categories`, and `/[lang]/categories/[category]`.
- [ ] **Structured Data (JSON-LD)**: Implement `WebSite`, `Article`, and `BreadcrumbList` schemas in `src/lib/components/JsonLd.svelte` (or head tags).
- [ ] **Visible Semantic Breadcrumbs**: Add `<nav aria-label="Breadcrumb">` on guide article pages.

---

### P2 — Polish & Enhancements
- [ ] **Related Guides Section**: Add a 2–3 card related-articles section at the base of each guide within the same category.
- [ ] **Root `/` Redirect Consolidation**: Update `src/routes/+page.server.ts` to `308` redirect to `/en`.
- [ ] **Automated SEO Tests**: Add test assertions in `tests/seo-metadata.test.ts` verifying canonicals, hreflang, and JSON-LD validity.

---

**Audit completed successfully. No production code, components, or content files were modified.**
