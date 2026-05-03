import { useEffect, useState } from 'react';

/**
 * Returns the number of milliseconds remaining until `targetMs`. Updates every
 * second. Pass `null` to disable.
 */
export function useCountdown(targetMs) {
  const compute = () => (targetMs ? Math.max(0, targetMs - Date.now()) : 0);
  const [remaining, setRemaining] = useState(compute);

  useEffect(() => {
    if (!targetMs) return undefined;
    setRemaining(compute());
    const id = setInterval(() => setRemaining(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs]);

  return remaining;
}
