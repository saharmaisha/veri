import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="swipe-deck"]',
    popover: {
      title: 'Your matches',
      description: 'Here are products similar to your inspiration pins. Swipe through to build your collection!',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="swipe-gesture-demo"]',
    popover: {
      title: 'Swipe to decide',
      description: 'Drag RIGHT to SAVE items you love. Drag LEFT to SKIP. You can also use arrow keys!',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="undo-button"]',
    popover: {
      title: 'Changed your mind?',
      description: 'Tap undo to go back to the last product if you made a mistake.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="external-link"]',
    popover: {
      title: 'View on retailer',
      description: 'Tap here to open the product page on the retailer\'s website.',
      side: 'top',
      align: 'center',
    },
  },
];

export default steps;
