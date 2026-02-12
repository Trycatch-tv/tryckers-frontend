export interface AuthResponse {
  user: User;
}

export interface User {
  UserData: UserData;
  Token: string;
}

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  birth_date: null;
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
