import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kleine Pause damit die Seiten-Animation starten kann,
    // dann smooth nach oben scrollen — wirkt fließend statt abrupt
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
