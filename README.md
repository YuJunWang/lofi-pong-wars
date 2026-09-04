# 🎹 Lo-Fi Pong Wars

> Autonomous color factions fighting for territory while synthesizing real-time ambient Lo-Fi chords. Zero audio files, zero dependencies.

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/"><strong>▶ Live Demo</strong></a> • 
  <a href="#controls">Controls</a> • 
  <a href="#quick-start">Quick Start</a> • 
  <a href="README.zh-TW.md">繁體中文</a>
</p>

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/">
    <img src="pic/demo.gif" alt="Lo-Fi Pong Wars Demo" width="440" style="border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.55);">
  </a>
</p>

---

## What is this?

A zero-player simulation based on [Pong Wars](https://github.com/vnglst/pong-wars). 
Instead of just bouncing pixels, every tile flip triggers a real-time synthesized note. The balls jam over shifting jazz progressions while painting fluid, rounded territories across the screen.

### Highlights
- **100% Procedural Audio**: No MP3s, no sound files. Everything runs live on the Web Audio API across 4 styles (`Lo-Fi Study`, `Cyber Synth`, `Zen Garden`, `8-Bit Arcade`).
- **2 to 6 Factions**: Switch between 2P and 6P on the fly (dual, triangle, quad, pinwheel, and hex layouts). Each ball commands its own instrument voice.
- **Organic Canvas & Phantom Mode**: Pure minimalist flat geometry with filleted corner blending. Defaults to **Monochrome Minimal 6P** in Phantom Mode (hidden balls, living liquid territory morphing; press `B` anytime to reveal).
- **Focus Console**: Built-in 25m/50m Pomodoro timer, vinyl crackle generator, and speed/volume sliders tucked into a sliding studio drawer.
- **Runs Offline**: Double-click `index.html`. No Node, no bundler, no build step.

---

## Controls

| Key | Action |
| :--- | :--- |
| `Space` | Pause / Resume |
| `2` – `6` | Set faction count (2P to 6P) |
| `S` | Cycle soundscape style |
| `P` | Cycle color palette |
| `B` | Toggle Phantom Mode (Hide / Show Balls) |
| `Click / Drag` | Send shockwaves to deflect balls |

---

## Quick Start

```bash
git clone https://github.com/YuJunWang/lofi-pong-wars.git
cd lofi-pong-wars

# Just open index.html in your browser
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

Play online: [yujunwang.github.io/lofi-pong-wars](https://yujunwang.github.io/lofi-pong-wars/)

---

## Credits

- Concept inspired by [Koen van Gilst's Pong Wars](https://github.com/vnglst/pong-wars).
- Built & maintained by [Yu-Jun Wang](https://github.com/YuJunWang/lofi-pong-wars).
- MIT License.

