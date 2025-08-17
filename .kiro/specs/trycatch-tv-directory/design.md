# Design Document

## Overview

TryCatch.tv Directory is a community-driven platform built with Angular 20, leveraging PrimeNG for UI components and Tailwind CSS for styling. The platform follows a modular architecture with feature-based modules, reactive programming patterns using RxJS, and a responsive design approach to serve the LATAM tech community effectively.

The application will be structured as a Single Page Application (SPA) with lazy-loaded feature modules, ensuring optimal performance and scalability. The design emphasizes user experience, community engagement, and professional networking capabilities.

## Architecture

### Frontend Architecture
- **Framework**: Angular 20 with standalone components
- **UI Library**: PrimeNG for consistent, accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: Angular services with RxJS for reactive state management
- **Routing**: Angular Router with lazy loading and guards
- **Forms**: Angular Reactive Forms with validation
- **HTTP**: Angular HttpClient with interceptors for API communication

### Module Structure
```
src/app/
├── core/                    # Core functionality (singleton services)
│   ├── services/           # Authentication, API, storage services
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── models/             # Core data models
├── shared/                 # Shared components and utilities
│   ├── components/         # Reusable UI components
│   ├── pipes/              # Custom pipes
│   ├── directives/         # Custom directives
│   └── utils/              # Utility functions
├── features/               # Feature modules
│   ├── auth/               # Authentication module
│   ├── profile/            # User profile management
│   ├── publications/       # Content creation and management
│   ├── community/          # Social interactions
│   ├── opportunities/      # Job/collaboration opportunities
│   └── dashboard/          # User dashboard
└── layout/                 # Application layout components
```

### Backend Integration
- **API Communication**: RESTful API with JSON responses
- **Authentication**: JWT-based authentication with refresh tokens
- **File Upload**: Multipart form data for images and documents
- **Real-time Updates**: WebSocket integration for live notifications (future enhancement)

## Components and Interfaces

### Core Services

#### AuthService
```typescript
interface AuthService {
  login(credentials: LoginCredentials): Observable<AuthResponse>
  loginWithGoogle(): Observable<AuthResponse>
  register(userData: RegisterData): Observable<AuthResponse>
  logout(): void
  refreshToken(): Observable<AuthResponse>
  getCurrentUser(): Observable<User | null>
  isAuthenticated(): boolean
}
```

#### UserService
```typescript
interface UserService {
  getProfile(userId: string): Observable<UserProfile>
  updateProfile(profile: UserProfile): Observable<UserProfile>
  uploadProfileImage(file: File): Observable<string>
  getUserStats(userId: string): Observable<UserStats>
}
```

#### PublicationService
```typescript
interface PublicationService {
  getPublications(filters: PublicationFilters): Observable<Publication[]>
  getPublication(id: string): Observable<Publication>
  createPublication(publication: CreatePublicationRequest): Observable<Publication>
  updatePublication(id: string, publication: UpdatePublicationRequest): Observable<Publication>
  deletePublication(id: string): Observable<void>
  votePublication(id: string, vote: VoteType): Observable<VoteResponse>
  getComments(publicationId: string): Observable<Comment[]>
  addComment(publicationId: string, comment: string): Observable<Comment>
}
```

### Key Components

#### Navigation Component
- Responsive navigation bar with user menu
- Search functionality
- Notification indicators
- Mobile-friendly hamburger menu

#### Profile Components
- **ProfileView**: Display user profile information
- **ProfileEdit**: Form for editing profile details
- **ProfileCard**: Compact profile display for listings

#### Publication Components
- **PublicationList**: Grid/list view of publications with filtering
- **PublicationCard**: Individual publication preview
- **PublicationDetail**: Full publication view with interactions
- **PublicationForm**: Create/edit publication form
- **PublicationFilters**: Advanced filtering sidebar

#### Community Components
- **BulletinBoard**: Weekly popular content display
- **VotingComponent**: Voting interface for publications
- **CommentSection**: Comments display and creation
- **UserInteractions**: Like, share, and engagement tracking

#### Opportunity Components
- **OpportunityList**: Job/collaboration listings
- **OpportunityCard**: Individual opportunity preview
- **OpportunityDetail**: Full opportunity description
- **OpportunityForm**: Create/edit opportunity form
- **ApplicationModal**: Quick application interface

## Data Models

