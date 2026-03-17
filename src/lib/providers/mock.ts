import type { ShoppingProvider } from './types';
import type { RawProduct, NormalizedProduct, TextSearchInput, ImageSearchInput, RankingContext } from '@/lib/types/products';
import { getMockProducts } from '@/lib/mock/products';
import { rankByHeuristics } from '@/lib/ranking/ranker';
import { dedupeByUrl } from '@/lib/ranking/deduper';

export class MockShoppingProvider implements ShoppingProvider {
  name = 'mock';

  async searchByTextQueries(input: TextSearchInput): Promise<RawProduct[]> {
    const query = input.queries[0] || '';
    const products = getMockProducts(query);
    return products.map((p) => ({
      id: p.provider_product_id,
      title: p.title,
      retailer: p.retailer,
      price: p.numeric_price ?? undefined,
      currency: p.currency,
      image_url: p.image_url,
      product_url: p.product_url,
    }));
  }

  async searchByImage(_input: ImageSearchInput): Promise<RawProduct[]> {
    const products = getMockProducts();
    return products.slice(0, 6).map((p) => ({
      id: p.provider_product_id,
      title: p.title,
      retailer: p.retailer,
      price: p.numeric_price ?? undefined,
      currency: p.currency,
      image_url: p.image_url,
      product_url: p.product_url,
    }));
  }

  normalizeProducts(raw: RawProduct[]): NormalizedProduct[] {
    return raw.map((r) => ({
      provider_product_id: (r.id as string) || `mock-${Math.random().toString(36).slice(2, 8)}`,
      source_provider: this.name,
      title: r.title,
      retailer: (r.retailer as string) || 'Unknown',
      price_text: typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : String(r.price || 'N/A'),
      numeric_price: typeof r.price === 'number' ? r.price : null,
      currency: (r.currency as string) || 'USD',
      image_url: (r.image_url as string) || '',
      product_url: (r.product_url as string) || '',
      match_reason: 'Mock result — replace with real provider for actual matches',
      match_score: 0.5 + Math.random() * 0.5,
    }));
  }

  rankProducts(products: NormalizedProduct[], ctx: RankingContext): NormalizedProduct[] {
    return rankByHeuristics(products, ctx);
  }

  dedupeProducts(products: NormalizedProduct[]): NormalizedProduct[] {
    return dedupeByUrl(products);
  }
}
