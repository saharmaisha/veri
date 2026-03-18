'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { ProductResult } from '@/lib/types/database';

interface ProductCardProps {
  product: ProductResult;
}

const WHITELISTED_PATTERNS = [
  'images.unsplash.com',
  'pinimg.com',
  'gstatic.com',
  'googleusercontent.com',
  'ggpht.com',
  'asos-media.com',
  'zara.com',
  'hm.com',
  'gap.com',
  'nordstrom.com',
  'target.com',
  'uniqlo.com',
  'mango.com',
];

function isWhitelisted(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return WHITELISTED_PATTERNS.some((pattern) => hostname.endsWith(pattern));
  } catch {
    return false;
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const useNextImage = !!product.image_url && isWhitelisted(product.image_url);

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden border w-full max-w-sm mx-auto">
      <div className="aspect-[3/4] relative bg-muted">
        {useNextImage ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover select-none pointer-events-none"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            draggable={false}
          />
        ) : product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            Image unavailable
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-medium text-base leading-tight line-clamp-2">{product.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{product.retailer}</span>
            <span className="text-lg font-semibold">{product.price_text}</span>
          </div>
        </div>

        {(product.source_pin_title || product.board_name) && (
          <p className="text-xs text-muted-foreground">
            Inspired by {product.source_pin_title || product.board_name}
          </p>
        )}

        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3" />
          View on {product.retailer || 'store'}
        </a>
      </div>
    </div>
  );
}
