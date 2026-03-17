export interface PinterestOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface PinterestUser {
  username: string;
  account_type: string;
  profile_image: string;
  website_url: string;
}

export interface PinterestBoardResponse {
  id: string;
  name: string;
  description: string;
  owner: { username: string };
  privacy: string;
  media: { image_cover_url: string; pin_thumbnail_urls: string[] } | null;
  pin_count: number;
  created_at: string;
}

export interface PinterestPinResponse {
  id: string;
  title: string | null;
  description: string | null;
  link: string | null;
  media: {
    media_type: string;
    images: Record<string, { url: string; width: number; height: number }>;
  };
  board_id: string;
  created_at: string;
}

export interface PinterestPaginatedResponse<T> {
  items: T[];
  bookmark: string | null;
}
