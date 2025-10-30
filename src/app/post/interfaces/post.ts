import { User } from '@auth/interfaces';

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  type: 'article' | 'video' | 'project';
  tags: string[];
  status: 'draft' | 'published';
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
