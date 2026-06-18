/* ═══════════════════════════════════════════════════════════════════════════
   TechKid — Shared Fireworks Utility
   Usage: <script src="../shared/fireworks.js"></script>
          TechKidFireworks.launchShow()          ← full celebration
          TechKidFireworks.launchFirework(x, y)  ← single burst at x,y
   Requires: .fireworks-container#fireworks and .spark CSS from shared/styles.css
   ═══════════════════════════════════════════════════════════════════════════ */

const TechKidFireworks = (() => {
  const COLORS = [
    '#FF6B6B', '#FFE66D', '#4ECDC4',
    '#A8E6CF', '#FF9FF3', '#C3B1E1',
    '#FFD700', '#87CEEB', '#98FB98',
  ];

  /**
   * Launch a single firework burst at screen coordinates (x, y).
   * @param {number} x - Left position in px
   * @param {number} y - Top position in px
   * @param {string} [containerId='fireworks'] - ID of the container div
   */
  function launchFirework(x, y, containerId = 'fireworks') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const count = 18;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';

      const angle    = (i / count) * 360 + (Math.random() * 10 - 5);
      const dist     = 55 + Math.random() * 75;
      const size     = 4 + Math.random() * 7;
      const duration = 0.55 + Math.random() * 0.5;
      const delay    = Math.random() * 0.08;

      spark.style.cssText = [
        `left: ${x}px`,
        `top: ${y}px`,
        `width: ${size}px`,
        `height: ${size}px`,
        `background: ${COLORS[i % COLORS.length]}`,
        `--dx: ${(Math.cos(angle * Math.PI / 180) * dist).toFixed(1)}px`,
        `--dy: ${(Math.sin(angle * Math.PI / 180) * dist).toFixed(1)}px`,
        `animation-duration: ${duration}s`,
        `animation-delay: ${delay}s`,
      ].join('; ');

      container.appendChild(spark);
      setTimeout(() => spark.remove(), (duration + delay) * 1000 + 100);
    }
  }

  /**
   * Launch a full celebration fireworks show across the screen.
   * @param {string} [containerId='fireworks']
   */
  function launchShow(containerId = 'fireworks') {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Wave 1 — spread across viewport
    const wave1 = [
      [0.20, 0.30], [0.80, 0.25], [0.50, 0.38],
      [0.30, 0.50], [0.70, 0.45],
    ];
    wave1.forEach(([rx, ry], i) =>
      setTimeout(() => launchFirework(W * rx, H * ry, containerId), i * 180)
    );

    // Wave 2 — slightly offset, after 1.4s
    const wave2 = [
      [0.15, 0.60], [0.85, 0.55], [0.50, 0.22], [0.40, 0.65], [0.65, 0.35],
    ];
    setTimeout(() => {
      wave2.forEach(([rx, ry], i) =>
        setTimeout(() => launchFirework(W * rx, H * ry, containerId), i * 140)
      );
    }, 1400);
  }

  return { launchFirework, launchShow };
})();
