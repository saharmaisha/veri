'use client';

import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export type TourPage =
  | 'boards'
  | 'boardDetail'
  | 'pinDetail'
  | 'results'
  | 'saved'
  | 'settings';

interface TourState {
  boards: boolean;
  boardDetail: boolean;
  pinDetail: boolean;
  results: boolean;
  saved: boolean;
  settings: boolean;
}

interface TourContextValue {
  startTour: (page: TourPage) => void;
  hasSeenTour: (page: TourPage) => boolean;
  markTourSeen: (page: TourPage) => void;
  resetTours: () => void;
  isReady: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

const STORAGE_KEY = 'swipe_tour_state';

const defaultState: TourState = {
  boards: false,
  boardDetail: false,
  pinDetail: false,
  results: false,
  saved: false,
  settings: false,
};

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [tourState, setTourState] = useState<TourState>(defaultState);
  const [driverInstance, setDriverInstance] = useState<Driver | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTourState(JSON.parse(stored));
      } catch {
        // Invalid stored state, use default
      }
    }
    setIsReady(true);
  }, []);

  // Initialize driver.js
  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: 'swipe-tour-popover',
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Done',
    });
    setDriverInstance(driverObj);

    return () => {
      driverObj.destroy();
    };
  }, []);

  const saveTourState = useCallback((newState: TourState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setTourState(newState);
  }, []);

  const hasSeenTour = useCallback(
    (page: TourPage) => {
      return tourState[page];
    },
    [tourState]
  );

  const markTourSeen = useCallback(
    (page: TourPage) => {
      const newState = { ...tourState, [page]: true };
      saveTourState(newState);
    },
    [tourState, saveTourState]
  );

  const resetTours = useCallback(() => {
    saveTourState(defaultState);
  }, [saveTourState]);

  const startTour = useCallback(
    (page: TourPage) => {
      if (!driverInstance) return;

      // Import tour steps dynamically based on page
      import(`./tours/${page}`).then((module) => {
        const steps = module.default || module.steps;
        if (steps && steps.length > 0) {
          driverInstance.setSteps(steps);
          driverInstance.drive();
        }
      }).catch(() => {
        console.warn(`No tour found for page: ${page}`);
      });
    },
    [driverInstance]
  );

  return (
    <TourContext.Provider
      value={{
        startTour,
        hasSeenTour,
        markTourSeen,
        resetTours,
        isReady,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
