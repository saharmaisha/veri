import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="saved-grid"]',
    popover: {
      title: 'Your saved items',
      description: 'All the products you swiped right on appear here. Build your wishlist as you explore!',
      side: 'top',
      align: 'center',
    },
  },
];

export default steps;
