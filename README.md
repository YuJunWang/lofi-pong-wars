# 🎹 Lo-Fi Pong Wars

> Generative ambient music meets autonomous territory battles. Zero external audio samples, zero dependencies, runs entirely in your browser.

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/"><strong>▶ Live Demo</strong></a> • 
  <a href="#-key-features">Features</a> • 
  <a href="#-controls">Controls</a> • 
  <a href="#-quick-start">Quick Start</a>
</p>

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/">
    <img src="pic/demo.gif" alt="Lo-Fi Pong Wars Demo" width="440" style="border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.55);">
  </a>
</p>

---

## ✨ Overview

**Lo-Fi Pong Wars** is an interactive, autonomous generative ambient simulation. Competing color factions battle for territory on a dynamic organic canvas while procedural Web Audio oscillators synthesize warm, continuous jazz and ambient chord progressions in real time.

---

## 🎧 Key Features

* **Multi-Faction Battles (2P to 6P)**:
  * Select between **2, 3, 4, 5, or 6 faction modes** (Dual, Triangle, Quad, Pinwheel, and Hexagonal layouts).
  * Real-time territorial dominance tracked via dynamic HUD and live ratio progress bar.

* **6-Voice Polyphony & Procedural Audio**:
  * 100% synthesized in real time via the Web Audio API — **zero external MP3s or audio samples downloaded**.
  * Each ball commands its own distinct instrument voice and harmonic layer within the ensemble:
    * **Lo-Fi Study**: Warm Rhodes chords, Upright Bass, Music Box, Muted Pluck, Vibraphone Chime & Soft Jazz Flute.
    * **Cyber Synth**: Analog Saw Lead, Reese Bass, FM Crystal Arp, Neon Pluck, Cyber Stabs & Retrowave Pad.
    * **Zen Garden**: Plucked Koto, Bamboo Drone, Singing Bowl, Kalimba, Wind Chimes & Taiko Rim.
    * **8-Bit Arcade**: Square Lead, Triangle Bass, Pulse Arp, Retro Blip, 1-Up Trill & Sub Impact.

* **5 Curated Color Themes**:
  * `Sunset Amber`, `Cyber Neon`, `Uji Matcha`, `Nordic Frost`, and `Warm Mocha`.
  * Instantly switchable via the dock or hotkey `P`.

* **Organic Minimalist Territory Aesthetics**:
  * Pure 100% flat geometry with subtle rounded corner fillets and procedural radial ink blooms on impact.
  * Zero unnecessary wireframes or skeuomorphic bevels — clean, restrained, and modern.

* **Studio Popover Console & Primary Dock**:
  * VisionOS-inspired compact floating primary dock keeping 90% of screen real estate unobstructed.
  * Upward-sliding Studio Popover Console with live speed and volume badges, analog vinyl crackle toggle, Pomodoro focus timer (25m / 50m), and keyboard shortcuts cheat sheet.
  * 100% Zero-Emoji UI with crisp, inline SVG micro-icons.

* **Background Tab Playback**:
  * Leverages a dedicated Web Worker clock so simulation physics and chord progressions never drift or freeze when switching tabs.

* **Zero Build, 100% Native Classical Architecture**:
  * Double-click `index.html` to run anywhere offline without Node.js, npm, bundlers, or local servers.
  * Cleanly modularized into `js/config.js`, `js/synth.js`, `js/simulation.js`, and `js/ui.js`.

---

## ⌨️ Controls

| Key | Action |
| :--- | :--- |
| `Space` | Toggle Play / Pause |
| `2` - `6` | Switch Faction Count (2P, 3P, 4P, 5P, 6P) |
| `S` | Cycle Sound Style (`Lo-Fi` → `Synthwave` → `Zen` → `8-Bit`) |
| `P` | Cycle Color Palette (`Sunset` → `Cyber` → `Matcha` → `Nordic` → `Mocha`) |
| `Click / Drag` | Cast repulsion ripple shockwaves into the canvas |

---

## 🚀 Quick Start

No installations, build steps, or package managers required. Simply clone and open `index.html` in any modern browser:

```bash
git clone https://github.com/YuJunWang/lofi-pong-wars.git
cd lofi-pong-wars

# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Or play the live version directly at:  
👉 **[https://yujunwang.github.io/lofi-pong-wars/](https://yujunwang.github.io/lofi-pong-wars/)**

---

## 📄 License & Credits

* Original concept inspired by [Koen van Gilst's Pong Wars](https://github.com/vnglst/pong-wars).
* Authored & maintained by [Yu-Jun Wang](https://github.com/YuJunWang/lofi-pong-wars).
* Released under the [MIT License](LICENSE).
