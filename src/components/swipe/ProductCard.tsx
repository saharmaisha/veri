'use client';

import { ExternalLink, Store } from 'lucide-react';
import type { ProductResult } from '@/lib/types/database';
import { getRetailerUrl } from '@/lib/utils/retailer-url';

interface ProductCardProps {
  product: ProductResult;
}

export function ProductCard({ product }: ProductCardProps) {
  const brandUrl = getRetailerUrl(product.retailer, product.retailer_url);

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden border w-full max-w-sm mx-auto">
      <div className="bg-muted flex items-center justify-center">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full max-h-[40dvh] object-contain select-none pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
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

        <div className="flex items-center gap-3">
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
          {brandUrl && (
            <>
              <span className="text-muted-foreground/40">|</span>
              <a
                href={brandUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Store className="h-3 w-3" />
                Visit {product.retailer}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
