/**
 * Lo-Fi Pong Wars - Simulation & Rendering Engine
 * Features: Multi-Team Balanced Radial Partitions (2..6 Factions),
 * Vector Auto-Tiling Corner Filleting, Radial Ink Blooms, Particle FX,
 * Dual-Clock Background Web Worker Physics & Responsive Canvas Scaling.
 */

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

let width = 640;
let height = 640;
let tileSize = width / GRID_SIZE;
let teamCount = 2;
let grid = [];
let balls = [];
let particles = [];
let shockwaves = [];
let inkBlooms = [];
let isPaused = false;
let speedMultiplier = 1.0;
let activeChordIndex = 0;
let chordHitsCounter = 0;

function resizeCanvas() {
  const isMobile = window.innerWidth <= 768;
  const padding = isMobile ? 24 : 120;
  const maxAvail = Math.min(window.innerWidth - 32, window.innerHeight - padding);
  const size = Math.max(300, Math.min(640, maxAvail));

  const oldTileSize = tileSize;
  width = size;
  height = size;
  tileSize = width / GRID_SIZE;

  canvas.width = size;
  canvas.height = size;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  // Scale existing balls proportionally to prevent wiping battles on resize
  if (oldTileSize && oldTileSize > 0 && balls && balls.length > 0) {
    const scale = tileSize / oldTileSize;
    for (const ball of balls) {
      ball.x *= scale;
      ball.y *= scale;
    }
  }
}

function getRandomVelocity(baseSpeed = 3.2, variance = 0.6) {
  let angle;
  do {
    angle = Math.random() * Math.PI * 2;
    const mod = angle % (Math.PI / 2);
    if (mod > 0.31 && mod < (Math.PI / 2 - 0.31)) break;
  } while (true);

  const spd = baseSpeed + (Math.random() - 0.5) * variance;
  return { dx: Math.cos(angle) * spd, dy: Math.sin(angle) * spd };
}

