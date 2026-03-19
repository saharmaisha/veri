import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="budget-settings"]',
    popover: {
      title: 'Default budget',
      description: 'Set your default max price for searches. You can always override this per search.',
      side: 'top',
      align: 'center',
    },
  },
];

export default steps;
