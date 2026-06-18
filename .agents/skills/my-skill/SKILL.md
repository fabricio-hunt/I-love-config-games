---
name: techkid-educational-game
description: >
  Build educational browser games for young children (ages 4–7) using pure HTML, CSS, and JavaScript.
  Covers architecture, UX patterns, accessibility, audio, animation, and phase-by-phase implementation
  for the TechKid 5-phase game. Use when asked to create, extend, or fix any phase of TechKid, or
  when building similar single-file browser games for kids.
---

# TechKid — Educational Game Skill

> Build fun, accessible, and beautifully animated educational browser games for children aged 4–7.
> Pure HTML/CSS/JS — no frameworks, no build tools, no backend. Works offline.

---

## When to Use

- User asks to implement or fix a phase of TechKid
- User wants to build a new educational mini-game for kids
- User needs drag-and-drop, touch support, or child-friendly UI patterns
- User wants sounds, fireworks, or celebration animations without external assets

---

## Project Architecture

```
/project-root/
├── index.html              ← Main menu + phase selector
├── techkid_game_spec.html  ← Full game specification
├── phase1/phase.html       ← Phase 1: Smartphone organizer (Drag & Drop)
├── phase2/phase.html       ← Phase 2: Wi-Fi setup (Sequence puzzle)
├── phase3/phase.html       ← Phase 3: Build a PC (Snap-fit puzzle)
├── phase4/phase.html       ← Phase 4: Program a robot (Visual coding)
└── phase5/phase.html       ← Phase 5: Talk to AI (Anthropic API chat)
```

### Phase Contract (MUST follow in every phase)

| Rule              | Value                                               |
|-------------------|-----------------------------------------------------|
| Single file       | `phase.html` — all CSS and JS inline               |
| Save progress     | `localStorage.setItem('phaseN_done', 'true')`      |
| Save stars        | `localStorage.setItem('phaseN_stars', '1\|2\|3')`  |
| Return to menu    | `window.location.href = '../index.html'`           |
| Font              | Nunito (Google Fonts) — round and friendly         |
| Primary palette   | See per-phase color below                          |
| Sound             | Web Audio API only — zero external assets          |

---

## Design System

### Color Palette

| Phase | Color     | Hex       | Usage                        |
|-------|-----------|-----------|------------------------------|
| 1     | Coral Red | `#FF6B6B` | Smartphone / Drag-and-drop   |
| 2     | Teal      | `#4ECDC4` | Wi-Fi / Sequence steps       |
| 3     | Yellow    | `#FFE66D` | PC build / Snap puzzle       |
| 4     | Mint      | `#A8E6CF` | Robot / Visual programming   |
| 5     | Lavender  | `#C3B1E1` | AI chat / Conversational UI  |

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

body { font-family: 'Nunito', sans-serif; }
```

- Headings: `font-weight: 900`, large sizes (clamp for responsive)
- Body: `font-weight: 600` minimum — children need bold, readable text
- Labels: `font-weight: 700`, never below `0.75rem`

### Spacing & Radius

```css
:root {
  --radius: 24px;      /* cards, phones, large containers */
  --radius-sm: 14px;   /* buttons, chips, small elements  */
  --radius-pill: 50px; /* badges, counters                */
}
```

---

## UX Patterns for Children

### 1. Feedback — Always Immediate

```js
// ✅ Correct answer
function onCorrect(element) {
  element.classList.add('flash-green');        // CSS animation
  playSound('correct');                         // cheerful beep
  setTimeout(() => element.classList.remove('flash-green'), 500);
}

