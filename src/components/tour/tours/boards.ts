import type { DriveStep } from 'driver.js';

export const steps: DriveStep[] = [
  {
    element: '[data-tour="board-url-input"]',
    popover: {
      title: 'Import a Pinterest board',
      description: 'Paste any public Pinterest board or section URL here to import it.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="board-import-button"]',
    popover: {
      title: 'Click Import',
      description: 'After pasting the URL, click Import to add the board to your collection.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="boards-grid"]',
    popover: {
      title: 'Your boards',
      description: 'Imported boards appear here. Click any board to view its pins and start searching.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="refresh-button"]',
    popover: {
      title: 'Keep boards fresh',
      description: 'Click Refresh to sync the latest pins from Pinterest.',
      side: 'bottom',
      align: 'end',
    },
  },
];

export default steps;
