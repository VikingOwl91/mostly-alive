# Contributing to Mostly Alive

Thank you for your interest in improving Mostly Alive!

## How to Contribute

1. **Submit a Correction**: Open an issue on GitHub describing the inaccuracy with a direct link to current authoritative guidelines (e.g. ERC 2021, NOAA, NFPA).
2. **Author a New Article**:
   - Create markdown files in `content/articles/en/<slug>.md` and `content/articles/de/<slug>.md`.
   - Ensure all mandatory frontmatter fields in `src/lib/types/content.ts` are populated.
   - Run `pnpm run validate:content` to verify schema and provenance.
3. **Use the Web Studio**: Run `pnpm run dev` and navigate to `/editor` to write and test articles interactively.

## Development Checks

Before opening a pull request, please ensure all automated gates pass:

```bash
pnpm run lint
pnpm run check
pnpm run test
pnpm run validate:content
pnpm run build
```
