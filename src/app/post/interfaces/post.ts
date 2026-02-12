import { User } from '@auth/interfaces';

export type PostType = 'article' | 'video' | 'project';
export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  type: PostType;
  tags: string;
  status: PostStatus;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  user?: User;
  votes_count?: number;
  user_vote?: 0 | 1 | null;
}

export interface CreatePostDto {
  title: string;
  content: string;
  type: PostType;
  image: string;
  tags: string;
  status: PostStatus;
  user_id: string | null;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  id: string;
}

export interface VotePostResponse {
  user_vote?: 0 | 1;
  votes_count?: number;
}
