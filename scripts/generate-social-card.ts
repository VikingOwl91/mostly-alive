import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SVG_CARD = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070a" />
      <stop offset="50%" stop-color="#07090e" />
      <stop offset="100%" stop-color="#0a0f18" />
    </linearGradient>

    <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Technical Grid overlay -->
  <g opacity="0.04" stroke="#ffffff" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="500" y1="0" x2="500" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="700" y1="0" x2="700" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
    <line x1="1100" y1="0" x2="1100" y2="630" />
    
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="0" y1="600" x2="1200" y2="600" />
  </g>

  <!-- Glowing Corner Bezel Border -->
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="none" stroke="#1e293b" stroke-width="2" />
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.3" />

  <!-- Corner Accents -->
  <path d="M 40 80 L 40 40 L 80 40" fill="none" stroke="#f59e0b" stroke-width="4" />
  <path d="M 1120 40 L 1160 40 L 1160 80" fill="none" stroke="#06b6d4" stroke-width="4" />
  <path d="M 40 550 L 40 590 L 80 590" fill="none" stroke="#06b6d4" stroke-width="4" />
  <path d="M 1120 590 L 1160 590 L 1160 550" fill="none" stroke="#f59e0b" stroke-width="4" />

  <!-- Top System Header -->
  <g transform="translate(80, 85)">
    <rect x="0" y="0" width="340" height="34" rx="17" fill="#032b30" stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.6" />
    <circle cx="20" cy="17" r="5" fill="#06b6d4" />
    <text x="36" y="22" fill="#67e8f9" font-family="monospace" font-size="13" font-weight="bold" letter-spacing="2">FIELD MANUAL // DISCOVERY</text>

    <!-- Right Header Tag -->
    <text x="960" y="22" text-anchor="end" fill="#94a3b8" font-family="monospace" font-size="13" font-weight="bold" letter-spacing="2">50 GUIDES • EN / DE</text>
  </g>

  <!-- Main Branding Section -->
  <g transform="translate(80, 220)">
    <!-- Big Headline -->
    <text x="0" y="0" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="900" letter-spacing="-1">MOSTLY ALIVE</text>
    
    <!-- Accent Line -->
    <rect x="0" y="24" width="220" height="6" rx="3" fill="url(#amberGlow)" />

    <!-- Subtitle / Tagline -->
    <text x="0" y="85" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="700">
      Rare knowledge. Bad situations. Useful instructions.
    </text>

    <text x="0" y="135" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400">
      A source-backed, dryly humorous survival handbook for life-threatening emergencies.
    </text>
  </g>

  <!-- Footer Meta Tags -->
  <g transform="translate(80, 520)">
    <rect x="0" y="0" width="1040" height="42" rx="8" fill="#0b1120" stroke="#1e293b" stroke-width="1" />
    
    <text x="24" y="26" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="bold" letter-spacing="1">DOMAINS:</text>
    <text x="110" y="26" fill="#cbd5e1" font-family="monospace" font-size="13" letter-spacing="1">MEDICAL • WEATHER • ELECTRICAL • WATER • FIRE • VEHICLES</text>
    
    <text x="1016" y="26" text-anchor="end" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">mostly-alive.nachtigall.dev</text>
  </g>
</svg>`;

async function generate() {
  const targetPath = path.resolve('static/social-card.png');
  const buffer = Buffer.from(SVG_CARD);
  
  await sharp(buffer)
    .resize(1200, 630)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(targetPath);

  const stats = fs.statSync(targetPath);
  console.log(`✅ Generated static/social-card.png (${stats.size} bytes, 1200x630)`);
}

generate().catch(console.error);
