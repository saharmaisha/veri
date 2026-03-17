import type { ShoppingProvider } from './types';
import type {
  RawProduct,
  NormalizedProduct,
  TextSearchInput,
  ImageSearchInput,
  RankingContext,
} from '@/lib/types/products';
import { rankByHeuristics } from '@/lib/ranking/ranker';
import { dedupeByUrl } from '@/lib/ranking/deduper';

interface SerpApiShoppingResult {
  position: number;
  title: string;
  link?: string;
  source: string;
  price?: string;
  extracted_price?: number;
  currency?: string;
  thumbnail?: string;
  product_link?: string;
  product_id?: string;
}

interface SerpApiResponse {
  shopping_results?: SerpApiShoppingResult[];
  error?: string;
}

function parsePriceText(raw?: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

export class SerpApiTextShoppingProvider implements ShoppingProvider {
  name = 'serpapi-google-shopping';

  private apiKey: string;

  constructor() {
    this.apiKey = process.env.TEXT_SHOPPING_PROVIDER_KEY || '';
  }

  async searchByTextQueries(input: TextSearchInput): Promise<RawProduct[]> {
    if (!this.apiKey) {
      console.warn('[SerpAPI] No TEXT_SHOPPING_PROVIDER_KEY set');
      return [];
    }

    const allResults: RawProduct[] = [];

    // Run balanced query first, then optionally the others
    const queries = input.queries.slice(0, 3);

    for (const query of queries) {
      try {
        const url = new URL('https://serpapi.com/search');
        url.searchParams.set('engine', 'google_shopping');
        url.searchParams.set('q', query);
        url.searchParams.set('api_key', this.apiKey);
        url.searchParams.set('num', '20');

        const res = await fetch(url.toString());

        if (!res.ok) {
          console.error(`[SerpAPI] HTTP ${res.status} for query: ${query}`);
          continue;
        }

        const data: SerpApiResponse = await res.json();

        if (data.error) {
          console.error(`[SerpAPI] API error: ${data.error}`);
          continue;
        }

        const results = (data.shopping_results || []).map((r) => ({
          id: r.product_id || `serpapi-${r.position}-${query.slice(0, 10)}-${Date.now()}`,
          title: r.title,
          retailer: r.source,
          price: r.extracted_price ?? parsePriceText(r.price) ?? undefined,
          currency: r.currency || 'USD',
          price_text: r.price || '',
          image_url: r.thumbnail || '',
          product_url: r.product_link || r.link || '',
        }));

        allResults.push(...results);
      } catch (err) {
        console.error(`[SerpAPI] Fetch error for query "${query}":`, err);
      }
    }

    // Client-side budget filtering (more reliable than Google's tbs parameter)
    if (input.budget_max) {
      const max = input.budget_max;
      return allResults.filter((r) => {
        const price = typeof r.price === 'number' ? r.price : null;
        return price === null || price <= max;
      });
    }

    return allResults;
  }

  async searchByImage(_input: ImageSearchInput): Promise<RawProduct[]> {
    return [];
  }

  normalizeProducts(raw: RawProduct[]): NormalizedProduct[] {
    return raw
      .filter((r) => r.product_url && r.title)
      .map((r) => ({
        provider_product_id:
          (r.id as string) || `serpapi-${Math.random().toString(36).slice(2, 8)}`,
        source_provider: this.name,
        title: r.title,
        retailer: (r.retailer as string) || 'Unknown',
        price_text:
          (r.price_text as string) ||
          (typeof r.price === 'number' ? `$${(r.price as number).toFixed(2)}` : 'N/A'),
        numeric_price: typeof r.price === 'number' ? (r.price as number) : null,
        currency: (r.currency as string) || 'USD',
        image_url: (r.image_url as string) || '',
        product_url: (r.product_url as string) || '',
        match_reason: '',
        match_score: 0.65,
      }));
  }

  rankProducts(products: NormalizedProduct[], ctx: RankingContext): NormalizedProduct[] {
    return rankByHeuristics(products, ctx);
  }

  dedupeProducts(products: NormalizedProduct[]): NormalizedProduct[] {
    return dedupeByUrl(products);
  }
}
