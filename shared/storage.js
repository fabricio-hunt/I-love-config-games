/* ═══════════════════════════════════════════════════════════════════════════
   TechKid — Shared LocalStorage Utilities
   Usage: <script src="../shared/storage.js"></script>
   ═══════════════════════════════════════════════════════════════════════════ */

const TechKidStorage = (() => {

  /**
   * Save phase completion and star rating.
   * @param {number} phaseId - Phase number (1–6)
   * @param {number} stars   - Star count (1, 2, or 3)
   */
  function savePhase(phaseId, stars) {
    localStorage.setItem(`phase${phaseId}_done`,  'true');
    localStorage.setItem(`phase${phaseId}_stars`, String(stars));
  }

  /**
   * Get the saved star count for a phase.
   * @param {number} phaseId
   * @returns {number} 0–3
   */
  function getStars(phaseId) {
    const v = localStorage.getItem(`phase${phaseId}_stars`);
    return v ? parseInt(v, 10) : 0;
  }

  /**
   * Check whether a phase has been completed.
   * @param {number} phaseId
   * @returns {boolean}
   */
  function isDone(phaseId) {
    return localStorage.getItem(`phase${phaseId}_done`) === 'true';
  }

  /**
   * Determine if a phase is unlocked.
   * Phase 1 is always unlocked; subsequent phases unlock when the previous is done.
   * @param {number} phaseIndex - Zero-based index (0 = Phase 1)
   * @returns {boolean}
   */
  function isUnlocked(phaseIndex) {
    if (phaseIndex === 0) return true;
    return isDone(phaseIndex); // phaseIndex == previous phase id
  }

  /**
   * Calculate stars from error count (standard TechKid formula).
   * @param {number} errors
   * @returns {number} 1, 2, or 3
   */
  function calcStars(errors) {
    if (errors === 0) return 3;
    if (errors === 1) return 2;
    return 1;
  }

  /**
   * Reset progress for a specific phase.
   * @param {number} phaseId
   */
  function resetPhase(phaseId) {
    localStorage.removeItem(`phase${phaseId}_done`);
    localStorage.removeItem(`phase${phaseId}_stars`);
  }

  /**
   * Reset ALL phase progress (for testing / dev use).
   */
  function resetAll() {
    for (let i = 1; i <= 6; i++) resetPhase(i);
  }

  return { savePhase, getStars, isDone, isUnlocked, calcStars, resetPhase, resetAll };
})();
