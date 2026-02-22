export interface Platform {
  id: number;
  name: string;
  year: number;
  href?: string;
}

export const GENRES = [
  'Action',
  'Aventure',
  'RPG',
  'Simulation',
  'Stratégie',
  'Sport',
] as const;

export type Genre = (typeof GENRES)[number];

export const STATUSES = ['Not Started', 'Playing', 'Completed', 'Dropped'] as const;

export type Status = (typeof STATUSES)[number];

export interface Game {
  id: number;
  name: string;
  year: number;
  platform: Platform;
  genre: Genre;
  status: Status;
  rating: number | null;
  href?: string;
}

/** Raw DB row — platform is a foreign key ID, not expanded */
export interface GameRaw {
  id: number;
  name: string;
  year: number;
  platform: number;
  genre: Genre;
  status: Status;
  rating: number | null;
  href?: string;
}

// Request bodies
export interface CreateGameBody {
  name: string;
  year: number;
  platform: number;
  genre: Genre;
  status?: Status;
  rating?: number | null;
}

export interface UpdateGameBody {
  name: string;
  year: number;
  platform: number;
  genre: Genre;
  status?: Status;
  rating?: number | null;
}

export interface CreatePlatformBody {
  name: string;
  year: number;
}

export interface UpdatePlatformBody {
  name: string;
  year: number;
}

// Query params
export interface GamesListQuery {
  $expand?: string;
  $filter?: string;
  $search?: string;
}

// Response types
export interface GamesListResponse {
  games: Game[] | GameRaw[];
}

export interface GameResponse {
  game: Game;
}

export interface GameRawResponse {
  game: GameRaw;
}

export interface PlatformsListResponse {
  platforms: Platform[];
}

export interface PlatformResponse {
  platform: Platform;
}

export interface CreateResponse {
  message: string;
  id: number;
}

export interface DeleteResponse {
  message: string;
}

export interface UpdateResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}
