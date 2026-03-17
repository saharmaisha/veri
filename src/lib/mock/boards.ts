import type { PinterestBoard } from '@/lib/types/database';

const MOCK_BOARDS: Omit<PinterestBoard, 'user_id'>[] = [
  {
    id: 'mock-board-1',
    pinterest_board_id: 'pb-001',
    name: 'Graduation Inspo',
    description: 'Outfit ideas for graduation day — dresses, heels, and accessories',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop',
    pin_count: 8,
    source_type: 'public_url',
    source_url: 'https://www.pinterest.com/mock/graduation-inspo/',
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-board-2',
    pinterest_board_id: 'pb-002',
    name: 'Summer Vacation Looks',
    description: 'Beach, resort, and travel outfit inspiration',
    image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop',
    pin_count: 6,
    source_type: 'public_url',
    source_url: 'https://www.pinterest.com/mock/summer-vacation-looks/',
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-board-3',
    pinterest_board_id: 'pb-003',
    name: 'Work Wardrobe',
    description: 'Professional and business casual outfit ideas',
    image_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=400&fit=crop',
    pin_count: 5,
    source_type: 'public_url',
    source_url: 'https://www.pinterest.com/mock/work-wardrobe/',
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getMockBoards(userId: string): PinterestBoard[] {
  return MOCK_BOARDS.map((b) => ({ ...b, user_id: userId }));
}

export function getMockBoard(boardId: string, userId: string = 'mock-user'): PinterestBoard | null {
  const board = MOCK_BOARDS.find((b) => b.id === boardId);
  return board ? { ...board, user_id: userId } : null;
}
