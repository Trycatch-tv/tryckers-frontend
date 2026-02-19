import { User } from '@auth/interfaces';

export type PostType = 'regular' | 'story' | 'video';
export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  type: PostType;
  tags: string | string[];
  status: PostStatus;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  user?: User;
  author?: { id: string; username: string };
  votes_count?: number;
  comments_count?: number;
  user_vote?: 0 | 1 | null;
  is_edited?: boolean;
}

export interface CreatePostDto {
  title: string;
  content: string;
  type: PostType;
  image: string;
  tags: string[];
  status: PostStatus;
  user_id: string;
}

export interface UpdatePostDto {
  id: string;
  title?: string;
  content?: string;
  type?: PostType;
  image?: string;
  tags?: string[];
  status?: PostStatus;
  user_id?: string;
}

export interface VotePostResponse {
  user_vote?: 0 | 1;
  votes_count?: number;
}
