/* ═══════════════════════════════════════════════════════════════════════════
   TechKid — Shared Audio Utilities
   Usage: <script src="../shared/audio.js"></script>
          TechKidAudio.playSound('correct' | 'wrong' | 'victory' | 'step' | 'click')
   ═══════════════════════════════════════════════════════════════════════════ */

const TechKidAudio = (() => {
  let ctx = null;

  /** Lazily create AudioContext on first user gesture */
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** Play a named sound effect */
  function playSound(type) {
    try {
      const ac = getCtx();

      switch (type) {

        case 'correct': {
          // Happy ascending triad C5 → E5 → G5
          const osc = ac.createOscillator(), g = ac.createGain();
          osc.connect(g); g.connect(ac.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523, ac.currentTime);
          osc.frequency.setValueAtTime(659, ac.currentTime + 0.10);
          osc.frequency.setValueAtTime(784, ac.currentTime + 0.20);
          g.gain.setValueAtTime(0.38, ac.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55);
          osc.start(ac.currentTime);
          osc.stop(ac.currentTime + 0.55);
          break;
        }

        case 'wrong': {
          // Low dissonant buzz
          const osc = ac.createOscillator(), g = ac.createGain();
          osc.connect(g); g.connect(ac.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(210, ac.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, ac.currentTime + 0.25);
          g.gain.setValueAtTime(0.28, ac.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.32);
          osc.start(ac.currentTime);
          osc.stop(ac.currentTime + 0.32);
          break;
        }

        case 'victory': {
          // Ascending arpeggio C5 E5 G5 C6
          [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = ac.createOscillator(), g = ac.createGain();
            osc.connect(g); g.connect(ac.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            const t = ac.currentTime + i * 0.15;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.38, t + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
            osc.start(t);
            osc.stop(t + 0.45);
          });
          break;
        }

        case 'step': {
          // Soft tick for progress steps
          const osc = ac.createOscillator(), g = ac.createGain();
          osc.connect(g); g.connect(ac.destination);
          osc.type = 'sine';
          osc.frequency.value = 440;
          g.gain.setValueAtTime(0.22, ac.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
          osc.start(ac.currentTime);
          osc.stop(ac.currentTime + 0.18);
          break;
        }

        case 'click': {
          // UI button click
          const osc = ac.createOscillator(), g = ac.createGain();
          osc.connect(g); g.connect(ac.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, ac.currentTime);
          osc.frequency.exponentialRampToValueAtTime(500, ac.currentTime + 0.08);
          g.gain.setValueAtTime(0.2, ac.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
          osc.start(ac.currentTime);
          osc.stop(ac.currentTime + 0.1);
          break;
        }

        default:
          console.warn('[TechKidAudio] Unknown sound type:', type);
      }
    } catch (err) {
      // Audio is non-critical — fail silently
      console.warn('[TechKidAudio] Audio error:', err.message);
    }
  }

  return { playSound };
})();