// ❌ Wrong answer
function onWrong(element) {
  element.classList.add('shake-red');          // CSS shake
  playSound('wrong');                           // low buzz
  setTimeout(() => element.classList.remove('shake-red'), 500);
}
```

### 2. Flash Green (Correct)

```css
@keyframes flashGreen {
  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(82,196,26,0); }
  30%  { transform: scale(1.2);  box-shadow: 0 0 0 8px rgba(82,196,26,0.4); }
  60%  { transform: scale(0.95); box-shadow: 0 0 0 4px rgba(82,196,26,0.2); }
  100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(82,196,26,0); }
}
.flash-green { animation: flashGreen 0.5s ease; }
```

### 3. Shake Red (Wrong)

```css
@keyframes shakeRed {
  0%, 100% { transform: translateX(0); }
  15%  { transform: translateX(-8px) rotate(-2deg); }
  30%  { transform: translateX(8px)  rotate(2deg); }
  45%  { transform: translateX(-6px) rotate(-1deg); }
  60%  { transform: translateX(6px)  rotate(1deg); }
  75%  { transform: translateX(-4px); }
  90%  { transform: translateX(4px); }
}
.shake-red { animation: shakeRed 0.5s ease; }
```

### 4. Pop-in (Element Appears)

```css
@keyframes popIn {
  0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg);   opacity: 1; }
}
.pop-in { animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
```

### 5. Star Rating

```js
// errors === 0 → 3 stars | errors === 1 → 2 stars | errors >= 2 → 1 star
function calcStars(errors) {
  if (errors === 0) return 3;
  if (errors === 1) return 2;
  return 1;
}

function showStars(stars) {
  for (let i = 1; i <= 3; i++) {
    const star = document.getElementById('star' + i);
    if (i <= stars) {
      setTimeout(() => {
        star.classList.add('earned');
        playSound('correct');
      }, i * 300); // stagger the reveal
    }
  }
}
```

---

## Drag & Drop (Mouse + Touch)

### Mouse Events

```js
el.setAttribute('draggable', 'true');
el.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', el.dataset.itemId);
  el.classList.add('dragging');
});
el.addEventListener('dragend', () => el.classList.remove('dragging'));

dropZone.addEventListener('dragover',  (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const id = e.dataTransfer.getData('text/plain');
  handleDrop(id, dropZone.dataset.zoneId);
});
```

### Touch Events (mobile support — REQUIRED)

```js
el.addEventListener('touchstart', (e) => {
  draggingId = el.dataset.itemId;
  el.classList.add('dragging');
  showGhost(e.touches[0]);
  e.preventDefault();
}, { passive: false });

el.addEventListener('touchmove', (e) => {
  moveGhost(e.touches[0]);
  highlightZoneUnderFinger(e.touches[0]);
  e.preventDefault();
}, { passive: false });

el.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const zone = getZoneUnderPoint(touch.clientX, touch.clientY);
  if (zone) handleDrop(draggingId, zone.dataset.zoneId);
  hideGhost();
  el.classList.remove('dragging');
});

// Ghost element follows the finger
function showGhost(touch) {
  ghost.textContent = ITEMS[draggingId].emoji;
  ghost.style.display = 'block';
  moveGhost(touch);
}
function moveGhost(touch) {
  ghost.style.left = touch.clientX + 'px';
  ghost.style.top  = touch.clientY + 'px';
}
function hideGhost() { ghost.style.display = 'none'; }

// Find drop zone under finger using elementFromPoint
function getZoneUnderPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  return el ? el.closest('[data-zone-id]') : null;
}
```

### Ghost Element CSS

```css
.drag-ghost {
  position: fixed;
  pointer-events: none;
  z-index: 999;
  font-size: 2.5rem;
  transform: translate(-50%, -50%) scale(1.15) rotate(5deg);
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
  transition: transform 0.1s;
}
```

---

## Web Audio API Sounds (No External Files)

```js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'correct') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, audioCtx.currentTime);        // C5
    osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);  // E5
    osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);  // G5
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.5);
  }

  else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.setValueAtTime(150, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
  }

  else if (type === 'victory') {
    // Ascending arpeggio — C E G C (one octave up)
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = audioCtx.currentTime + i * 0.15;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.4, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.start(t);
      o.stop(t + 0.4);
    });
  }
}
```

---

## CSS Fireworks (No Canvas, No Libraries)

```js
function launchFirework(x, y) {
  const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#A8E6CF', '#FF9FF3', '#C3B1E1'];
  const container = document.getElementById('fireworks');

  for (let i = 0; i < 16; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    const angle = (i / 16) * 360;
    const dist  = 60 + Math.random() * 60;
    spark.style.cssText = `
      position: absolute;
      left: ${x}px; top: ${y}px;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
      --dx: ${Math.cos(angle * Math.PI / 180) * dist}px;
      --dy: ${Math.sin(angle * Math.PI / 180) * dist}px;
      animation: spark-fly ${0.6 + Math.random() * 0.4}s ease-out forwards;
      animation-delay: ${Math.random() * 0.1}s;
    `;
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 1200);
  }
}

