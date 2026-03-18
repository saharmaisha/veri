'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { X, Heart, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { ProductResult } from '@/lib/types/database';

interface ProductSwipeDeckProps {
  products: ProductResult[];
  currentIndex: number;
  onSave: (product: ProductResult) => void;
  onSkip: (product: ProductResult) => void;
}

const SWIPE_THRESHOLD = 100;

export function ProductSwipeDeck({
  products,
  currentIndex,
  onSave,
  onSkip,
}: ProductSwipeDeckProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const currentProduct = products[currentIndex];
  const nextProduct = products[currentIndex + 1];
  const isFinished = currentIndex >= products.length;

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (!currentProduct) return;
      setExitDirection(direction);

      setTimeout(() => {
        if (direction === 'right') {
          onSave(currentProduct);
        } else {
          onSkip(currentProduct);
        }
        setExitDirection(null);
      }, 200);
    },
    [currentProduct, onSave, onSkip]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-medium">All caught up</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            You&apos;ve reviewed all {products.length} products. Head back to try another board.
          </p>
        </div>
        <Link href="/boards">
          <Button variant="outline" size="sm" className="mt-2">
            Back to boards
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-xs text-muted-foreground tabular-nums">
        {currentIndex + 1} / {products.length}
      </div>

      <div className="relative w-full max-w-sm h-[560px]">
        {nextProduct && (
          <div className="absolute inset-0 scale-[0.96] opacity-50 pointer-events-none">
            <ProductCard product={nextProduct} />
          </div>
        )}

        <AnimatePresence mode="wait" custom={exitDirection}>
          {currentProduct && !exitDirection && (
            <SwipeableCard
              key={currentProduct.id}
              product={currentProduct}
              onSwipe={handleSwipe}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={() => handleSwipe('left')}
          disabled={isFinished}
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </Button>

        {currentProduct && (
          <a
            href={currentProduct.product_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        )}

        <Button
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={() => handleSwipe('right')}
          disabled={isFinished}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Swipe or tap &mdash; right to save, left to skip
      </p>
    </div>
  );
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: (direction: 'left' | 'right' | null) => ({
    x: direction === 'left' ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

function SwipeableCard({
  product,
  onSwipe,
}: {
  product: ProductResult;
  onSwipe: (direction: 'left' | 'right') => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const leftIndicatorOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      style={{ x, rotate, opacity }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) {
          onSwipe('right');
        } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) {
          onSwipe('left');
        }
      }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="absolute top-6 left-4 z-10 bg-destructive text-white px-3 py-1.5 rounded-lg font-semibold text-sm -rotate-12"
        style={{ opacity: leftIndicatorOpacity }}
      >
        SKIP
      </motion.div>
      <motion.div
        className="absolute top-6 right-4 z-10 bg-foreground text-background px-3 py-1.5 rounded-lg font-semibold text-sm rotate-12"
        style={{ opacity: rightIndicatorOpacity }}
      >
        SAVE
      </motion.div>

      <ProductCard product={product} />
    </motion.div>
  );
}
