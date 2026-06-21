import { useEffect, useState } from 'react';

export default function useCountUp(target = 0, duration = 1100) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return count;
}