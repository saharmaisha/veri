import Browserbase from '@browserbasehq/sdk';
import { chromium, type Browser, type Page } from 'playwright-core';
import { env, isBrowserbaseConfigured } from '@/lib/config';

interface ConnectBrowserOptions {
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
  timeoutSeconds?: number;
}

interface ConnectedBrowser {
  browser: Browser;
  page: Page;
}

export async function connectBrowser(
  options: ConnectBrowserOptions
): Promise<ConnectedBrowser> {
  if (isBrowserbaseConfigured()) {
    const bb = new Browserbase({ apiKey: env().BROWSERBASE_API_KEY });
    const session = await bb.sessions.create({
      timeout: options.timeoutSeconds ?? 300,
      browserSettings: {
        viewport: options.viewport,
      },
    });
    const browser = await chromium.connectOverCDP(session.connectUrl);
    const context = await browser.newContext({
      viewport: options.viewport,
      userAgent: options.userAgent,
    });
    const page = await context.newPage();

    return { browser, page };
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: options.viewport,
      userAgent: options.userAgent,
    });

    return { browser, page };
  } catch (error) {
    throw new Error(
      'Unable to launch a local Chromium browser. Set BROWSERBASE_API_KEY for hosted sessions or install Chromium locally with "npx playwright install chromium".',
      { cause: error }
    );
  }
}