function launchFireworksShow() {
  const W = window.innerWidth, H = window.innerHeight;
  const spots = [[.2,.3],[.8,.25],[.5,.4],[.3,.5],[.7,.45],[.15,.6],[.85,.55]];
  spots.forEach(([rx, ry], i) =>
    setTimeout(() => launchFirework(W * rx, H * ry), i * 180)
  );
}
```

```css
@keyframes spark-fly {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}
```

---

## Victory Modal Template

```html
<div class="victory-overlay" id="victoryOverlay">
  <div class="victory-card">
    <span class="victory-emoji">🎉</span>
    <div class="victory-title">Parabéns!</div>
    <div class="victory-subtitle" id="victorySubtitle"></div>
    <div class="stars-display">
      <span class="star-big" id="star1">⭐</span>
      <span class="star-big" id="star2">⭐</span>
      <span class="star-big" id="star3">⭐</span>
    </div>
    <div class="victory-btns">
      <button class="btn btn-secondary" id="btnReplay">🔄 Jogar de novo</button>
      <a href="../index.html" class="btn btn-primary">🏠 Menu</a>
    </div>
  </div>
</div>
```

```js
function triggerVictory() {
  const stars = calcStars(errors);
  localStorage.setItem('phaseN_done', 'true');
  localStorage.setItem('phaseN_stars', String(stars));

  const messages = {
    3: '🌟 Perfeito! Zero erros! Incrível!',
    2: '😊 Muito bem! Quase perfeito!',
    1: '👍 Boa! Da próxima você vai melhor!',
  };
  document.getElementById('victorySubtitle').textContent = messages[stars];

  setTimeout(() => { launchFireworksShow(); playSound('victory'); }, 300);
  setTimeout(() => {
    document.getElementById('victoryOverlay').classList.add('show');
    showStars(stars);
  }, 700);
}
```

---

## Phase Specifications

### Phase 1 — 📱 Organizar a Tela do Celular
**Status:** ✅ Implemented  
**File:** `phase1/phase.html`  
**Color:** `#FF6B6B`  
**Mechanic:** Drag & Drop  

| Item         | Detail                                              |
|--------------|-----------------------------------------------------|
| Apps         | 8 icons (📷 📸 ⛏️ 🏎️ 🧩 ⚙️ 📡 🧮)                 |
| Folders      | 3 targets: 📸 Fotos · 🎮 Jogos · ⚙️ Ferramentas    |
| Feedback     | Flash green (correct) / Shake red (wrong)           |
| Victory      | All apps sorted → CSS fireworks + modal             |
| Stars        | 0 errors = ⭐⭐⭐ · 1 error = ⭐⭐ · 2+ = ⭐          |

---

### Phase 2 — 📶 Conectar o Wi-Fi
**Status:** 🔜 Next  
**File:** `phase2/phase.html`  
**Color:** `#4ECDC4`  
**Mechanic:** Sequence / Step-by-step  

| Item         | Detail                                              |
|--------------|-----------------------------------------------------|
| Steps        | 4 ordered stages with progress arrow               |
| Password     | 3 colored symbols (🔴🔵🟡) in correct order         |
| Feedback     | Animated checkmark on each completed step           |
| Error        | Screen shakes + restart step                        |
| Victory      | Wi-Fi signal animation grows + connection sound     |

