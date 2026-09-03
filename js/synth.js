/**
 * Lo-Fi Pong Wars - Web Audio Synthesizer Engine
 * Features: Polyphonic Dual-Oscillator Voices, Dynamic Filter Envelopes,
 * Stereo Panning, Delay Loop, Continuous Vinyl Crackle Generator, Wall Percussion.
 */

class LoFiSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.delaySend = null;
    this.vinylGain = null;
    this.isVinylEnabled = true;
    this.volume = 0.7;
    this.initialized = false;
    this.lastNoteTimes = [0, 0, 0, 0, 0, 0];
    this.noteThrottleMs = 40;
    this.lastWallHitTimes = [0, 0, 0, 0, 0, 0];
    this.wallThrottleMs = 60;
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Output Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Ambient Stereo Space / Delay Node
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
      
      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.32, this.ctx.currentTime);
      
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);

      delay.connect(feedback);
      feedback.connect(delayFilter);
      delayFilter.connect(delay);
      delayFilter.connect(this.masterGain);

      this.delaySend = this.ctx.createGain();
      this.delaySend.gain.setValueAtTime(0.38, this.ctx.currentTime);
      this.delaySend.connect(delay);

      this.masterGain.connect(this.ctx.destination);

      this.initVinyl();
      this.initialized = true;

      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    } catch (err) {
      console.warn("AudioContext init error:", err);
    }
  }

  initVinyl() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const brown = (Math.random() * 2 - 1) * 0.012;
      const crackle = Math.random() > 0.9995 ? (Math.random() * 2 - 1) * 0.22 : 0;
      data[i] = brown + crackle;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(750, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.9, this.ctx.currentTime);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(this.isVinylEnabled ? 0.35 : 0, this.ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);
    noise.start();
  }

  setVolume(val) {
    this.volume = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
    }
  }

  toggleVinyl() {
    this.isVinylEnabled = !this.isVinylEnabled;
    if (this.vinylGain && this.ctx) {
      this.vinylGain.gain.setTargetAtTime(this.isVinylEnabled ? 0.35 : 0, this.ctx.currentTime, 0.1);
    }
    return this.isVinylEnabled;
  }

  playNote(freq, pan = 0, teamIndex = 0) {
    if (!this.initialized || !this.ctx) return;
    if (this.ctx.state !== 'running') {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    
    // Throttle per-team note rate to prevent AudioNode overload
    const now_ms = performance.now();
    const tIdx = teamIndex % 6;
    if (now_ms - this.lastNoteTimes[tIdx] < this.noteThrottleMs) return;
    this.lastNoteTimes[tIdx] = now_ms;

    const now = this.ctx.currentTime;
    const currentStyle = SOUND_STYLES[currentStyleId] || SOUND_STYLES.lofi;
    const voice = currentStyle.voices[teamIndex % currentStyle.voices.length];
    const actualFreq = freq * (voice.mult || 1.0);

    // 1. Dual Oscillators with Voice Detune
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    osc1.type = voice.oscType || 'sine';
    osc2.type = voice.oscType === 'sawtooth' ? 'sawtooth' : 'sine';

    osc1.frequency.setValueAtTime(actualFreq, now);
    osc2.frequency.setValueAtTime(actualFreq * (voice.detune || 1.0025), now);

    // 2. Dynamic Filter Envelope
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(voice.filterStart || 1500, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, voice.filterEnd || 320), now + (voice.decay || 1.2));

    // 3. Amplitude Envelope (ADSR)
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(voice.gain || 0.24, now + (voice.attack || 0.008));
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (voice.decay || 1.35));

    // 4. Stereo Panning
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) panner.pan.setValueAtTime(pan, now);

    // Routing
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);

    if (panner) {
      gainNode.connect(panner);
      panner.connect(this.masterGain);
      panner.connect(this.delaySend);
    } else {
      gainNode.connect(this.masterGain);
      gainNode.connect(this.delaySend);
    }

    osc1.start(now);
    osc2.start(now);
    const stopTime = now + (voice.decay || 1.35) + 0.1;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  playWallHit(pan = 0, teamIndex = 0) {
    if (!this.initialized || !this.ctx || this.ctx.state !== 'running') return;

    const currentStyle = SOUND_STYLES[currentStyleId] || SOUND_STYLES.lofi;
    if (!currentStyle.wallVoices || currentStyle.wallVoices.length === 0) return;

    // Anti-machine gun throttle for wall hits (60ms per team)
    const now_ms = performance.now();
    const tIdx = teamIndex % 6;
    if (now_ms - this.lastWallHitTimes[tIdx] < this.wallThrottleMs) return;
    this.lastWallHitTimes[tIdx] = now_ms;

    const now = this.ctx.currentTime;
    const wallVoice = currentStyle.wallVoices[teamIndex % currentStyle.wallVoices.length];
    if (!wallVoice) return;

    const gainNode = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) panner.pan.setValueAtTime(pan, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = (wallVoice.type === 'brush' || wallVoice.type === 'noise') ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(wallVoice.filter || wallVoice.freq || 2500, now);
    if (wallVoice.type === 'noise') {
      filter.Q.setValueAtTime(1.2, now);
    }

    // Amplitude Envelope
    const decayTime = wallVoice.decay || 0.06;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(wallVoice.gain || 0.18, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

    if (wallVoice.type === 'brush' || wallVoice.type === 'noise') {
      const bufferSize = Math.max(512, Math.floor(this.ctx.sampleRate * decayTime));
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      if (panner) {
        gainNode.connect(panner);
        panner.connect(this.masterGain);
      } else {
        gainNode.connect(this.masterGain);
      }
      whiteNoise.start(now);
      whiteNoise.stop(now + decayTime + 0.02);
    } else {
      const osc = this.ctx.createOscillator();
      osc.type = (wallVoice.type === 'sub') ? 'sine' 
               : (wallVoice.type === 'tone') ? 'triangle' 
               : (wallVoice.type === 'click' && currentStyleId === 'chiptune') ? 'square' 
               : 'sine';

      osc.frequency.setValueAtTime(wallVoice.freq || 440, now);
      if (wallVoice.endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, wallVoice.endFreq), now + decayTime);
      }

      osc.connect(filter);
      filter.connect(gainNode);
      if (panner) {
        gainNode.connect(panner);
        panner.connect(this.masterGain);
      } else {
        gainNode.connect(this.masterGain);
      }

      osc.start(now);
      osc.stop(now + decayTime + 0.02);
    }
  }

  playChime() {
    if (!this.initialized) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      setTimeout(() => this.playNote(f, 0, 0), i * 160);
    });
  }
}

const synth = new LoFiSynth();

