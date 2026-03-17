import type { NormalizedProduct } from '@/lib/types/products';

export function dedupeByUrl(products: NormalizedProduct[]): NormalizedProduct[] {
  const seen = new Set<string>();
  const deduped: NormalizedProduct[] = [];

  for (const product of products) {
    const urlKey = normalizeUrl(product.product_url);
    if (seen.has(urlKey)) continue;

    const titleKey = normalizeTitle(product.title);
    const imageKey = product.image_url;

    const isDupe = deduped.some((existing) => {
      if (normalizeUrl(existing.product_url) === urlKey) return true;
      if (normalizeTitle(existing.title) === titleKey && existing.retailer === product.retailer) return true;
      return false;
    });

    if (!isDupe) {
      seen.add(urlKey);
      deduped.push(product);
    }
  }

  return deduped;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Google Shopping redirect URLs encode the unique product in query params —
    // stripping them would collapse every product to "google.com/search".
    if (u.hostname.includes('google.com') && u.searchParams.has('prds')) {
      return url.toLowerCase().trim();
    }
    return `${u.hostname}${u.pathname}`.toLowerCase().replace(/\/+$/, '');
  } catch {
    return url.toLowerCase().trim();
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
