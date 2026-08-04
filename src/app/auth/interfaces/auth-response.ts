export interface AuthResponse {
  user: User;
}

export interface User {
  user_data: UserData;
  token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
}

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  birth_date?: string | null;
  avatar_url?: string;
  banner_url?: string;
  profile_picture: string;
  github_url: string;
  linkedin_url: string;
  pitch_video: string;
  headline: string;
  bio: string;
  seniority: string;
  english_level: string;
  efset_score: string;
  points: number;
  role: string;
  country: string;
  availability: string;
  interests: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
