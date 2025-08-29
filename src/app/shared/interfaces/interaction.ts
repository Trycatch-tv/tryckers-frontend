import { User } from '../../auth/interfaces/user';

export interface Vote {
  id: string;
  userId: string;
  publicationId: string;
  type: VoteType;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  publicationId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteResponse {
  vote: Vote;
  totalVotes: number;
  userVote?: VoteType;
}

export interface CreateCommentRequest {
  publicationId: string;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export enum VoteType {
  UP = 'up',
  DOWN = 'down',
}
