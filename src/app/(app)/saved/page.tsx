'use client';

import { useState } from 'react';
import { SavedItemCard } from '@/components/saved/SavedItemCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Scale, X } from 'lucide-react';
import { useSwipeStore } from '@/store/swipe-store';
import type { ProductResult } from '@/lib/types/database';

export default function SavedPage() {
  const { products, savedIds } = useSwipeStore();
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const savedProducts = products.filter((p) => savedIds.has(p.id));

  const toggleCompare = (productId: string, selected: boolean) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  const compareProducts = savedProducts.filter((p) => compareIds.has(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <EmptyState
          icon={Heart}
          title="No saved items yet"
          description="Swipe right on products you like to save them here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Items</h1>
          <p className="text-muted-foreground">{savedProducts.length} items saved</p>
        </div>
        <Button
          variant={showCompare ? 'default' : 'outline'}
          onClick={() => {
            setShowCompare(!showCompare);
            if (showCompare) setCompareIds(new Set());
          }}
          className="gap-2"
        >
          <Scale className="h-4 w-4" />
          {showCompare ? 'Done comparing' : 'Compare'}
        </Button>
      </div>

      {showCompare && compareProducts.length >= 2 && (
        <ComparePanel products={compareProducts} onClose={() => {
          setShowCompare(false);
          setCompareIds(new Set());
        }} />
      )}

      {showCompare && compareProducts.length < 2 && (
        <p className="text-sm text-muted-foreground">Select at least 2 items to compare.</p>
      )}

      <div className="grid gap-3">
        {savedProducts.map((product) => (
          <SavedItemCard
            key={product.id}
            product={product}
            savedAt={new Date().toISOString()}
            syncStatus="not_configured"
            selected={showCompare ? compareIds.has(product.id) : undefined}
            onSelect={showCompare ? (sel) => toggleCompare(product.id, sel as boolean) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function ComparePanel({ products, onClose }: { products: ProductResult[]; onClose: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Compare ({products.length} items)</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">Item</th>
                <th className="text-left py-2 pr-4 font-medium">Retailer</th>
                <th className="text-right py-2 pr-4 font-medium">Price</th>
                <th className="text-right py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 max-w-[200px] truncate">{p.title}</td>
                  <td className="py-2 pr-4">{p.retailer}</td>
                  <td className="py-2 pr-4 text-right font-semibold">{p.price_text}</td>
                  <td className="py-2 text-right">
                    {p.match_score ? `${Math.round(p.match_score * 100)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
