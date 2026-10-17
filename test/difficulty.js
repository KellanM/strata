// One number for how demanding a puzzle is, from solveStats(). See
// docs/level-design.md. Roughly: deduction chain length, how little the clues
// give away up front, how much is hidden inside, and how big the block is.
export function difficulty(stats, puzzle) {
  return (
    stats.rounds * 0.6 +
    (1 - stats.opening) * 3 +
    stats.hidden * 3 +
    stats.interior * 2 +
    Math.log2(puzzle.size) * 0.5
  );
}
