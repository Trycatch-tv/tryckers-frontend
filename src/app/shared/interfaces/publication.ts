import { User } from '../../auth/interfaces/user';

export interface Publication {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  type: PublicationType;
  tags: string[];
  coverImage?: string;
  status: PublicationStatus;
  viewCount: number;
  voteCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePublicationRequest {
  title: string;
  content: string;
  type: PublicationType;
  tags: string[];
  coverImage?: string;
  status: PublicationStatus;
}

export interface UpdatePublicationRequest {
  title?: string;
  content?: string;
  type?: PublicationType;
  tags?: string[];
  coverImage?: string;
  status?: PublicationStatus;
}

export interface PublicationFilters {
  type?: PublicationType;
  tags?: string[];
  authorId?: string;
  status?: PublicationStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'viewCount' | 'voteCount';
  sortOrder?: 'asc' | 'desc';
}

export enum PublicationType {
  PROJECT = 'project',
  TUTORIAL = 'tutorial',
  ANNOUNCEMENT = 'announcement',
}

export enum PublicationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