function setupGridAndBalls() {
  grid = [];
  balls = [];
  inkBlooms = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    grid[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      if (teamCount === 2) {
        grid[r][c] = c < GRID_SIZE / 2 ? 0 : 1;
      } else if (teamCount === 3) {
        // Balanced 3-Way Radial Y-Partition (33% / 33% / 33%)
        const dy = r - 15.5;
        const dx = c - 15.5;
        let ang = Math.atan2(dy, dx);
        if (ang < 0) ang += Math.PI * 2;
        if (ang < 2.155) grid[r][c] = 0;
        else if (ang < 4.115) grid[r][c] = 1;
        else grid[r][c] = 2;
      } else if (teamCount === 4) {
        const isTop = r < GRID_SIZE / 2;
        const isLeft = c < GRID_SIZE / 2;
        if (isTop && isLeft) grid[r][c] = 0;
        else if (isTop && !isLeft) grid[r][c] = 1;
        else if (!isTop && isLeft) grid[r][c] = 2;
        else grid[r][c] = 3;
      } else if (teamCount === 5) {
        // Balanced 5-Sector Radial Pinwheel (205, 205, 204, 205, 205 cells = 20% each)
        const dy = r - 15.5;
        const dx = c - 15.5;
        let ang = Math.atan2(dy, dx);
        if (ang < 0) ang += Math.PI * 2;
        if (ang < 1.198) grid[r][c] = 0;
        else if (ang < 2.471) grid[r][c] = 1;
        else if (ang < 3.820) grid[r][c] = 2;
        else if (ang < 5.099) grid[r][c] = 3;
        else grid[r][c] = 4;
      } else if (teamCount === 6) {
        // Balanced 6-Sector Hexagonal Clock (171, 170, 171, 171, 170, 171 cells = 17% each)
        const dy = r - 15.5;
        const dx = c - 15.5;
        let ang = Math.atan2(dy, dx);
        if (ang < 0) ang += Math.PI * 2;
        if (ang < 0.991) grid[r][c] = 0;
        else if (ang < 2.166) grid[r][c] = 1;
        else if (ang < 3.174) grid[r][c] = 2;
        else if (ang < 4.132) grid[r][c] = 3;
        else if (ang < 5.308) grid[r][c] = 4;
        else grid[r][c] = 5;
      }
    }
  }

  // Ball Initial Positions (Opposing Centroid Infiltration) & Random Velocities
  if (teamCount === 2) {
    const v0 = getRandomVelocity(3.2, 0.6);
    const v1 = getRandomVelocity(3.2, 0.6);
    balls.push({
      x: (GRID_SIZE * 0.75) * tileSize, y: (GRID_SIZE * 0.5) * tileSize,
      dx: v0.dx, dy: v0.dy, radius: 7.5, team: 0, palette: TEAM_PALETTES[0]
    });
    balls.push({
      x: (GRID_SIZE * 0.25) * tileSize, y: (GRID_SIZE * 0.5) * tileSize,
      dx: v1.dx, dy: v1.dy, radius: 7.5, team: 1, palette: TEAM_PALETTES[1]
    });
  } else if (teamCount === 3) {
    const v0 = getRandomVelocity(3.1, 0.5);
    const v1 = getRandomVelocity(3.1, 0.5);
    const v2 = getRandomVelocity(3.1, 0.5);
    balls.push({
      x: 5.3 * tileSize, y: 15.6 * tileSize,
      dx: v0.dx, dy: v0.dy, radius: 7.5, team: 0, palette: TEAM_PALETTES[0]
    });
    balls.push({
      x: 20.5 * tileSize, y: 6.8 * tileSize,
      dx: v1.dx, dy: v1.dy, radius: 7.5, team: 1, palette: TEAM_PALETTES[1]
    });
    balls.push({
      x: 20.6 * tileSize, y: 24.2 * tileSize,
      dx: v2.dx, dy: v2.dy, radius: 7.5, team: 2, palette: TEAM_PALETTES[2]
    });
  } else if (teamCount === 4) {
    const v0 = getRandomVelocity(3.0, 0.5);
    const v1 = getRandomVelocity(3.0, 0.5);
    const v2 = getRandomVelocity(3.0, 0.5);
    const v3 = getRandomVelocity(3.0, 0.5);
    balls.push({
      x: (GRID_SIZE * 0.75) * tileSize, y: (GRID_SIZE * 0.75) * tileSize,
      dx: v0.dx, dy: v0.dy, radius: 7.0, team: 0, palette: TEAM_PALETTES[0]
    });
    balls.push({
      x: (GRID_SIZE * 0.25) * tileSize, y: (GRID_SIZE * 0.75) * tileSize,
      dx: v1.dx, dy: v1.dy, radius: 7.0, team: 1, palette: TEAM_PALETTES[1]
    });
    balls.push({
      x: (GRID_SIZE * 0.75) * tileSize, y: (GRID_SIZE * 0.25) * tileSize,
      dx: v2.dx, dy: v2.dy, radius: 7.0, team: 2, palette: TEAM_PALETTES[2]
    });
    balls.push({
      x: (GRID_SIZE * 0.25) * tileSize, y: (GRID_SIZE * 0.25) * tileSize,
      dx: v3.dx, dy: v3.dy, radius: 7.0, team: 3, palette: TEAM_PALETTES[3]
    });
  } else if (teamCount === 5) {
    const spawns5 = [
      { c: 4.8, r: 15.5 },  // Ball 0 spawns in Sector 2
      { c: 25.0, r: 8.2 },  // Ball 1 spawns in Sector 4
      { c: 24.9, r: 22.9 }, // Ball 2 spawns in Sector 0
      { c: 11.3, r: 26.0 }, // Ball 3 spawns in Sector 1
      { c: 11.4, r: 5.0 }   // Ball 4 spawns in Sector 3
    ];
    for (let i = 0; i < 5; i++) {
      const v = getRandomVelocity(3.0, 0.5);
      balls.push({
        x: spawns5[i].c * tileSize, y: spawns5[i].r * tileSize,
        dx: v.dx, dy: v.dy, radius: 6.5, team: i, palette: TEAM_PALETTES[i % TEAM_PALETTES.length]
      });
    }
  } else if (teamCount === 6) {
    const spawns6 = [
      { c: 5.3, r: 8.8 },   // Ball 0 spawns in Sector 3
      { c: 15.6, r: 4.8 },  // Ball 1 spawns in Sector 4
      { c: 25.7, r: 8.9 },  // Ball 2 spawns in Sector 5
      { c: 25.7, r: 22.2 }, // Ball 3 spawns in Sector 0
      { c: 15.4, r: 26.2 }, // Ball 4 spawns in Sector 1
      { c: 5.3, r: 22.1 }   // Ball 5 spawns in Sector 2
    ];
    for (let i = 0; i < 6; i++) {
      const v = getRandomVelocity(2.9, 0.5);
      balls.push({
        x: spawns6[i].c * tileSize, y: spawns6[i].r * tileSize,
        dx: v.dx, dy: v.dy, radius: 6.0, team: i, palette: TEAM_PALETTES[i % TEAM_PALETTES.length]
      });
    }
  }

  // Update dynamic HUD stats & ambient glow
  if (typeof updateHUDStructure === 'function') updateHUDStructure();
  updateTerritoryScore();

  const ambientGlow = document.getElementById('ambient-glow');
  if (ambientGlow && TEAM_PALETTES[0]) {
    ambientGlow.style.background = `radial-gradient(circle, ${TEAM_PALETTES[0].color} 0%, transparent 70%)`;
  }
}

