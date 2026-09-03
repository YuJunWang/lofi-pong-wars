/**
 * Lo-Fi Pong Wars - UI Controls & Interactions
 * Features: Fluid Glass Mode Switcher (2P..6P), Pomodoro Focus Timer,
 * Interactive Ripples, Audio Preset & Palette Controllers, Keyboard Shortcuts.
 */

// --- Dynamic HUD DOM Reconstruction ---
function updateHUDStructure() {
  const statsContainer = document.getElementById('team-stats-container');
  const ratioTrack = document.getElementById('ratio-track');
  if (!statsContainer || !ratioTrack) return;

  statsContainer.innerHTML = '';
  ratioTrack.innerHTML = '';

  for (let t = 0; t < teamCount; t++) {
    const stat = document.createElement('div');
    stat.className = 'team-stat';
    stat.innerHTML = `<div class="stat-dot dot-${t}"></div><span id="score-${t}">0%</span>`;
    statsContainer.appendChild(stat);

    const seg = document.createElement('div');
    seg.className = `ratio-segment seg-${t}`;
    seg.id = `seg-${t}`;
    seg.style.width = `${100 / teamCount}%`;
    ratioTrack.appendChild(seg);
  }
}

// --- Toast Notification Helper ---
const toast = document.getElementById('toast-msg');
function triggerToast(msg) {
  if (!toast) return;
  toast.innerText = msg;
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(toast, 
      { autoAlpha: 0, y: -20, scale: 0.9 }, 
      { autoAlpha: 1, y: 0, scale: 1.0, duration: 0.4, ease: "back.out(1.7)" }
    );
    setTimeout(() => {
      gsap.to(toast, { autoAlpha: 0, y: -15, duration: 0.3, ease: "power2.in" });
    }, 3500);
  } else {
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3500);
  }
}

// --- Interactive Waves & Touch-drag Support ---
let isPointerInteracting = false;
let lastRippleTime = 0;

function triggerInteraction(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const clickY = clientY - rect.top;

  if (clickX < 0 || clickX > width || clickY < 0 || clickY > height) return;

  addShockwave(clickX, clickY, '#38bdf8');
  if (synth && synth.initialized) {
    const pan = (clickX / width) * 1.6 - 0.8;
    synth.playNote(880, pan, 0);
  }

  balls.forEach(b => {
    const dx = b.x - clickX;
    const dy = b.y - clickY;
    const dist = Math.hypot(dx, dy);
    if (dist < 130 && dist > 1) {
      b.dx += (dx / dist) * 2.2;
      b.dy += (dy / dist) * 2.2;
    }
  });
}

canvas.addEventListener('pointerdown', (e) => {
  isPointerInteracting = true;
  triggerInteraction(e.clientX, e.clientY);
});

window.addEventListener('pointermove', (e) => {
  if (!isPointerInteracting) return;
  const now = performance.now();
  if (now - lastRippleTime > 75) {
    lastRippleTime = now;
    triggerInteraction(e.clientX, e.clientY);
  }
});

window.addEventListener('pointerup', () => { isPointerInteracting = false; });
window.addEventListener('pointercancel', () => { isPointerInteracting = false; });

// --- Pomodoro Focus Timer ---
let pomoDurationMinutes = 25;
let pomoEndTime = null;
let pomoRemainingSeconds = 25 * 60;
let pomoTimer = null;
let isPomoRunning = false;

const pomoDisplay = document.getElementById('pomo-display');
const pomoToggleBtn = document.getElementById('btn-pomo-toggle');
const pomoModeBtn = document.getElementById('btn-pomo-mode');

function updatePomoDisplay(seconds) {
  if (!pomoDisplay) return;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  pomoDisplay.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function tickPomo() {
  if (!isPomoRunning) return;
  const now = Date.now();
  const remainingMs = Math.max(0, pomoEndTime - now);
  pomoRemainingSeconds = Math.ceil(remainingMs / 1000);
  updatePomoDisplay(pomoRemainingSeconds);

  if (pomoRemainingSeconds <= 0) {
    clearInterval(pomoTimer);
    isPomoRunning = false;
    if (pomoToggleBtn) {
      pomoToggleBtn.innerText = "Start Focus";
      pomoToggleBtn.classList.remove('active');
    }
    if (synth) synth.playChime();
    triggerToast("🎉 Focus session complete! Time to stretch & hydrate ☕");
  }
}

if (pomoToggleBtn) {
  pomoToggleBtn.addEventListener('click', () => {
    if (isPomoRunning) {
      clearInterval(pomoTimer);
      isPomoRunning = false;
      pomoToggleBtn.innerText = "Start Focus";
      pomoToggleBtn.classList.remove('active');
    } else {
      isPomoRunning = true;
      pomoToggleBtn.innerText = "Pause";
      pomoToggleBtn.classList.add('active');
      pomoEndTime = Date.now() + pomoRemainingSeconds * 1000;
      pomoTimer = setInterval(tickPomo, 400);
    }
  });
}

if (pomoModeBtn) {
  pomoModeBtn.addEventListener('click', () => {
    if (isPomoRunning) return;
    if (pomoDurationMinutes === 25) {
      pomoDurationMinutes = 50;
      pomoModeBtn.innerText = "50m";
    } else if (pomoDurationMinutes === 50) {
      pomoDurationMinutes = 5;
      pomoModeBtn.innerText = "5m";
    } else {
      pomoDurationMinutes = 25;
      pomoModeBtn.innerText = "25m";
    }
    pomoRemainingSeconds = pomoDurationMinutes * 60;
    updatePomoDisplay(pomoRemainingSeconds);
  });
}

// --- UI Controls & Audio Unlock Overlay ---
const startModal = document.getElementById('start-modal');
const startCard = document.getElementById('start-card');
const startBtn = document.getElementById('start-btn');
const btnPause = document.getElementById('btn-pause');
const pauseIcon = document.getElementById('pause-icon');
const pauseText = document.getElementById('pause-text');
const speedSlider = document.getElementById('speed-slider');
const volSlider = document.getElementById('vol-slider');
const btnVinyl = document.getElementById('btn-vinyl');

if (startCard && typeof gsap !== 'undefined') {
  gsap.from(startCard, {
    scale: 0.85,
    autoAlpha: 0,
    y: 30,
    duration: 0.7,
    ease: "back.out(1.4)"
  });
}

function startExperience() {
  if (synth) {
    synth.init();
    if (synth.ctx && synth.ctx.state === "suspended") {
      synth.ctx.resume().catch(() => {});
    }
  }
  
  if (startModal) {
    if (typeof gsap !== 'undefined') {
      gsap.to(startModal, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          startModal.classList.add('hidden');
          startModal.style.display = 'none';
        }
      });
    } else {
      startModal.classList.add('hidden');
      startModal.style.display = 'none';
    }
  }
}

