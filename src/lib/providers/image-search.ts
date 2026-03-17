import type { ShoppingProvider } from './types';
import type { RawProduct, NormalizedProduct, TextSearchInput, ImageSearchInput, RankingContext } from '@/lib/types/products';
import { rankByHeuristics } from '@/lib/ranking/ranker';
import { dedupeByUrl } from '@/lib/ranking/deduper';

/**
 * Placeholder image-based shopping provider.
 * TODO: Replace with a real API integration (e.g., Google Lens API, Bing Visual Search).
 */
export class PlaceholderImageShoppingProvider implements ShoppingProvider {
  name = 'image-search-placeholder';

  async searchByTextQueries(_input: TextSearchInput): Promise<RawProduct[]> {
    // Image provider does not support text search
    return [];
  }

  async searchByImage(input: ImageSearchInput): Promise<RawProduct[]> {
    console.log(`[${this.name}] Image search URL:`, input.image_url);
    console.log(`[${this.name}] Budget: $${input.budget_min || 0} - $${input.budget_max || '∞'}`);
    // TODO: Implement real image-based shopping search
    return [];
  }

  normalizeProducts(raw: RawProduct[]): NormalizedProduct[] {
    return raw.map((r) => ({
      provider_product_id: (r.id as string) || `img-${Math.random().toString(36).slice(2, 8)}`,
      source_provider: this.name,
      title: r.title,
      retailer: (r.retailer as string) || 'Unknown',
      price_text: typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : String(r.price || 'N/A'),
      numeric_price: typeof r.price === 'number' ? r.price : null,
      currency: (r.currency as string) || 'USD',
      image_url: (r.image_url as string) || '',
      product_url: (r.product_url as string) || '',
      match_reason: '',
      match_score: 0.5,
    }));
  }

  rankProducts(products: NormalizedProduct[], ctx: RankingContext): NormalizedProduct[] {
    return rankByHeuristics(products, ctx);
  }

  dedupeProducts(products: NormalizedProduct[]): NormalizedProduct[] {
    return dedupeByUrl(products);
  }
}
