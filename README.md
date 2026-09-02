# 🎹 Lo-Fi Pong Wars

> Generative ambient music meets autonomous territory battles. Zero external audio samples, zero dependencies, runs entirely in your browser.

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/"><strong>▶ Live Demo</strong></a> • 
  <a href="#-controls">Controls</a> • 
  <a href="#-quick-start">Quick Start</a>
</p>

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/">
    <img src="pic/demo.gif" alt="Lo-Fi Pong Wars Demo" width="460" style="border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,0.5);">
  </a>
</p>

---

## ⚡ What is this?

**Lo-Fi Pong Wars** is an interactive zero-player ambient simulation. Competing color factions battle for territory while procedural Web Audio oscillators synthesize relaxing, continuous jazz chord progressions on every bounce.

### 🎧 Highlights
* **Pure Procedural Audio**: 100% synthesized in real-time with Web Audio API. Zero MP3s or audio files downloaded.
* **4 Sound Styles**: 
  * `☕ Lo-Fi Study` — Warm Rhodes chords & upright bass
  * `🌌 Cyber Synth` — 80s analog saw leads & 808 sub hits
  * `🎋 Zen Garden` — Meditative koto, singing bowls & bamboo drones
  * `👾 8-Bit Arcade` — NES square waves & retro coin blips
* **Background Tab Playback**: Uses a Web Worker clock so music and simulation never pause when you switch tabs.
* **Interactive Physics**: Click or drag on the canvas to cast ripple shockwaves that push the balls.
* **Built-in Focus Tools**: Pomodoro timer (25m / 50m), vinyl noise warmth, speed & volume controls.
* **Mobile Ready**: Adaptive floating dock designed for comfortable one-thumb mobile control.

---

## ⌨️ Controls

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause |
| `S` | Cycle Sound Style (`Lo-Fi` → `Synth` → `Zen` → `8-Bit`) |
| `2` / `3` / `4` | Switch number of balls (2P / 3P / 4P) |
| `Click / Drag` | Cast repulsion shockwave |

---

## 🚀 Quick Start

Zero build steps, zero npm packages. Simply open `index.html`:

```bash
# Windows
start index.html

# macOS
open index.html
```

Or play the live version at [https://yujunwang.github.io/lofi-pong-wars/](https://yujunwang.github.io/lofi-pong-wars/).

---

## 📄 License & Credits

- Concept inspired by [vnglst/pong-wars](https://github.com/vnglst/pong-wars).
- Open-sourced under the [MIT License](LICENSE).