function addFlipParticles(x, y, color) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x + tileSize / 2,
      y: y + tileSize / 2,
      vx: (Math.random() - 0.5) * 2.8,
      vy: (Math.random() - 0.5) * 2.8,
      size: Math.random() * 2 + 1.5,
      color: color,
      alpha: 1.0,
      life: 0.93
    });
  }
}

function addShockwave(x, y, color) {
  shockwaves.push({
    x: x, y: y, radius: 2, maxRadius: 55, color: color, alpha: 0.8
  });
}

function addInkBloom(x, y, row, col, fromTeam, toTeam) {
  const fromColor = TEAM_PALETTES[fromTeam % TEAM_PALETTES.length]?.color || '#ffffff';
  const toColor = TEAM_PALETTES[toTeam % TEAM_PALETTES.length]?.color || '#ffffff';
  inkBlooms.push({
    x: x,
    y: y,
    row: row,
    col: col,
    fromColor: fromColor,
    toColor: toColor,
    startTime: performance.now(),
    duration: 130,
    maxRadius: tileSize * 1.55
  });
}

function updateTerritoryScore() {
  if (!grid || grid.length === 0) return;
  const counts = new Array(teamCount).fill(0);
  const total = GRID_SIZE * GRID_SIZE;

  for (let r = 0; r < GRID_SIZE; r++) {
    if (!grid[r]) continue;
    for (let c = 0; c < GRID_SIZE; c++) {
      const t = grid[r][c];
      if (t < teamCount) counts[t]++;
    }
  }

  for (let t = 0; t < teamCount; t++) {
    const pct = Math.round((counts[t] / total) * 100);
    const scoreEl = document.getElementById(`score-${t}`);
    const segEl = document.getElementById(`seg-${t}`);
    if (scoreEl) scoreEl.innerText = `${pct}%`;
    if (segEl) segEl.style.width = `${pct}%`;
  }
}

function getNoteForCoord(row) {
  const currentStyle = SOUND_STYLES[currentStyleId] || SOUND_STYLES.lofi;
  const currentChord = currentStyle.chords[activeChordIndex % currentStyle.chords.length];
  const freqs = currentChord.baseFreqs;
  const noteIdx = Math.floor((row / GRID_SIZE) * freqs.length) % freqs.length;
  return freqs[freqs.length - 1 - noteIdx];
}

