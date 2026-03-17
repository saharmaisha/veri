import type { PinterestPin } from '@/lib/types/database';

const MOCK_PINS_BY_BOARD: Record<string, Omit<PinterestPin, 'user_id' | 'section_key' | 'section_name'>[]> = {
  'mock-board-1': [
    {
      id: 'mock-pin-1',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-001',
      title: 'White Midi Dress with Puff Sleeves',
      description: 'Elegant white midi dress perfect for graduation ceremonies',
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      source_url: 'https://example.com/white-dress',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-2',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-002',
      title: 'Floral Wrap Dress',
      description: 'Beautiful floral wrap dress for spring graduation',
      image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
      source_url: 'https://example.com/floral-dress',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-3',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-003',
      title: 'Navy Blue A-Line Dress',
      description: 'Classic navy A-line dress with cap sleeves',
      image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-4',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-004',
      title: 'Pastel Pink Cocktail Dress',
      description: 'Soft pink cocktail dress with sweetheart neckline',
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
      source_url: 'https://example.com/pink-dress',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-5',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-005',
      title: 'Emerald Green Satin Dress',
      description: 'Stunning emerald green satin slip dress',
      image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-6',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-006',
      title: 'Lace Overlay Midi Dress',
      description: 'Romantic lace overlay dress in ivory',
      image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop',
      source_url: 'https://example.com/lace-dress',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-7',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-007',
      title: 'Red Off-Shoulder Dress',
      description: 'Bold red off-shoulder cocktail dress',
      image_url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-8',
      board_id: 'mock-board-1',
      pinterest_pin_id: 'pp-008',
      title: 'Black Fitted Jumpsuit',
      description: 'Sleek black jumpsuit as a dress alternative',
      image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
      source_url: 'https://example.com/jumpsuit',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'mock-board-2': [
    {
      id: 'mock-pin-9',
      board_id: 'mock-board-2',
      pinterest_pin_id: 'pp-009',
      title: 'Linen Beach Dress',
      description: 'Relaxed linen dress for beach days',
      image_url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600&h=800&fit=crop',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-10',
      board_id: 'mock-board-2',
      pinterest_pin_id: 'pp-010',
      title: 'Tropical Print Maxi Skirt',
      description: 'Flowing maxi skirt with tropical print',
      image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
      source_url: 'https://example.com/maxi-skirt',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-11',
      board_id: 'mock-board-2',
      pinterest_pin_id: 'pp-011',
      title: 'Crochet Cover-Up',
      description: 'Handmade-look crochet swim cover-up',
      image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'mock-board-3': [
    {
      id: 'mock-pin-12',
      board_id: 'mock-board-3',
      pinterest_pin_id: 'pp-012',
      title: 'Tailored Blazer and Trousers',
      description: 'Classic tailored blazer with matching trousers',
      image_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop',
      source_url: 'https://example.com/blazer-set',
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-pin-13',
      board_id: 'mock-board-3',
      pinterest_pin_id: 'pp-013',
      title: 'Silk Blouse',
      description: 'Elegant silk blouse in cream',
      image_url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      source_url: null,
      raw_payload: null,
      imported_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

export function getMockPins(userId: string, boardId: string): PinterestPin[] {
  const pins = MOCK_PINS_BY_BOARD[boardId] || [];
  return pins.map((p) => ({ ...p, user_id: userId, section_key: null, section_name: null }));
}

export function getMockPin(pinId: string): PinterestPin | null {
  for (const pins of Object.values(MOCK_PINS_BY_BOARD)) {
    const pin = pins.find((p) => p.id === pinId);
    if (pin) return { ...pin, user_id: 'mock-user', section_key: null, section_name: null };
  }
  return null;
}

export function getAllMockPins(): PinterestPin[] {
  const all: PinterestPin[] = [];
  for (const pins of Object.values(MOCK_PINS_BY_BOARD)) {
    all.push(
      ...pins.map((p) => ({ ...p, user_id: 'mock-user', section_key: null, section_name: null }))
    );
  }
  return all;
}
