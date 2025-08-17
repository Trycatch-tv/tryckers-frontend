import { User } from '../../auth/interfaces/user';

export interface Opportunity {
  id: string;
  recruiterId: string;
  recruiter: User;
  title: string;
  description: string;
  type: OpportunityType;
  requirements: string[];
  technologies: string[];
  location: string;
  remote: boolean;
  salaryRange?: SalaryRange;
  applicationDeadline?: Date;
  status: OpportunityStatus;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOpportunityRequest {
  title: string;
  description: string;
  type: OpportunityType;
  requirements: string[];
  technologies: string[];
  location: string;
  remote: boolean;
  salaryRange?: SalaryRange;
  applicationDeadline?: Date;
}

export interface UpdateOpportunityRequest {
  title?: string;
  description?: string;
  type?: OpportunityType;
  requirements?: string[];
  technologies?: string[];
  location?: string;
  remote?: boolean;
  salaryRange?: SalaryRange;
  applicationDeadline?: Date;
  status?: OpportunityStatus;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export enum OpportunityType {
  EMPLOYMENT = 'employment',
  PROJECT = 'project',
  CO_FOUNDER = 'co_founder',
}

export enum OpportunityStatus {
  ACTIVE = 'active',
  FILLED = 'filled',
  EXPIRED = 'expired',
  PAUSED = 'paused',
}
