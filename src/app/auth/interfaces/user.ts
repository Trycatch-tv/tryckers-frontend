export interface User {
  id: string;
  email: string;
  name: string;
  headline?: string;
  biography?: string;
  profileImage?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  videoPitchUrl?: string;
  englishLevel: EnglishLevel;
  seniority: SeniorityLevel;
  country: string;
  availability: AvailabilityStatus;
  interests: string[];
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum EnglishLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  NATIVE = 'native',
}

export enum SeniorityLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  NOT_AVAILABLE = 'not_available',
}
