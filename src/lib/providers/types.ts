import type { RawProduct, NormalizedProduct, TextSearchInput, ImageSearchInput, RankingContext } from '@/lib/types/products';

export interface ShoppingProvider {
  name: string;
  searchByTextQueries(input: TextSearchInput): Promise<RawProduct[]>;
  searchByImage(input: ImageSearchInput): Promise<RawProduct[]>;
  normalizeProducts(raw: RawProduct[]): NormalizedProduct[];
  rankProducts(products: NormalizedProduct[], ctx: RankingContext): NormalizedProduct[];
  dedupeProducts(products: NormalizedProduct[]): NormalizedProduct[];
}