### User Model
```typescript
interface User {
  id: string
  email: string
  name: string
  headline?: string
  biography?: string
  profileImage?: string
  linkedinUrl?: string
  githubUrl?: string
  videoPitchUrl?: string
  englishLevel: EnglishLevel
  seniority: SeniorityLevel
  country: string
  availability: AvailabilityStatus
  interests: string[]
  points: number
  createdAt: Date
  updatedAt: Date
}

enum EnglishLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  NATIVE = 'native'
}

enum SeniorityLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead'
}

enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  NOT_AVAILABLE = 'not_available'
}
```

### Publication Model
```typescript
interface Publication {
  id: string
  authorId: string
  author: User
  title: string
  content: string
  type: PublicationType
  tags: string[]
  coverImage?: string
  status: PublicationStatus
  viewCount: number
  voteCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}

enum PublicationType {
  PROJECT = 'project',
  TUTORIAL = 'tutorial',
  ANNOUNCEMENT = 'announcement'
}

enum PublicationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}
```

### Opportunity Model
```typescript
interface Opportunity {
  id: string
  recruiterId: string
  recruiter: User
  title: string
  description: string
  type: OpportunityType
  requirements: string[]
  technologies: string[]
  location: string
  remote: boolean
  salaryRange?: SalaryRange
  applicationDeadline?: Date
  status: OpportunityStatus
  applicantCount: number
  createdAt: Date
  updatedAt: Date
}

enum OpportunityType {
  EMPLOYMENT = 'employment',
  PROJECT = 'project',
  CO_FOUNDER = 'co_founder'
}
```

### Interaction Models
```typescript
interface Vote {
  id: string
  userId: string
  publicationId: string
  type: VoteType
  createdAt: Date
}

interface Comment {
  id: string
  userId: string
  user: User
  publicationId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

enum VoteType {
  UP = 'up',
  DOWN = 'down'
}
```

## Error Handling

### Error Types
- **ValidationError**: Form validation and input errors
- **AuthenticationError**: Login and authorization failures
- **NetworkError**: API communication issues
- **NotFoundError**: Resource not found errors
- **ServerError**: Backend server errors

### Error Handling Strategy
- Global error interceptor for HTTP errors
- User-friendly error messages with PrimeNG Toast notifications
- Fallback UI states for failed data loading
- Retry mechanisms for transient network errors
- Offline detection and graceful degradation

### Error Components
- **ErrorBoundary**: Global error boundary component
- **NotFound**: 404 error page
- **ServerError**: 500 error page
- **NetworkError**: Network connectivity issues page

## Testing Strategy

### Unit Testing
- **Components**: Test component logic, inputs, outputs, and user interactions
- **Services**: Test business logic, API calls, and data transformations
- **Pipes**: Test data transformation logic
- **Guards**: Test route protection logic
- **Interceptors**: Test HTTP request/response handling

### Integration Testing
- **Feature Modules**: Test complete user workflows
- **API Integration**: Test service-to-API communication
- **Form Validation**: Test complex form interactions
- **Navigation**: Test routing and navigation flows

### E2E Testing
- **User Journeys**: Test complete user scenarios from registration to publication
- **Cross-browser**: Ensure compatibility across major browsers
- **Mobile Responsiveness**: Test mobile user experience
- **Performance**: Test loading times and responsiveness

### Testing Tools
- **Unit/Integration**: Jasmine and Karma (Angular defaults)
- **E2E**: Cypress or Playwright for end-to-end testing
- **Mocking**: Angular testing utilities and custom mocks
- **Coverage**: Istanbul for code coverage reporting

## UI/UX Design Considerations

### Design System
- **Color Palette**: Professional blues and grays with accent colors for CTAs
- **Typography**: Clean, readable fonts optimized for technical content
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: PrimeNG components customized with Tailwind utilities

### Responsive Design
- **Mobile-first**: Design for mobile devices first, then scale up
- **Breakpoints**: Tailwind's default breakpoints (sm, md, lg, xl, 2xl)
- **Navigation**: Collapsible navigation for mobile devices
- **Content**: Adaptive layouts for different screen sizes

### Accessibility
- **WCAG 2.1**: Comply with AA level accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Ensure sufficient contrast ratios
- **Focus Management**: Clear focus indicators and logical tab order

### Performance Optimization
- **Lazy Loading**: Feature modules and images loaded on demand
- **OnPush Strategy**: Change detection optimization for components
- **Virtual Scrolling**: For large lists of publications/opportunities
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Splitting**: Code splitting for optimal loading