if (startBtn) {
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startExperience();
  });
}
if (startModal) {
  startModal.addEventListener('click', startExperience);
}

// Mode Selector (2P / 3P / 4P / 5P / 6P)
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    teamCount = parseInt(btn.getAttribute('data-teams'), 10);
    setupGridAndBalls();
    triggerToast(`⚔️ Switched to ${teamCount}-Faction Battle Mode!`);
  });
});

if (btnPause) {
  btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    if (pauseIcon) pauseIcon.innerText = isPaused ? "▶" : "⏸";
    if (pauseText) pauseText.innerText = isPaused ? "Resume" : "Pause";
    btnPause.classList.toggle('active', isPaused);
  });
}

if (speedSlider) {
  speedSlider.addEventListener('input', (e) => {
    speedMultiplier = parseFloat(e.target.value);
  });
}

if (volSlider) {
  volSlider.addEventListener('input', (e) => {
    if (synth) synth.setVolume(parseFloat(e.target.value));
  });
}

if (btnVinyl) {
  btnVinyl.addEventListener('click', () => {
    if (!synth) return;
    const enabled = synth.toggleVinyl();
    btnVinyl.classList.toggle('active', enabled);
    triggerToast(enabled ? "Vinyl Crackle On ☕" : "Vinyl Crackle Muted");
  });
}

const styleSelect = document.getElementById('style-select');
if (styleSelect) {
  styleSelect.addEventListener('change', (e) => {
    currentStyleId = e.target.value;
    activeChordIndex = 0;
    chordHitsCounter = 0;
    const selectedStyle = SOUND_STYLES[currentStyleId] || SOUND_STYLES.lofi;

    const chordNameEl = document.getElementById('chord-name');
    if (chordNameEl) {
      chordNameEl.innerText = selectedStyle.chords[0].name;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(chordNameEl, { scale: 1.4, color: '#f59e0b' }, { scale: 1.0, color: '#38bdf8', duration: 0.5, ease: "power2.out" });
      }
    }

    if (synth) {
      if (selectedStyle.vinylDefault && !synth.isVinylEnabled) {
        synth.toggleVinyl();
        if (btnVinyl) btnVinyl.classList.add('active');
      } else if (!selectedStyle.vinylDefault && synth.isVinylEnabled) {
        synth.toggleVinyl();
        if (btnVinyl) btnVinyl.classList.remove('active');
      }
    }

    triggerToast(`🎶 Style: ${selectedStyle.name} (${selectedStyle.description})`);
  });
}

// Palette Selector Dropdown
const paletteSelect = document.getElementById('palette-select');
if (paletteSelect) {
  paletteSelect.addEventListener('change', (e) => {
    setPalette(e.target.value);
    triggerToast(`🎨 Palette: ${COLOR_PALETTES[e.target.value].name}`);
  });
}

// Studio Drawer Toggle (Mobile Floating Dock)
const btnStudioToggle = document.getElementById('btn-studio-toggle');
const studioDrawer = document.getElementById('studio-drawer');
if (btnStudioToggle && studioDrawer) {
  btnStudioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = studioDrawer.classList.toggle('open');
    btnStudioToggle.classList.toggle('active', isOpen);
  });

  canvas.addEventListener('pointerdown', () => {
    if (studioDrawer.classList.contains('open')) {
      studioDrawer.classList.remove('open');
      btnStudioToggle.classList.remove('active');
    }
  });
}

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (btnPause) btnPause.click();
  } else if (['2', '3', '4', '5', '6'].includes(e.key)) {
    const btn = document.querySelector(`.mode-btn[data-teams="${e.key}"]`);
    if (btn) btn.click();
  } else if (e.key === 's' || e.key === 'S') {
    const styleKeys = Object.keys(SOUND_STYLES);
    const nextIdx = (styleKeys.indexOf(currentStyleId) + 1) % styleKeys.length;
    if (styleSelect) {
      styleSelect.value = styleKeys[nextIdx];
      styleSelect.dispatchEvent(new Event('change'));
    }
  } else if (e.key === 'p' || e.key === 'P') {
    const palKeys = Object.keys(COLOR_PALETTES);
    const nextIdx = (palKeys.indexOf(currentPaletteId) + 1) % palKeys.length;
    const nextPal = palKeys[nextIdx];
    setPalette(nextPal);
    triggerToast(`🎨 Palette: ${COLOR_PALETTES[nextPal].name}`);
  }
});

// Window Resize
window.addEventListener('resize', () => {
  resizeCanvas();
  setupGridAndBalls();
});

// --- Initial Startup ---
resizeCanvas();
setPalette('sunset');
setupGridAndBalls();
updateHUDStructure();
