export interface UserProfile {
  id: string;
  email: string;
  name: string;
  headline?: string;
  biography?: string;
  profileImage?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  videoPitchUrl?: string;
  englishLevel: string;
  seniority: string;
  country: string;
  availability: string;
  interests: string[];
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  publicationsCount: number;
  totalViews: number;
  totalVotes: number;
  commentsCount: number;
  rank: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  country: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
