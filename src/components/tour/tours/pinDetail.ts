import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="pin-image"]',
    popover: {
      title: 'Full pin view',
      description: 'View the complete pin image here. Perfect for studying the details of an outfit.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="crop-button"]',
    popover: {
      title: 'Crop for focus',
      description: 'Use crop to select just one item in the image. This helps find more accurate matches for specific pieces.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="pin-search-button"]',
    popover: {
      title: 'Search from this pin',
      description: 'Find similar products based on this single pin.',
      side: 'bottom',
      align: 'end',
    },
  },
];

export default steps;
