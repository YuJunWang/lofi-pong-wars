/**
 * Lo-Fi Pong Wars - Configuration & Presets
 * Palette System (6-Color Themes) & Harmonic Audio Style Matrix
 */

const GRID_SIZE = 32;
const CHORD_CHANGE_HITS = 24;

// --- 5 Curated 6-Color Aesthetic Palettes ---
const COLOR_PALETTES = {
  sunset: {
    id: 'sunset',
    name: '🌅 Sunset Lo-Fi',
    teams: [
      { id: 0, name: 'Amber Sunset', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
      { id: 1, name: 'Twilight Lavender', color: '#818cf8', glow: 'rgba(129, 140, 248, 0.5)' },
      { id: 2, name: 'Emerald Sage', color: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
      { id: 3, name: 'Coral Rose', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.5)' },
      { id: 4, name: 'Warm Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)' },
      { id: 5, name: 'Golden Sunburst', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)' }
    ]
  },
  cyber: {
    id: 'cyber',
    name: '🌃 Cyber Neon',
    teams: [
      { id: 0, name: 'Electric Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)' },
      { id: 1, name: 'Neon Magenta', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.5)' },
      { id: 2, name: 'Acid Lime', color: '#84cc16', glow: 'rgba(132, 204, 22, 0.5)' },
      { id: 3, name: 'Solar Yellow', color: '#eab308', glow: 'rgba(234, 179, 8, 0.5)' },
      { id: 4, name: 'Hyper Violet', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' },
      { id: 5, name: 'Blaze Orange', color: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' }
    ]
  },
  matcha: {
    id: 'matcha',
    name: '🍵 Uji Matcha',
    teams: [
      { id: 0, name: 'Matcha Green', color: '#65a30d', glow: 'rgba(101, 163, 13, 0.5)' },
      { id: 1, name: 'Sakura Petal', color: '#f472b6', glow: 'rgba(244, 114, 182, 0.5)' },
      { id: 2, name: 'Genmaicha Gold', color: '#d97706', glow: 'rgba(217, 119, 6, 0.5)' },
      { id: 3, name: 'Yozakura Slate', color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.5)' },
      { id: 4, name: 'Hojicha Roast', color: '#78350f', glow: 'rgba(120, 53, 15, 0.5)' },
      { id: 5, name: 'Wisteria Blue', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' }
    ]
  },
  nordic: {
    id: 'nordic',
    name: '❄️ Nordic Pastel',
    teams: [
      { id: 0, name: 'Glacial Ice', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
      { id: 1, name: 'Arctic Peach', color: '#fb923c', glow: 'rgba(251, 146, 60, 0.5)' },
      { id: 2, name: 'Mint Frost', color: '#34d399', glow: 'rgba(52, 211, 153, 0.5)' },
      { id: 3, name: 'Soft Orchid', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.5)' },
      { id: 4, name: 'Slate Fog', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.5)' },
      { id: 5, name: 'Nordic Berry', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.5)' }
    ]
  },
  mocha: {
    id: 'mocha',
    name: '☕ Warm Mocha',
    teams: [
      { id: 0, name: 'Warm Caramel', color: '#ea580c', glow: 'rgba(234, 88, 12, 0.5)' },
      { id: 1, name: 'Oat Milk', color: '#cbd5e1', glow: 'rgba(203, 213, 225, 0.5)' },
      { id: 2, name: 'Espresso Roast', color: '#ca8a04', glow: 'rgba(202, 138, 4, 0.5)' },
      { id: 3, name: 'Berry Plum', color: '#db2777', glow: 'rgba(219, 39, 119, 0.5)' },
      { id: 4, name: 'Cinnamon Stick', color: '#854d0e', glow: 'rgba(133, 77, 14, 0.5)' },
      { id: 5, name: 'Night Brew', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.5)' }
    ]
  }
};

let currentPaletteId = 'sunset';
let currentStyleId = 'lofi';
let TEAM_PALETTES = COLOR_PALETTES[currentPaletteId].teams;

function setPalette(paletteId) {
  if (!COLOR_PALETTES[paletteId]) return;
  currentPaletteId = paletteId;
  TEAM_PALETTES = COLOR_PALETTES[paletteId].teams;

  // Update CSS variables for UI elements (capsule dots and ratio segments)
  const root = document.documentElement;
  for (let i = 0; i < 6; i++) {
    const t = TEAM_PALETTES[i] || TEAM_PALETTES[0];
    root.style.setProperty(`--team-${i}`, t.color);
    root.style.setProperty(`--team-${i}-glow`, t.glow);
  }

  // Update active balls palettes if balls exist
  if (typeof balls !== 'undefined' && balls && balls.length > 0) {
    for (const ball of balls) {
      if (ball) ball.palette = TEAM_PALETTES[ball.team % TEAM_PALETTES.length];
    }
  }

  const paletteSelect = document.getElementById('palette-select');
  if (paletteSelect && paletteSelect.value !== paletteId) {
    paletteSelect.value = paletteId;
  }
}

// --- 4 Curated Soundscape Styles with 6-Voice Ensembles ---
const SOUND_STYLES = {
  lofi: {
    id: 'lofi',
    name: '☕ Lo-Fi Study',
    description: 'Warm Rhodes, Upright Bass, Music Box, Pluck, Vibes & Flute',
    vinylDefault: true,
    chords: [
      { name: "Ebmaj9", baseFreqs: [155.56, 196.00, 233.08, 293.66, 349.23, 392.00, 466.16, 587.33] },
      { name: "Cm7",    baseFreqs: [130.81, 155.56, 196.00, 233.08, 261.63, 311.13, 392.00, 466.16] },
      { name: "Fm9",    baseFreqs: [174.61, 207.65, 261.63, 311.13, 349.23, 415.30, 523.25, 622.25] },
      { name: "Bb13",   baseFreqs: [116.54, 146.83, 174.61, 207.65, 233.08, 293.66, 349.23, 466.16] }
    ],
    voices: [
      // Ball 0: Warm Rhodes
      { name: 'Warm Rhodes', mult: 1.0, oscType: 'sine', detune: 1.0025, filterStart: 1500, filterEnd: 320, attack: 0.008, decay: 1.35, gain: 0.24 },
      // Ball 1: Upright Bass
      { name: 'Upright Bass', mult: 0.5, oscType: 'triangle', detune: 1.0, filterStart: 550, filterEnd: 180, attack: 0.015, decay: 1.6, gain: 0.35 },
      // Ball 2: Music Box
      { name: 'Music Box', mult: 2.0, oscType: 'sine', detune: 1.001, filterStart: 3500, filterEnd: 1200, attack: 0.004, decay: 0.9, gain: 0.18 },
      // Ball 3: Muted Pluck
      { name: 'Muted Pluck', mult: 1.0, oscType: 'triangle', detune: 1.005, filterStart: 2400, filterEnd: 220, attack: 0.003, decay: 0.65, gain: 0.22 },
      // Ball 4: Vibraphone Chime
      { name: 'Vibraphone Chime', mult: 1.5, oscType: 'sine', detune: 1.002, filterStart: 2800, filterEnd: 600, attack: 0.006, decay: 1.2, gain: 0.20 },
      // Ball 5: Soft Jazz Flute
      { name: 'Jazz Flute', mult: 1.25, oscType: 'triangle', detune: 1.008, filterStart: 1800, filterEnd: 450, attack: 0.02, decay: 1.1, gain: 0.21 }
    ],
    wallVoices: null // Pure silence on wall bounces for focus
  },

  synthwave: {
    id: 'synthwave',
    name: '🌌 Cyber Synth',
    description: 'Analog Saw, Reese Bass, Crystal Arp, Neon Pluck, Stabs & Pad',
    vinylDefault: false,
    chords: [
      { name: "Am7",   baseFreqs: [110.00, 130.81, 164.81, 196.00, 220.00, 261.63, 329.63, 392.00] },
      { name: "Fmaj7", baseFreqs: [87.31,  110.00, 130.81, 174.61, 220.00, 261.63, 349.23, 440.00] },
      { name: "Cmaj7", baseFreqs: [130.81, 164.81, 196.00, 246.94, 261.63, 329.63, 392.00, 493.88] },
      { name: "Em7",   baseFreqs: [82.41,  98.00,  123.47, 164.81, 196.00, 246.94, 329.63, 392.00] }
    ],
    voices: [
      // Ball 0: 80s Analog Saw Lead
      { name: 'Saw Lead', mult: 1.0, oscType: 'sawtooth', detune: 1.004, filterStart: 3800, filterEnd: 650, attack: 0.005, decay: 1.1, gain: 0.18 },
      // Ball 1: Reese Sub Bass
      { name: 'Reese Bass', mult: 0.5, oscType: 'sawtooth', detune: 1.008, filterStart: 900, filterEnd: 150, attack: 0.02, decay: 1.5, gain: 0.28 },
      // Ball 2: FM Crystal Arp
      { name: 'Crystal Arp', mult: 2.0, oscType: 'square', detune: 1.002, filterStart: 4500, filterEnd: 1100, attack: 0.002, decay: 0.8, gain: 0.12 },
      // Ball 3: Neon Pluck
      { name: 'Neon Pluck', mult: 1.0, oscType: 'sawtooth', detune: 1.006, filterStart: 3200, filterEnd: 400, attack: 0.003, decay: 0.55, gain: 0.20 },
      // Ball 4: Cyber Stabs
      { name: 'Cyber Stabs', mult: 1.5, oscType: 'sawtooth', detune: 1.005, filterStart: 4200, filterEnd: 750, attack: 0.004, decay: 0.9, gain: 0.16 },
      // Ball 5: Retrowave Pad
      { name: 'Retrowave Pad', mult: 0.75, oscType: 'square', detune: 1.003, filterStart: 2100, filterEnd: 350, attack: 0.025, decay: 1.4, gain: 0.19 }
    ],
    wallVoices: [
      { name: 'Cyber Click', type: 'click', freq: 1600, decay: 0.02, gain: 0.07 },
      { name: '808 Sub Tap', type: 'sub', freq: 75, endFreq: 40, decay: 0.08, gain: 0.12 },
      { name: 'Metallic Ping', type: 'tone', freq: 2200, endFreq: 1200, decay: 0.04, gain: 0.05 },
      { name: 'Neon Closed Hat', type: 'noise', freq: 7000, decay: 0.025, gain: 0.06 },
      { name: 'Laser Blip', type: 'click', freq: 2800, decay: 0.02, gain: 0.06 },
      { name: 'Sub Thump', type: 'sub', freq: 90, endFreq: 45, decay: 0.06, gain: 0.10 }
    ]
  },

  zen: {
    id: 'zen',
    name: '🎋 Zen Garden',
    description: 'Koto, Bamboo Flute, Singing Bowl, Kalimba, Wind Chime & Taiko',
    vinylDefault: false,
    chords: [
      { name: "Insen A", baseFreqs: [110.00, 116.54, 146.83, 164.81, 196.00, 220.00, 233.08, 293.66] },
      { name: "Insen D", baseFreqs: [146.83, 155.56, 196.00, 220.00, 261.63, 293.66, 311.13, 392.00] },
      { name: "Hirajoshi E", baseFreqs: [164.81, 174.61, 220.00, 246.94, 261.63, 329.63, 349.23, 440.00] },
      { name: "Hirajoshi B", baseFreqs: [123.47, 130.81, 164.81, 185.00, 196.00, 246.94, 261.63, 329.63] }
    ],
    voices: [
      // Ball 0: Plucked Koto (古箏)
      { name: 'Plucked Koto', mult: 1.0, oscType: 'triangle', detune: 1.003, filterStart: 2800, filterEnd: 300, attack: 0.004, decay: 1.4, gain: 0.28 },
      // Ball 1: Bamboo Flute Drone (尺八)
      { name: 'Bamboo Flute', mult: 0.5, oscType: 'sine', detune: 1.005, filterStart: 850, filterEnd: 240, attack: 0.04, decay: 1.8, gain: 0.32 },
      // Ball 2: Singing Bowl (頌缽)
      { name: 'Singing Bowl', mult: 1.5, oscType: 'sine', detune: 1.001, filterStart: 1800, filterEnd: 550, attack: 0.02, decay: 2.2, gain: 0.20 },
      // Ball 3: Kalimba (拇指琴)
      { name: 'Kalimba', mult: 2.0, oscType: 'sine', detune: 1.002, filterStart: 3200, filterEnd: 900, attack: 0.003, decay: 0.85, gain: 0.22 },
      // Ball 4: Wind Chime (風鈴)
      { name: 'Wind Chime', mult: 2.5, oscType: 'sine', detune: 1.001, filterStart: 4200, filterEnd: 1500, attack: 0.002, decay: 1.1, gain: 0.16 },
      // Ball 5: Taiko Rim (太鼓側音)
      { name: 'Taiko Rim', mult: 0.75, oscType: 'triangle', detune: 1.004, filterStart: 1200, filterEnd: 280, attack: 0.008, decay: 0.95, gain: 0.26 }
    ],
    wallVoices: null // Pure silence for meditation
  },

  chiptune: {
    id: 'chiptune',
    name: '👾 8-Bit Arcade',
    description: 'NES Pulse Lead, Triangle Bass, Fast Arp, Coin, 1-Up & Noise',
    vinylDefault: false,
    chords: [
      { name: "C Major", baseFreqs: [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25, 659.25] },
      { name: "G Major", baseFreqs: [98.00,  123.47, 146.83, 196.00, 246.94, 293.66, 392.00, 493.88] },
      { name: "A Minor", baseFreqs: [110.00, 130.81, 164.81, 220.00, 261.63, 329.63, 440.00, 523.25] },
      { name: "F Major", baseFreqs: [87.31,  110.00, 130.81, 174.61, 220.00, 261.63, 349.23, 440.00] }
    ],
    voices: [
      // Ball 0: NES Pulse Lead (50% Square)
      { name: 'Pulse Lead', mult: 1.0, oscType: 'square', detune: 1.0, filterStart: 5000, filterEnd: 2200, attack: 0.002, decay: 0.45, gain: 0.16 },
      // Ball 1: NES Triangle Bass
      { name: 'Triangle Bass', mult: 0.5, oscType: 'triangle', detune: 1.0, filterStart: 1200, filterEnd: 200, attack: 0.005, decay: 0.7, gain: 0.35 },
      // Ball 2: Fast Pulse Arp
      { name: 'Pulse Arp', mult: 2.0, oscType: 'square', detune: 1.001, filterStart: 6000, filterEnd: 3000, attack: 0.001, decay: 0.35, gain: 0.12 },
      // Ball 3: Retro Coin Blip
      { name: 'Coin Blip', mult: 1.5, oscType: 'square', detune: 1.002, filterStart: 4500, filterEnd: 1800, attack: 0.002, decay: 0.28, gain: 0.18 },
      // Ball 4: 1-Up Trill
      { name: '1-Up Trill', mult: 2.25, oscType: 'square', detune: 1.003, filterStart: 5500, filterEnd: 2400, attack: 0.002, decay: 0.38, gain: 0.14 },
      // Ball 5: Game Over Sub
      { name: 'Game Over Sub', mult: 0.65, oscType: 'triangle', detune: 1.0, filterStart: 900, filterEnd: 160, attack: 0.004, decay: 0.6, gain: 0.30 }
    ],
    wallVoices: [
      { name: 'NES Pop', type: 'click', freq: 900, decay: 0.015, gain: 0.08 },
      { name: 'NES Kick', type: 'sub', freq: 110, endFreq: 30, decay: 0.04, gain: 0.14 },
      { name: 'Coin Blip', type: 'tone', freq: 1800, endFreq: 2400, decay: 0.03, gain: 0.06 },
      { name: 'Noise Snare', type: 'noise', freq: 4000, decay: 0.03, gain: 0.07 },
      { name: 'Blip High', type: 'click', freq: 1400, decay: 0.02, gain: 0.07 },
      { name: 'Sub Beep', type: 'sub', freq: 85, endFreq: 40, decay: 0.05, gain: 0.12 }
    ]
  }
};
