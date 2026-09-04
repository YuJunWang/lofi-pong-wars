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
  const scaleX = canvas.width / (rect.width || 1);
  const scaleY = canvas.height / (rect.height || 1);
  const clickX = (clientX - rect.left) * scaleX;
  const clickY = (clientY - rect.top) * scaleY;

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
const pomoBtnText = document.getElementById('pomo-btn-text');
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
    if (pomoBtnText) pomoBtnText.innerText = "Start Focus";
    if (pomoToggleBtn) pomoToggleBtn.classList.remove('active');
    if (synth) synth.playChime();
    triggerToast("Focus session completed! Time for a mindful rest.");
  }
}

if (pomoToggleBtn) {
  pomoToggleBtn.addEventListener('click', () => {
    if (isPomoRunning) {
      clearInterval(pomoTimer);
      isPomoRunning = false;
      if (pomoBtnText) pomoBtnText.innerText = "Start Focus";
      pomoToggleBtn.classList.remove('active');
    } else {
      isPomoRunning = true;
      if (pomoBtnText) pomoBtnText.innerText = "Pause";
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
const speedValue = document.getElementById('speed-value');
const volSlider = document.getElementById('vol-slider');
const volValue = document.getElementById('vol-value');
const btnVinyl = document.getElementById('btn-vinyl');
const vinylStatus = document.getElementById('vinyl-status');

const SVG_PAUSE = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const SVG_PLAY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

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
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    teamCount = parseInt(btn.getAttribute('data-teams'), 10);
    setupGridAndBalls();
    triggerToast(`Switched to ${teamCount}-Faction Battle Mode`);
  });
});

if (btnPause) {
  btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    if (pauseIcon) pauseIcon.innerHTML = isPaused ? SVG_PLAY : SVG_PAUSE;
    if (pauseText) pauseText.innerText = isPaused ? "Resume" : "Pause";
    btnPause.classList.toggle('active', isPaused);
  });
}

if (speedSlider) {
  speedSlider.addEventListener('input', (e) => {
    speedMultiplier = parseFloat(e.target.value);
    if (speedValue) speedValue.innerText = `${speedMultiplier.toFixed(1)}x`;
  });
}

if (volSlider) {
  volSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (synth) synth.setVolume(val);
    if (volValue) volValue.innerText = `${Math.round(val * 100)}%`;
  });
}

if (btnVinyl) {
  btnVinyl.addEventListener('click', () => {
    if (!synth) return;
    const enabled = synth.toggleVinyl();
    btnVinyl.classList.toggle('active', enabled);
    if (vinylStatus) vinylStatus.innerText = enabled ? "Active" : "Muted";
    triggerToast(enabled ? "Vinyl Warmth Active" : "Vinyl Warmth Muted");
  });
}

const btnBalls = document.getElementById('btn-balls');
const ballsStatus = document.getElementById('balls-status');

function updateBallsUI() {
  if (btnBalls && ballsStatus) {
    if (showBalls) {
      btnBalls.classList.remove('active');
      ballsStatus.innerText = "Visible";
    } else {
      btnBalls.classList.add('active');
      ballsStatus.innerText = "Hidden";
    }
  }
}

function toggleShowBalls() {
  showBalls = !showBalls;
  updateBallsUI();
  triggerToast(showBalls ? "Balls: Visible" : "Phantom Mode: Balls Hidden");
}

if (btnBalls) {
  btnBalls.addEventListener('click', () => {
    toggleShowBalls();
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
        if (vinylStatus) vinylStatus.innerText = "Active";
      } else if (!selectedStyle.vinylDefault && synth.isVinylEnabled) {
        synth.toggleVinyl();
        if (btnVinyl) btnVinyl.classList.remove('active');
        if (vinylStatus) vinylStatus.innerText = "Muted";
      }
    }

    triggerToast(`Soundscape: ${selectedStyle.name}`);
  });
}

// Palette Selector Dropdown
const paletteSelect = document.getElementById('palette-select');
if (paletteSelect) {
  paletteSelect.addEventListener('change', (e) => {
    setPalette(e.target.value);
    triggerToast(`Theme: ${COLOR_PALETTES[e.target.value].name}`);
  });
}

// Studio Popover Toggle (Option 1)
const btnStudioToggle = document.getElementById('btn-studio-toggle');
const studioPopover = document.getElementById('studio-popover');
const btnPopoverClose = document.getElementById('btn-popover-close');

function toggleStudioPopover(open) {
  if (!studioPopover) return;
  const isOpen = (typeof open === 'boolean') ? open : !studioPopover.classList.contains('open');
  studioPopover.classList.toggle('open', isOpen);
  studioPopover.setAttribute('aria-hidden', !isOpen);
  if (btnStudioToggle) btnStudioToggle.classList.toggle('active', isOpen);
}

if (btnStudioToggle) {
  btnStudioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStudioPopover();
  });
}

if (btnPopoverClose) {
  btnPopoverClose.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStudioPopover(false);
  });
}

// Click outside popover to dismiss
document.addEventListener('pointerdown', (e) => {
  if (!studioPopover || !studioPopover.classList.contains('open')) return;
  if (!studioPopover.contains(e.target) && btnStudioToggle && !btnStudioToggle.contains(e.target)) {
    toggleStudioPopover(false);
  }
});

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
    triggerToast(`Theme: ${COLOR_PALETTES[nextPal].name}`);
  } else if (e.key === 'b' || e.key === 'B') {
    toggleShowBalls();
  }
});

// Window Resize (Preserves active battle state via proportional coordinate scaling)
window.addEventListener('resize', () => {
  resizeCanvas();
});

// --- Initial Startup ---
function initApp() {
  resizeCanvas();
  teamCount = 6;
  setPalette('mono');
  setupGridAndBalls();
}
initApp();
