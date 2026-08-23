---
slug: 'contributing'
title: 'Contributing & Corrections'
description: 'How to propose new survival articles, report inaccuracies, or improve translations'
last_updated: '2026-08-23'
---

### How to Contribute

Mostly Alive is an open-source collaborative knowledge base. We welcome contributions from paramedics, firefighters, engineers, meteorologists, translators, and observant humans.

### 1. Reporting an Inaccuracy or Correction

If an article contains an outdated recommendation or factual error:

- Open an Issue on [GitHub](https://github.com/VikingOwl91/mostly-alive/issues).
- Provide the article slug, the outdated text, and a direct link to the current authoritative primary source or guideline.

### 2. Proposing a New Article

New articles must meet the following criteria before publication:

1. **Unambiguous Primary Source**: Must cite at least one official agency, medical college, or standardisation body (NOAA, ERC, NFPA, BBK, etc.).
2. **Distinct Danger Profile**: Focuses on high-consequence, rare-but-important everyday situations where human instinct is typically wrong or dangerous.
3. **Structured Frontmatter**: Must include valid Zod schema fields (`slug`, `category`, `threat_level`, `immediate_action`, `do_not`, `memory_hook`, `sources`).
4. **Bilingual Parity**: Submissions should ideally provide both English (`/content/articles/en/`) and German (`/content/articles/de/`) texts.

### 3. Using the Web Studio

You can draft and validate articles locally using the built-in [Web Studio](/editor). The studio provides real-time schema validation, source checking, and live preview rendering.
