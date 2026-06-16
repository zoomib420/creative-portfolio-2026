import sharp from 'sharp';

// Branded Open Graph card. Isometric "toy building" with shaded faces for
// depth + a rooster on the roof, rendered at 2× (2400×1260) for crispness.
// Latin-only text so it renders without shipping custom fonts.
// Regenerate with:  npm i -D sharp  &&  node scripts/generate-og.mjs
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1260" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="28%" cy="-5%" r="95%">
      <stop offset="0%" stop-color="#ffe7b6"/>
      <stop offset="100%" stop-color="#fdf3e7"/>
    </radialGradient>
    <linearGradient id="front" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8e9d2"/>
      <stop offset="100%" stop-color="#eedcbe"/>
    </linearGradient>
    <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffdc8a"/>
      <stop offset="100%" stop-color="#ffce6a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="965" cy="300" r="300" fill="#ffe3a8" opacity="0.45"/>
  <ellipse cx="958" cy="585" rx="205" ry="26" fill="#5a4636" opacity="0.14"/>

  <!-- sparkles -->
  <circle cx="690" cy="120" r="5" fill="#ffd479"/>
  <circle cx="640" cy="470" r="4" fill="#56c2b0"/>
  <circle cx="1140" cy="250" r="4" fill="#ff9a62"/>
  <circle cx="740" cy="540" r="5" fill="#c7a6e6"/>

  <!-- text -->
  <text x="90" y="160" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="7" fill="#9b8b7b">PORTFOLIO · 2026</text>
  <text x="86" y="296" font-family="Arial, Helvetica, sans-serif" font-size="140" font-weight="800" fill="#ff9a62">ZOOM</text>
  <rect x="92" y="314" width="332" height="9" rx="4" fill="#ff9a62" opacity="0.85"/>
  <text x="90" y="392" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="700" fill="#4a3f37">AI-Powered Builder</text>
  <text x="90" y="458" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="400" fill="#6b5d50">Tell me what you want — I'll build it.</text>
  <text x="90" y="498" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="400" fill="#6b5d50">Web · App · Games · Automation, powered by AI.</text>

  <!-- isometric tower: right (shadow) + top (roof) + front (lit) faces -->
  <polygon points="1052,190 1110,156 1110,528 1052,562" fill="#e2c9a3" stroke="#c9a57c" stroke-width="2.5" stroke-linejoin="round"/>
  <polygon points="842,190 900,156 1110,156 1052,190" fill="url(#roof)" stroke="#c9a57c" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="842" y="190" width="210" height="372" fill="url(#front)" stroke="#c9a57c" stroke-width="2.5"/>

  <!-- floor trim lines -->
  <g stroke="#c9a57c" stroke-width="2" opacity="0.35">
    <line x1="842" y1="264" x2="1052" y2="264"/>
    <line x1="842" y1="338" x2="1052" y2="338"/>
    <line x1="842" y1="413" x2="1052" y2="413"/>
    <line x1="842" y1="487" x2="1052" y2="487"/>
  </g>

  <!-- lit windows with offset shadow + top gloss for depth -->
  <g>
    <rect x="887" y="210" width="126" height="40" rx="7" fill="#000000" opacity="0.16"/>
    <rect x="884" y="207" width="126" height="40" rx="7" fill="#ffd479"/>
    <rect x="884" y="207" width="126" height="13" rx="7" fill="#ffffff" opacity="0.28"/>

    <rect x="887" y="284" width="126" height="40" rx="7" fill="#000000" opacity="0.16"/>
    <rect x="884" y="281" width="126" height="40" rx="7" fill="#56c2b0"/>
    <rect x="884" y="281" width="126" height="13" rx="7" fill="#ffffff" opacity="0.28"/>

    <rect x="887" y="359" width="126" height="40" rx="7" fill="#000000" opacity="0.16"/>
    <rect x="884" y="356" width="126" height="40" rx="7" fill="#ff9a62"/>
    <rect x="884" y="356" width="126" height="13" rx="7" fill="#ffffff" opacity="0.28"/>

    <rect x="887" y="433" width="126" height="40" rx="7" fill="#000000" opacity="0.16"/>
    <rect x="884" y="430" width="126" height="40" rx="7" fill="#c7a6e6"/>
    <rect x="884" y="430" width="126" height="13" rx="7" fill="#ffffff" opacity="0.28"/>

    <rect x="887" y="508" width="126" height="38" rx="7" fill="#000000" opacity="0.16"/>
    <rect x="884" y="505" width="126" height="38" rx="7" fill="#7fd093"/>
    <rect x="884" y="505" width="126" height="13" rx="7" fill="#ffffff" opacity="0.28"/>
  </g>

  <!-- rooster on the rooftop (facing left) -->
  <g transform="translate(978 156)">
    <path d="M24 -6 L52 -26 L42 6 Z" fill="#56c2b0"/>
    <path d="M22 0 L46 -10 L38 14 Z" fill="#ff9a62"/>
    <ellipse cx="0" cy="0" rx="30" ry="26" fill="#fffaf2" stroke="#e7d4bf" stroke-width="2"/>
    <ellipse cx="3" cy="3" rx="15" ry="10" fill="#ffe9cf"/>
    <circle cx="-22" cy="-20" r="17" fill="#fffaf2" stroke="#e7d4bf" stroke-width="2"/>
    <rect x="-31" y="-44" width="16" height="12" rx="4" fill="#ff4a4a"/>
    <rect x="-26" y="-8" width="5" height="9" rx="2" fill="#ff4a4a"/>
    <path d="M-38 -20 L-55 -14 L-38 -8 Z" fill="#ffb13b"/>
    <circle cx="-26" cy="-22" r="3.4" fill="#3a322b"/>
    <line x1="-8" y1="24" x2="-8" y2="34" stroke="#ffb13b" stroke-width="3"/>
    <line x1="8" y1="24" x2="8" y2="34" stroke="#ffb13b" stroke-width="3"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('wrote public/og-image.png');
