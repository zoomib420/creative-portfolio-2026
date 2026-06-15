import sharp from 'sharp';

// Branded Open Graph card (1200×630). Latin-only text so it renders without
// shipping custom fonts; the cozy tower + rooster carry the brand. Regenerate
// with: node scripts/generate-og.mjs
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="warm" cx="30%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#ffe7b8"/>
      <stop offset="100%" stop-color="#fdf3e7"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#warm)"/>
  <ellipse cx="950" cy="560" rx="190" ry="26" fill="#000000" opacity="0.08"/>

  <!-- text block -->
  <text x="90" y="170" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="6" fill="#9b8b7b">PORTFOLIO · 2026</text>
  <text x="86" y="300" font-family="Arial, Helvetica, sans-serif" font-size="140" font-weight="800" fill="#ff9a62">ZOOM</text>
  <text x="90" y="372" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="700" fill="#4a3f37">AI-Powered Builder</text>
  <text x="90" y="448" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400" fill="#6b5d50">Tell me what you want — I'll build it.</text>
  <text x="90" y="490" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400" fill="#6b5d50">Web · App · Games · Automation, powered by AI.</text>

  <!-- rooster on the roof -->
  <g transform="translate(956 96)">
    <ellipse cx="-28" cy="14" rx="20" ry="26" fill="#56c2b0"/>
    <circle cx="0" cy="18" r="30" fill="#fffaf2" stroke="#e7d4bf" stroke-width="2"/>
    <circle cx="20" cy="-2" r="17" fill="#fffaf2" stroke="#e7d4bf" stroke-width="2"/>
    <rect x="14" y="-26" width="16" height="12" rx="4" fill="#ff4a4a"/>
    <path d="M34 -4 L52 2 L34 8 Z" fill="#ffb13b"/>
    <circle cx="26" cy="-4" r="3.4" fill="#3a322b"/>
  </g>

  <!-- tower -->
  <rect x="838" y="150" width="266" height="30" rx="9" fill="#ffd479"/>
  <rect x="858" y="178" width="226" height="372" rx="16" fill="#f3e2c8" stroke="#caa57f" stroke-width="3"/>
  <g>
    <rect x="916" y="206" width="110" height="40" rx="6" fill="#ffd479"/>
    <rect x="916" y="280" width="110" height="40" rx="6" fill="#56c2b0"/>
    <rect x="916" y="354" width="110" height="40" rx="6" fill="#ff9a62"/>
    <rect x="916" y="428" width="110" height="40" rx="6" fill="#c7a6e6"/>
    <rect x="916" y="500" width="110" height="34" rx="6" fill="#7fd093"/>
  </g>
  <rect x="852" y="244" width="238" height="6" rx="3" fill="#caa57f" opacity="0.6"/>
  <rect x="852" y="318" width="238" height="6" rx="3" fill="#caa57f" opacity="0.6"/>
  <rect x="852" y="392" width="238" height="6" rx="3" fill="#caa57f" opacity="0.6"/>
  <rect x="852" y="466" width="238" height="6" rx="3" fill="#caa57f" opacity="0.6"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('wrote public/og-image.png');
