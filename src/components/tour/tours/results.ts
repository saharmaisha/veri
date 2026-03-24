import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="action-buttons"]',
    popover: {
      title: 'Save or skip',
      description: 'Click ❤️ to SAVE or ✕ to SKIP. Use ← → arrow keys for quick navigation. Cmd/Ctrl+Z to undo.',
      side: 'bottom',
      align: 'center',
    },
  },
];

export default steps;
