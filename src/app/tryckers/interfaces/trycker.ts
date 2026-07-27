import { UserData } from '@auth/interfaces/auth-response';

// Trycker es un alias de UserData para el contexto del módulo tryckers
export type Trycker = UserData;

export interface TryckersResponse {
  users: Trycker[];
}

export interface TryckerProfileResponse {
  user: Trycker;
}

export interface TryckerMediaResponse {
  user: Trycker;
}
