'use client';

import { useEffect, useRef } from 'react';
import { useTour, type TourPage } from './TourProvider';

/**
 * Hook to auto-start a tour on first visit to a page.
 * Waits for elements to be rendered before starting.
 */
export function useTourTrigger(page: TourPage, delay = 800) {
  const { startTour, hasSeenTour, markTourSeen, isReady } = useTour();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!isReady || hasTriggered.current) return;
    if (hasSeenTour(page)) return;

    hasTriggered.current = true;

    // Delay to ensure elements are rendered
    const timeout = setTimeout(() => {
      startTour(page);
      markTourSeen(page);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isReady, page, startTour, hasSeenTour, markTourSeen, delay]);
}
