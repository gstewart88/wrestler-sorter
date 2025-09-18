// Fisher–Yates shuffle: returns a new array with elements in random order
export default function shuffleArray(arr) {
  const a = arr.slice(); // copy so we don't mutate original
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}