**AI Prompt:**
```
Create a single-file HTML simulating a smartphone Wi-Fi settings screen.
Child clicks big buttons to follow 4 steps. Password is 3 colored symbols in order.
Palette #4ECDC4. Nunito font. localStorage. Back button. For age 5.
```

---

### Phase 3 — 🖥️ Montar o Computador
**Status:** 🔜 Pending  
**File:** `phase3/phase.html`  
**Color:** `#FFE66D`  
**Mechanic:** Snap-fit Drag & Drop  

| Item         | Detail                                              |
|--------------|-----------------------------------------------------|
| Parts        | 5 pieces: 🖱️ 🌐️ 🖥️ 🔌 💾                          |
| Drop zones   | Dashed outline shaped like each part                |
| Snap         | Part jumps and locks in with animation              |
| Victory      | Computer "powers on" with boot animation            |
| Stars        | Based on wrong drop attempts                        |

---

### Phase 4 — 🤖 Programar o Robô
**Status:** 🔜 Pending  
**File:** `phase4/phase.html`  
**Color:** `#A8E6CF`  
**Mechanic:** Visual programming / Sequence  

| Item         | Detail                                              |
|--------------|-----------------------------------------------------|
| Grid         | 4×4 colored squares                                 |
| Blocks       | ⬆️ ⬇️ ⬅️ ➡️ draggable command cards                |
| Track        | Up to 6 slots to build sequence                     |
| Play         | Robot animates step-by-step through grid            |
| Collision    | Robot hits wall → shake + reset                     |
| Victory      | Robot reaches star → fireworks + sound              |

---

### Phase 5 — 🧠 Falar com a IA
**Status:** 🔜 Pending  
**File:** `phase5/phase.html`  
**Color:** `#C3B1E1`  
**Mechanic:** Chat (Anthropic API)  

| Item         | Detail                                                        |
|--------------|---------------------------------------------------------------|
| Model        | `claude-haiku-4-5`                                            |
| System       | "Você é Robô Amigo. Responda em 1–2 frases com emojis, para crianças de 5 anos." |
| UI           | Chat bubbles — robot left, child right                        |
| Input        | 3–4 preset question buttons + simple text field              |
| Limit        | Max 10 messages per session + reset button                    |
| API key      | `config.js` (not committed)                                   |

```js
async function sendMessage(text) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 150,
      system: 'Você é Robô Amigo. Responda sempre em 1 ou 2 frases curtinhas, com emojis, para uma criança de 5 anos.',
      messages: [{ role: 'user', content: text }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}
```

---

## LocalStorage API

```js
// Save phase progress
localStorage.setItem('phase1_done',  'true');
localStorage.setItem('phase1_stars', '3');        // '1' | '2' | '3'

// Read in index.html (main menu)
const done    = localStorage.getItem('phase1_done')  === 'true';
const stars   = parseInt(localStorage.getItem('phase1_stars') || '0');
const unlocked = index === 0 || localStorage.getItem(`phase${index}_done`) === 'true';
```

---

## Child-Friendly UX Checklist

- [ ] All interactive targets are ≥ 44×44px (touch target minimum)
- [ ] Emoji used as primary visual language — no reading required
- [ ] Error feedback never punishes — always encouraging
- [ ] Font weight ≥ 600 everywhere
- [ ] Colors are high-contrast (WCAG AA)
- [ ] No timer pressure — play at their own pace
- [ ] Back button always visible
- [ ] Replay button always available after victory
- [ ] Touch events supported alongside mouse events
- [ ] Sounds are soft, musical, never startling

---

## Implementation Order

When asked to implement a new phase:

1. Read this skill and the game spec (`techkid_game_spec.html`)
2. Create `phaseN/phase.html` as a single self-contained file
3. Use the phase's designated color palette
4. Implement mouse drag + touch drag
5. Add Web Audio API sounds (no external files)
6. Add CSS animations (flashGreen, shakeRed, fireworks)
7. Save `phaseN_done` and `phaseN_stars` to localStorage
8. Include `← Voltar` button linking to `../index.html`
9. Test on mobile viewport (375px wide)
10. Commit with: `feat(phaseN): add [phase name] game`
