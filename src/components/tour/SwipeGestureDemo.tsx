'use client';

import { Hand } from 'lucide-react';

export function SwipeGestureDemo() {
  return (
    <div
      data-tour="swipe-gesture-demo"
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-50"
    >
      <div className="relative">
        {/* Hand icon with animation */}
        <div className="animate-swipe-demo">
          <Hand className="h-16 w-16 text-white drop-shadow-lg transform -rotate-12" />
        </div>

        {/* Direction labels */}
        <div className="absolute -left-24 top-1/2 -translate-y-1/2 text-red-400 font-semibold text-sm opacity-80">
          SKIP
        </div>
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-green-400 font-semibold text-sm opacity-80">
          SAVE
        </div>
      </div>
    </div>
  );
}
