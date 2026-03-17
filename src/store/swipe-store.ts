import { create } from 'zustand';
import type {
  ProductResult,
  SearchRun,
  PinAnalysis,
  PinterestPin,
  SearchBoardSummary,
} from '@/lib/types/database';
import type { SearchSessionData } from '@/lib/types/products';

interface SwipeState {
  searchRun: SearchRun | null;
  analysis: PinAnalysis | null;
  analyses: PinAnalysis[];
  selectedPins: PinterestPin[];
  board: SearchBoardSummary | null;
  products: ProductResult[];
  currentIndex: number;
  skippedIds: Set<string>;
  savedIds: Set<string>;

  setSearchData: (session: SearchSessionData) => void;
  skipProduct: (productId: string) => void;
  saveProduct: (productId: string) => void;
  nextCard: () => void;
  getCurrentProduct: () => ProductResult | null;
  getRemainingCount: () => number;
  reset: () => void;
}

export const useSwipeStore = create<SwipeState>((set, get) => ({
  searchRun: null,
  analysis: null,
  analyses: [],
  selectedPins: [],
  board: null,
  products: [],
  currentIndex: 0,
  skippedIds: new Set(),
  savedIds: new Set(),

  setSearchData: (session) =>
    set({
      searchRun: session.searchRun,
      products: session.products,
      analysis: session.analyses?.[0] || null,
      analyses: session.analyses || [],
      selectedPins: session.selectedPins || [],
      board: session.board || null,
      currentIndex: 0,
      skippedIds: new Set(),
      savedIds: new Set(),
    }),

  skipProduct: (productId) =>
    set((state) => {
      const newSkipped = new Set(state.skippedIds);
      newSkipped.add(productId);
      return { skippedIds: newSkipped };
    }),

  saveProduct: (productId) =>
    set((state) => {
      const newSaved = new Set(state.savedIds);
      newSaved.add(productId);
      return { savedIds: newSaved };
    }),

  nextCard: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.products.length),
    })),

  getCurrentProduct: () => {
    const { products, currentIndex } = get();
    return products[currentIndex] || null;
  },

  getRemainingCount: () => {
    const { products, currentIndex } = get();
    return Math.max(0, products.length - currentIndex);
  },

  reset: () =>
    set({
      searchRun: null,
      analysis: null,
      analyses: [],
      selectedPins: [],
      board: null,
      products: [],
      currentIndex: 0,
      skippedIds: new Set(),
      savedIds: new Set(),
    }),
}));