function updatePhysics() {
  if (isPaused || !grid || grid.length === 0 || !balls || balls.length === 0) return;

  const MAX_SPEED = 6.0;

  for (let b = 0; b < balls.length; b++) {
    const ball = balls[b];
    ball.x += ball.dx * speedMultiplier;
    ball.y += ball.dy * speedMultiplier;

    // Boundary Bounces
    let hitWall = false;
    let wallPan = (ball.x / width) * 1.6 - 0.8;

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.dx = Math.abs(ball.dx);
      hitWall = true;
      wallPan = -0.85;
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.dx = -Math.abs(ball.dx);
      hitWall = true;
      wallPan = 0.85;
    }

    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.dy = Math.abs(ball.dy);
      hitWall = true;
    } else if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      ball.dy = -Math.abs(ball.dy);
      hitWall = true;
    }

    if (hitWall) {
      synth.playWallHit(wallPan, ball.team);
    }

    // Clamp speed after boundary adjustment
    const speed = Math.hypot(ball.dx, ball.dy);
    if (speed > MAX_SPEED) {
      ball.dx = (ball.dx / speed) * MAX_SPEED;
      ball.dy = (ball.dy / speed) * MAX_SPEED;
    }

    // Multi-point Collision Sampling
    const testPoints = [
      { x: ball.x + Math.sign(ball.dx) * ball.radius, y: ball.y, axis: 'x' },
      { x: ball.x, y: ball.y + Math.sign(ball.dy) * ball.radius, axis: 'y' }
    ];

    for (const pt of testPoints) {
      const col = Math.floor(pt.x / tileSize);
      const row = Math.floor(pt.y / tileSize);

      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        if (grid[row] && grid[row][col] !== ball.team) {
          const prevTeam = grid[row][col];
          grid[row][col] = ball.team;

          if (pt.axis === 'x') ball.dx = -ball.dx;
          if (pt.axis === 'y') ball.dy = -ball.dy;

          const freq = getNoteForCoord(row);
          const pan = (col / GRID_SIZE) * 1.6 - 0.8;
          synth.playNote(freq, pan, ball.team);

          // Outermost perimeter clash triggers boundary percussion accent
          const isPerimeter = (row === 0 || row === GRID_SIZE - 1 || col === 0 || col === GRID_SIZE - 1);
          if (isPerimeter) {
            synth.playWallHit(pan, ball.team);
          }

          addInkBloom(pt.x, pt.y, row, col, prevTeam, ball.team);
          addFlipParticles(col * tileSize, row * tileSize, ball.palette.color);
          addShockwave(pt.x, pt.y, ball.palette.color);

          chordHitsCounter++;
          if (chordHitsCounter >= CHORD_CHANGE_HITS) {
            chordHitsCounter = 0;
            const currentStyle = SOUND_STYLES[currentStyleId] || SOUND_STYLES.lofi;
            activeChordIndex = (activeChordIndex + 1) % currentStyle.chords.length;
            
            const chordNameEl = document.getElementById('chord-name');
            if (chordNameEl) {
              chordNameEl.innerText = currentStyle.chords[activeChordIndex].name;
              if (typeof gsap !== 'undefined') {
                gsap.fromTo(chordNameEl, { scale: 1.4, color: '#f59e0b' }, { scale: 1.0, color: '#38bdf8', duration: 0.5, ease: "power2.out" });
              }
            }
          }

          updateTerritoryScore();
          break;
        }
      }
    }
  }

  // Particle & Shockwave physics step (executes even when tab is backgrounded)
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.radius += 2.0;
    sw.alpha *= 0.93;
    if (sw.radius > sw.maxRadius || sw.alpha < 0.05) shockwaves.splice(i, 1);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha *= p.life;
    if (p.alpha < 0.05) particles.splice(i, 1);
  }

  // Prune expired inkBlooms and cap buffer to prevent background tab memory buildup
  const now = performance.now();
  for (let i = inkBlooms.length - 1; i >= 0; i--) {
    if (now - inkBlooms[i].startTime >= inkBlooms[i].duration) {
      inkBlooms.splice(i, 1);
    }
  }
  if (inkBlooms.length > 40) {
    inkBlooms.splice(0, inkBlooms.length - 40);
  }
}

