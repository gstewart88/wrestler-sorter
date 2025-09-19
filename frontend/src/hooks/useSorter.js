import { useState, useRef, useCallback } from 'react';
import fordJohnsonSort from '../utils/fordJohnsonSort';
import { countComparisons } from '../utils/countComparisons';

export default function useSorter() {
  // Sorting state
  const [sorting, setSorting]                   = useState(false);
  const [currentPair, setCurrentPair]           = useState(null);
  const [awaiting, setAwaiting]                 = useState(null);
  const [result, setResult]                     = useState(null);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [completedComparisons, setCompletedComparisons] = useState(0);

  // Refs for cache & ignore set
  const ignoreSet = useRef(new Set());
  const cacheRef  = useRef(new Map());

  // Show prompt for a vs. b
  function compareUser(a, b) {
    return new Promise(resolve => {
      setCurrentPair({ a, b });
      setAwaiting(() => resolve);
    });
  }

  // Wrap compareUser with caching & ignore logic
  const compareWithCache = useCallback(
    async (a, b) => {
      const idA = a.id ?? a.name;
      const idB = b.id ?? b.name;

      if (ignoreSet.current.has(idA)) return b;
      if (ignoreSet.current.has(idB)) return a;

      const key = idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;
      if (cacheRef.current.has(key)) {
        return cacheRef.current.get(key) === idA ? a : b;
      }

      const winner = await compareUser(a, b);
      cacheRef.current.set(key, winner.id ?? winner.name);
      return winner;
    },
    []
  );

  // User clicks “Ignore”
  function handleIgnore(ignored) {
    if (!awaiting || !currentPair) return;
    const ignoreId = ignored.id ?? ignored.name;
    ignoreSet.current.add(ignoreId);

    const other  = ignored === currentPair.a ? currentPair.b : currentPair.a;
    const resolve = awaiting;
    setAwaiting(null);
    resolve(other);
  }

  // User makes a choice
  function handleChoice(chosen) {
    if (!awaiting) return;
    const resolve = awaiting;
    setAwaiting(null);
    resolve(chosen);
  }

  // Exit/cancel the flow early
  function handleExit() {
    setSorting(false);
    setCurrentPair(null);
    setAwaiting(null);
    setResult(null);
    ignoreSet.current.clear();
    cacheRef.current.clear();
    setTotalComparisons(0);
    setCompletedComparisons(0);
  }

  // Start sorting on a provided array
  async function handleStart(toSort) {
    setSorting(true);
    ignoreSet.current.clear();
    cacheRef.current.clear();

    const estimate = countComparisons(toSort.length);
    setTotalComparisons(estimate);
    setCompletedComparisons(0);

    const realCompare = async (a, b) => {
      const winner = await compareWithCache(a, b);
      setCompletedComparisons(c => c + 1);
      return winner;
    };

    const sorted = await fordJohnsonSort(toSort, realCompare);
    setResult(sorted);
    setCurrentPair(null);
    setSorting(false);
  }

  return {
    sorting,
    currentPair,
    totalComparisons,
    completedComparisons,
    result,
    handleStart,
    handleChoice,
    handleIgnore,
    handleExit,
    ignoredSet: ignoreSet.current
  };
}
