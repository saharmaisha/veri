import type { NormalizedProduct } from '@/lib/types/products';

const RETAILERS = ['ASOS', 'Zara', 'H&M', 'Nordstrom', 'Target', 'Mango', 'Uniqlo', 'Gap', 'Banana Republic', 'Express'];

const MOCK_PRODUCTS_BY_QUERY: Record<string, NormalizedProduct[]> = {
  default: [
    {
      provider_product_id: 'mp-001',
      source_provider: 'mock',
      title: 'Puff Sleeve White Midi Dress',
      retailer: 'ASOS',
      price_text: '$68.00',
      numeric_price: 68,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop',
      product_url: 'https://asos.com/example/white-midi-dress',
      match_reason: 'Strong match: white midi dress with puff sleeves, A-line silhouette',
      match_score: 0.92,
    },
    {
      provider_product_id: 'mp-002',
      source_provider: 'mock',
      title: 'Cotton Tiered Midi Dress - White',
      retailer: 'H&M',
      price_text: '$44.99',
      numeric_price: 44.99,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop',
      product_url: 'https://hm.com/example/tiered-midi',
      match_reason: 'Good match: tiered midi dress in white, affordable option',
      match_score: 0.87,
    },
    {
      provider_product_id: 'mp-003',
      source_provider: 'mock',
      title: 'Smocked Bodice Midi Dress',
      retailer: 'Target',
      price_text: '$35.00',
      numeric_price: 35,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      product_url: 'https://target.com/example/smocked-dress',
      match_reason: 'Budget-friendly: smocked bodice detail matches inspiration',
      match_score: 0.82,
    },
    {
      provider_product_id: 'mp-004',
      source_provider: 'mock',
      title: 'Elegant A-Line Midi Dress',
      retailer: 'Zara',
      price_text: '$79.90',
      numeric_price: 79.9,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop',
      product_url: 'https://zara.com/example/a-line-midi',
      match_reason: 'A-line silhouette match, elegant styling',
      match_score: 0.79,
    },
    {
      provider_product_id: 'mp-005',
      source_provider: 'mock',
      title: 'Square Neck Puff Sleeve Dress',
      retailer: 'Mango',
      price_text: '$59.99',
      numeric_price: 59.99,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
      product_url: 'https://mango.com/example/square-neck',
      match_reason: 'Square neckline and puff sleeve match',
      match_score: 0.85,
    },
    {
      provider_product_id: 'mp-006',
      source_provider: 'mock',
      title: 'White Eyelet Midi Dress',
      retailer: 'Nordstrom',
      price_text: '$98.00',
      numeric_price: 98,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop',
      product_url: 'https://nordstrom.com/example/eyelet-midi',
      match_reason: 'Premium option: eyelet detail adds texture, white midi silhouette',
      match_score: 0.76,
    },
    {
      provider_product_id: 'mp-007',
      source_provider: 'mock',
      title: 'Ruffle Hem White Dress',
      retailer: 'Express',
      price_text: '$52.00',
      numeric_price: 52,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&h=600&fit=crop',
      product_url: 'https://express.com/example/ruffle-hem',
      match_reason: 'Similar feminine style with ruffle details',
      match_score: 0.74,
    },
    {
      provider_product_id: 'mp-008',
      source_provider: 'mock',
      title: 'Poplin Midi Dress with Belt',
      retailer: 'Gap',
      price_text: '$42.00',
      numeric_price: 42,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop',
      product_url: 'https://gap.com/example/poplin-midi',
      match_reason: 'Budget-friendly midi dress with defined waist',
      match_score: 0.71,
    },
    {
      provider_product_id: 'mp-009',
      source_provider: 'mock',
      title: 'Linen Blend Midi Dress',
      retailer: 'Uniqlo',
      price_text: '$39.90',
      numeric_price: 39.9,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=600&fit=crop',
      product_url: 'https://uniqlo.com/example/linen-midi',
      match_reason: 'Affordable linen option, similar length and shape',
      match_score: 0.68,
    },
    {
      provider_product_id: 'mp-010',
      source_provider: 'mock',
      title: 'Satin Finish Midi Dress',
      retailer: 'Banana Republic',
      price_text: '$89.00',
      numeric_price: 89,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=600&fit=crop',
      product_url: 'https://bananarepublic.com/example/satin-midi',
      match_reason: 'Elevated option: satin finish adds sophistication',
      match_score: 0.73,
    },
    {
      provider_product_id: 'mp-011',
      source_provider: 'mock',
      title: 'Flowy White Maxi Dress',
      retailer: 'ASOS',
      price_text: '$55.00',
      numeric_price: 55,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=600&fit=crop',
      product_url: 'https://asos.com/example/white-maxi',
      match_reason: 'Longer length variation, similar white aesthetic',
      match_score: 0.65,
    },
    {
      provider_product_id: 'mp-012',
      source_provider: 'mock',
      title: 'Broderie Anglaise Mini Dress',
      retailer: 'Zara',
      price_text: '$49.90',
      numeric_price: 49.9,
      currency: 'USD',
      image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop',
      product_url: 'https://zara.com/example/broderie-mini',
      match_reason: 'Vibe match: similar romantic white aesthetic, shorter length',
      match_score: 0.62,
    },
  ],
};

export function getMockProducts(query?: string): NormalizedProduct[] {
  if (query && MOCK_PRODUCTS_BY_QUERY[query]) {
    return MOCK_PRODUCTS_BY_QUERY[query];
  }
  return MOCK_PRODUCTS_BY_QUERY.default;
}

export function getMockProductById(productId: string): NormalizedProduct | null {
  for (const products of Object.values(MOCK_PRODUCTS_BY_QUERY)) {
    const product = products.find((p) => p.provider_product_id === productId);
    if (product) return product;
  }
  return null;
}

export { RETAILERS };
