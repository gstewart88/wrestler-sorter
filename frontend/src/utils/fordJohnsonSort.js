/**
 * Merge‐insertion (Ford–Johnson) sort using async compare callback.
 * @param {Array} arr         – items to sort
 * @param {Function} compare  – async (a, b) => preferred item
 * @returns {Promise<Array>}  – sorted array
 */
export default async function fordJohnsonSort(arr, compare) {
  const n = arr.length;
  if (n <= 1) return arr;

  // 1. Pair up and record winners & losers
  const winners = [];
  const losers  = [];
  for (let i = 0; i + 1 < n; i += 2) {
    const a = arr[i], b = arr[i + 1];
    const preferred = await compare(a, b);
    if (preferred === a) {
      winners.push(a);
      losers.push(b);
    } else {
      winners.push(b);
      losers.push(a);
    }
  }

  // If odd, last element goes straight to losers
  if (n % 2 === 1) {
    losers.push(arr[n - 1]);
  }

  // 2. Recursively sort winners
  const mainChain = await fordJohnsonSort(winners, compare);

  // 3. Insert each loser via binary insertion
  for (const item of losers) {
    let low = 0;
    let high = mainChain.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      // Ask user: do you prefer item or mainChain[mid]?
      const preferred = await compare(item, mainChain[mid]);
      if (preferred === item) {
        // item goes before position mid
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    mainChain.splice(low, 0, item);
  }

  return mainChain;
}
