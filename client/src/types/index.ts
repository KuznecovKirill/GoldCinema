// src/types/index.ts
// Добавил основные интерфейсы для работы
export interface User {
  id_user: number;
  username: string;
  role: string;
  id_role: number;
}

export interface Media {
  id_media: number;
  title: string;
  mediaType: string;
  year: string | null;
  running_time: number | null;
  rars: string | null;
  rating: number | null;
  descrition: string | null;
  cover: string;
  genres: string;
  countries?: string;
  score?: number; // для поиска
}

export interface Review {
  id_review: number;
  rating_user: number;
  comment_text: string;
  created_at: string;
  user: {
    id_user: number;
    username: string;
  };
}

export interface Favorite {
  id_favorite: number;
  id_user: number;
  id_media: number;
  media?: Media;
}

export interface AuthResponse {
  success: boolean;
  msg: string;
  authToken: string;
  user: User;
}