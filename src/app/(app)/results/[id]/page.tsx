'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductSwipeDeck } from '@/components/swipe/ProductSwipeDeck';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSwipeStore } from '@/store/swipe-store';
import type { ProductResult } from '@/lib/types/database';

export default function ResultsPage() {
  const router = useRouter();

  const {
    products,
    currentIndex,
    searchRun,
    analysis,
    analyses,
    selectedPins,
    board,
    skipProduct,
    saveProduct,
    nextCard,
  } = useSwipeStore();

  useEffect(() => {
    if (products.length === 0) {
      router.replace('/boards');
    }
  }, [products.length, router]);

  const handleSave = useCallback(
    async (product: ProductResult) => {
      saveProduct(product.id);
      nextCard();

      try {
        const response = await fetch('/api/sheets/append', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product,
            search_run_id: searchRun?.id,
            pin_id: product.source_pin_id || analysis?.pin_id,
            pin_title: product.source_pin_title || null,
            inspiration_image_url: product.source_pin_image_url || null,
            board_name: product.board_name || board?.name || null,
            balanced_query: product.balanced_query || analyses[0]?.balanced_query || null,
            mode: searchRun?.search_scope || searchRun?.mode,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to append row');
        }

        toast.success('Saved to Google Sheets', {
          description: product.title,
        });
      } catch {
        toast.error('Could not save to Google Sheets', {
          description: 'Make sure Google Sheets is connected in Settings.',
        });
      }
    },
    [saveProduct, nextCard, searchRun, analysis, board, analyses]
  );

  const handleSkip = useCallback(
    (product: ProductResult) => {
      skipProduct(product.id);
      nextCard();
    },
    [skipProduct, nextCard]
  );

  if (products.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href={board?.id ? `/boards/${board.id}` : '/boards'}>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">
            {board?.name || 'Results'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {searchRun?.search_scope === 'all_board'
              ? `Based on ${selectedPins.length} pin${selectedPins.length === 1 ? '' : 's'}`
              : `Based on ${selectedPins.length} selected pin${selectedPins.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {/* Inspiration strip */}
      {selectedPins.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 px-1 -mx-1">
          {selectedPins.slice(0, 6).map((pin) => (
            <div
              key={pin.id}
              className="h-16 w-12 shrink-0 rounded-md bg-muted bg-cover bg-center"
              style={{ backgroundImage: `url(${pin.image_url})` }}
            />
          ))}
          {selectedPins.length > 6 && (
            <div className="h-16 w-12 shrink-0 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
              +{selectedPins.length - 6}
            </div>
          )}
        </div>
      )}

      <ProductSwipeDeck
        products={products}
        currentIndex={currentIndex}
        onSave={handleSave}
        onSkip={handleSkip}
      />
    </div>
  );
}
