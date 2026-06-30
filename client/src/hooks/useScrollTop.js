import { useState, useEffect } from 'react';

/**
 * useScrollTop — returns true when the page has scrolled past `threshold` px
 */
const useScrollTop = (threshold = 50) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
};

export default useScrollTop;
