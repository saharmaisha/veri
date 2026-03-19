import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="pins-grid"]',
    popover: {
      title: 'Your pins',
      description: 'These are all the pins from this board. Browse through them to find outfit inspiration.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="pin-card"]',
    popover: {
      title: 'Select pins',
      description: 'Tap or click pins to select which ones you want to search for. Selected pins get a purple ring.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="budget-input"]',
    popover: {
      title: 'Set your budget',
      description: 'Enter your maximum price per item. We\'ll prioritize products within your range.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="search-button"]',
    popover: {
      title: 'Find similar products',
      description: 'Once you\'ve selected pins and set your budget, click here to find shoppable matches!',
      side: 'bottom',
      align: 'end',
    },
  },
];

export default steps;
