// Count worst-case Ford–Johnson comparisons for n items
export function countComparisons(n) {
  function simulate(length) {
    if (length <= 1) return 0;

    let comp = 0;
    const winners = [];
    const losers  = [];

    // Pairing phase
    for (let i = 0; i + 1 < length; i += 2) {
      comp += 1;            // one comparison per pair
      winners.push(null);
      losers.push(null);
    }
    if (length % 2 === 1) {
      losers.push(null);    // odd element goes to losers
    }

    // Recursively count for winners
    comp += simulate(winners.length);

    // Insertion phase: binary‐insert each loser
    let chainLen = winners.length;
    for (let i = 0; i < losers.length; i++) {
      // worst‐case binary search cost = ceil(log2(chainLen+1))
      comp += Math.ceil(Math.log2(chainLen + 1));
      chainLen += 1;
    }

    return comp;
  }

  return simulate(n);
}
