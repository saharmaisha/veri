'use client';

import { X, Heart } from 'lucide-react';

export function SwipeGestureDemo() {
  return (
    <div
      data-tour="swipe-gesture-demo"
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-50"
    >
      <div className="flex items-center gap-12">
        {/* Skip button indicator */}
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <div className="h-14 w-14 rounded-full border-2 border-red-400 bg-red-400/20 flex items-center justify-center">
            <X className="h-7 w-7 text-red-400" />
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-white/20 text-white rounded border border-white/30">←</kbd>
            <span className="text-red-400 font-semibold text-sm">SKIP</span>
          </div>
        </div>

        {/* Save button indicator */}
        <div className="flex flex-col items-center gap-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="h-14 w-14 rounded-full border-2 border-green-400 bg-green-400/20 flex items-center justify-center">
            <Heart className="h-7 w-7 text-green-400" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-400 font-semibold text-sm">SAVE</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-white/20 text-white rounded border border-white/30">→</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
