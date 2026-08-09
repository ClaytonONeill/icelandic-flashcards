/**
 * 5 points per correct answer, plus a flat 25-point bonus for a perfect
 * deck. Simple and monotonic — avoids runaway numbers since deck size is
 * fixed at 20 (20/20 -> 125, 10/20 -> 50, 0/20 -> 0).
 */
export function calculateDeckPoints(correct: number, total: number): number {
  const perfectBonus = total > 0 && correct === total ? 25 : 0
  return correct * 5 + perfectBonus
}
