# 🎹 Lo-Fi Pong Wars (Generative Soundscape & Territory Simulation)

> An autonomous zero-player ambient simulation blending **Generative Lo-Fi Synthesis**, **Dynamic Jazz Chord Progressions**, and **Multi-Faction Territory Battles** for focus, study, and relaxation.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Online-f59e0b?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yujunwang.github.io/lofi-pong-wars/)

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20Canvas-38bdf8.svg)](index.html)
[![Audio Engine](https://img.shields.io/badge/Audio-Web%20Audio%20API-818cf8.svg)](index.html)
[![Animation](https://img.shields.io/badge/Animation-GSAP%203-10b981.svg)](https://gsap.com)
[![Zero Build](https://img.shields.io/badge/Build-Zero%20Dependency-emerald.svg)](index.html)

🔗 **Online Demo**: [https://yujunwang.github.io/lofi-pong-wars/](https://yujunwang.github.io/lofi-pong-wars/)

---

## ✨ Features

1. **4 Curated Soundscape Styles with Polyphonic Voice Roles**
   - **☕ Lo-Fi Study**: Warm Rhodes (Tenor) + Upright Sub Bass + Music Box (Treble) + Muted Acoustic Pluck.
   - **🌌 Cyber Synth**: 80s Analog Saw Lead + Reese Sub Bass + FM Crystal Arp + Neon Pluck.
   - **🎋 Zen Garden**: Plucked Koto (古箏) + Bamboo Flute Drone (尺八) + Singing Bowl + Kalimba.
   - **👾 8-Bit Arcade**: NES Square Lead (50% Pulse) + Triangle Bass + Pulse Arp + Retro Coin Blip.
   - Instant style switching via the floating Studio Deck dropdown or pressing `S`.

2. **Multi-Team Battle Modes (2, 3, or 4 Balls)**
   - **2 Balls**: Amber Sunset (`#f59e0b`) vs. Twilight Lavender (`#818cf8`).
   - **3 Balls**: Amber vs. Lavender vs. Emerald Sage (`#10b981`).
   - **4 Balls**: 4-Quadrant elemental warfare adding Coral Rose (`#f43f5e`).
   - Instant mode switching via UI pills or keyboard shortcuts (`2`, `3`, `4`).

3. **Background Tab Web Worker Audio Engine**
   - Decoupled Web Worker ticker ensures **music and physics keep running uninterrupted even when switching tabs**.
   - Zero external audio samples—everything synthesized mathematically in real-time.

4. **Polished UI/UX & GSAP Micro-Interactions**
   - Studio-grade dark matte theme with glassmorphism HUD and responsive flex progress bars.
   - Smooth GSAP animations for chord modulation transitions, pop-in toasts, and modal interactions.
   - Click canvas to unleash repelling shockwaves with harmonic resonance.

5. **Productivity & Focus Companion**
   - Built-in **Timestamp-Accurate Pomodoro Focus Timer** (25m / 50m / 5m presets) with gentle arpeggio chime.
   - Speed multiplier and master volume sliders.
   - Spacebar shortcut to pause/resume anytime.

---

## 🚀 Quick Start

### 1. Run Locally
Simply open `index.html` in your favorite web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 2. Deploy to GitHub Pages
1. Push this repository to your GitHub account.
2. Navigate to repository **Settings** -> **Pages**.
3. Under **Branch**, select `main` (or `master`) and directory `/ (root)`.
4. Click **Save**—your generative toy is live!

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Toggle Play / Pause simulation |
| `S` | Cycle through 4 Sound Styles |
| `2` | Switch to 2-Ball Duel Mode |
| `3` | Switch to 3-Ball Triad Mode |
| `4` | Switch to 4-Ball Quadrant Mode |

---

## ⚙️ Customization

You can freely tune simulation and sound parameters inside `<script>` in `index.html`:

```javascript
// Grid resolution (default 32x32)
const GRID_SIZE = 32;

// Custom chord progression & frequencies (Hz)
const CHORD_PROGRESSION = [
  { name: "Ebmaj9", baseFreqs: [155.56, 196.00, 233.08, 293.66, 349.23, 392.00, 466.16, 587.33] },
  { name: "Cm7",    baseFreqs: [130.81, 155.56, 196.00, 233.08, 261.63, 311.13, 392.00, 466.16] },
  { name: "Fm9",    baseFreqs: [174.61, 207.65, 261.63, 311.13, 349.23, 415.30, 523.25, 622.25] },
  { name: "Bb13",   baseFreqs: [116.54, 146.83, 174.61, 207.65, 233.08, 293.66, 349.23, 466.16] }
];

// Number of flips before progressing to the next chord
const CHORD_CHANGE_HITS = 24;
```

---

## 💡 Acknowledgements & Inspiration

- Inspired by [vnglst/pong-wars](https://github.com/vnglst/pong-wars).
- Built with [GSAP](https://gsap.com) and the Web Audio API.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