function render() {
  if (!grid || grid.length === 0 || !balls || balls.length === 0) return;

  // 1. Fill base with sleek dark frontier seam
  ctx.fillStyle = '#080c18';
  ctx.fillRect(0, 0, width, height);

  // 2. Organic Territory with Auto-Tiling Filleted Corners
  const R = Math.max(4, Math.floor(tileSize * 0.44));

  const isSameTeam = (r, c, team) => {
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    return grid[r] && grid[r][c] === team;
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    if (!grid[r]) continue;
    const y0 = Math.floor(r * tileSize);
    const y1 = Math.floor((r + 1) * tileSize);

    for (let c = 0; c < GRID_SIZE; c++) {
      const t = grid[r][c];
      if (t === undefined || !TEAM_PALETTES[t % TEAM_PALETTES.length]) continue;

      const x0 = Math.floor(c * tileSize);
      const x1 = Math.floor((c + 1) * tileSize);

      const upSame = isSameTeam(r - 1, c, t);
      const downSame = isSameTeam(r + 1, c, t);
      const leftSame = isSameTeam(r, c - 1, t);
      const rightSame = isSameTeam(r, c + 1, t);

      // Overlap by 1 full integer pixel ONLY if adjacent neighbor is same team
      const w = (x1 - x0) + (rightSame ? 1 : 0);
      const h = (y1 - y0) + (downSame ? 1 : 0);

      // Convex (exterior) corner fillets
      const rTL = (!upSame && !leftSame) ? R : 0;
      const rTR = (!upSame && !rightSame) ? R : 0;
      const rBR = (!downSame && !rightSame) ? R : 0;
      const rBL = (!downSame && !leftSame) ? R : 0;

      ctx.fillStyle = TEAM_PALETTES[t % TEAM_PALETTES.length].color;

      // Main tile body with convex fillets
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, h, [rTL, rTR, rBR, rBL]);
      ctx.fill();

      // Concave (interior) corner fillets to smoothly bridge transitions
      if (upSame && leftSame && !isSameTeam(r - 1, c - 1, t)) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 - R, y0);
        ctx.arcTo(x0, y0, x0, y0 - R, R);
        ctx.closePath();
        ctx.fill();
      }
      if (upSame && rightSame && !isSameTeam(r - 1, c + 1, t)) {
        ctx.beginPath();
        ctx.moveTo(x1, y0);
        ctx.lineTo(x1 + R, y0);
        ctx.arcTo(x1, y0, x1, y0 - R, R);
        ctx.closePath();
        ctx.fill();
      }
      if (downSame && rightSame && !isSameTeam(r + 1, c + 1, t)) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + R, y1);
        ctx.arcTo(x1, y1, x1, y1 + R, R);
        ctx.closePath();
        ctx.fill();
      }
      if (downSame && leftSame && !isSameTeam(r + 1, c - 1, t)) {
        ctx.beginPath();
        ctx.moveTo(x0, y1);
        ctx.lineTo(x0 - R, y1);
        ctx.arcTo(x0, y1, x0, y1 + R, R);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // 3. Radial Ink Blooms (smooth conquest expansion waves)
  const now = performance.now();
  for (let i = inkBlooms.length - 1; i >= 0; i--) {
    const bloom = inkBlooms[i];
    const elapsed = now - bloom.startTime;
    if (elapsed >= bloom.duration) {
      inkBlooms.splice(i, 1);
      continue;
    }

    const p = elapsed / bloom.duration;
    // Fast power2.out ease
    const easeProgress = 1 - Math.pow(1 - p, 2);
    const r = bloom.maxRadius * easeProgress;

    ctx.save();
    // Clip bloom strictly inside the captured grid tile
    const clipX = Math.floor(bloom.col * tileSize);
    const clipY = Math.floor(bloom.row * tileSize);
    const clipW = Math.floor((bloom.col + 1) * tileSize) - clipX + 1;
    const clipH = Math.floor((bloom.row + 1) * tileSize) - clipY + 1;

    ctx.beginPath();
    ctx.rect(clipX, clipY, clipW, clipH);
    ctx.clip();

    ctx.beginPath();
    ctx.arc(bloom.x, bloom.y, r, 0, Math.PI * 2);
    ctx.fillStyle = bloom.toColor;
    ctx.fill();

    // Luminous micro-ring on initial impact
    if (p < 0.35) {
      const ringAlpha = (1 - p / 0.35) * 0.75;
      ctx.beginPath();
      ctx.arc(bloom.x, bloom.y, Math.max(1, r * 0.82), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.strokeStyle = sw.color;
    ctx.globalAlpha = sw.alpha;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  // 5. Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // 6. Glowing Balls
  for (const ball of balls) {
    if (!ball || !ball.palette) continue;
    ctx.save();
    ctx.shadowColor = ball.palette.glow;
    ctx.shadowBlur = 18;
    ctx.fillStyle = ball.palette.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x - ball.radius * 0.28, ball.y - ball.radius * 0.28, ball.radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// --- Decoupled Engine Architecture (Background Tab Audio & Physics Support) ---
let tickerWorker = null;
let workerActive = false;
try {
  const workerBlob = new Blob([`
    let timer = null;
    self.onmessage = function(e) {
      if (e.data === 'start') {
        if (!timer) {
          timer = setInterval(function() {
            self.postMessage('tick');
          }, 1000 / 60);
        }
      } else if (e.data === 'stop') {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }
    };
  `], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(workerBlob);
  tickerWorker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);
  tickerWorker.onmessage = function() {
    workerActive = true;
    if (!isPaused) {
      updatePhysics();
    }
  };
  tickerWorker.postMessage('start');
} catch (err) {
  console.warn('Web Worker fallback to rAF loop:', err);
}

function renderLoop() {
  if (document.visibilityState === 'visible') {
    render();
  }
  if (!workerActive && !isPaused) {
    updatePhysics();
  }
  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
