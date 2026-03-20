import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="swipe-deck"]',
    popover: {
      title: 'Swipe to decide',
      description: 'Drag RIGHT to SAVE items you love. Drag LEFT to SKIP. You can also use arrow keys, and Cmd/Ctrl+Z to undo.',
      side: 'bottom',
      align: 'center',
    },
  },
];

export default steps;
