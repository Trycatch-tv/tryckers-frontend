# Tryckers Frontend Architecture Module

This folder describes the frontend architecture module for Tryckers Web App.

The backend repo remains the main SDD source of truth. Frontend architecture should reference backend contracts and document how Angular features consume them.

## Objective

Define the frontend architecture for Tryckers Web App, focused on maintainability, fast contributor onboarding, reusable UI, and clean separation between presentation, state, and API communication.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Framework | Angular 20 |
| Architecture | Standalone Components |
| Styling | Tailwind CSS |
| Global State | NgRx SignalStore |
| HTTP Client | Angular HttpClient |
| Forms | Reactive Forms |
| Routing | Angular Router |
| Build Tooling | Angular CLI |

## Architectural Style

The frontend follows a **Feature-Based Standalone Architecture**.

Each feature should group its own:

- `components/`
- `pages/`
- `services/`
- `stores/`
- `models/`
- `dtos/`

Recommended structure:

```text
src/
`-- app/
    |-- core/
    |   |-- api/
    |   |-- auth/
    |   |-- guards/
    |   |-- interceptors/
    |   `-- layout/
    |-- shared/
    |   |-- components/
    |   |-- directives/
    |   |-- pipes/
    |   `-- utils/
    |-- features/
    |   |-- auth/
    |   |-- users/
    |   |-- posts/
    |   |-- comments/
    |   `-- opportunities/
    |-- app.routes.ts
    `-- app.config.ts
```

## Responsibility Separation

Pages compose route-level screens, call stores, and handle high-level UI state.

Components provide reusable UI pieces through inputs and outputs. Components should not call APIs directly.

Services handle HTTP communication, external integrations, and API contract boundaries.

Stores manage global or feature-level state, loading/error states, service calls, and computed signal state.

Models and DTOs define frontend data contracts.

## State Management

Use NgRx SignalStore for global and feature state.

Recommended stores:

| Store | Responsibility |
| --- | --- |
| AuthStore | session, token, logged user |
| UserStore | profile, directory filters, member detail |
| PostStore | posts list, selected post, votes, comments |
| OpportunityStore | job posts and recruiter requests |

## API Communication

Services call the backend REST API under `/api/v1`.

```ts
@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);

  getPosts() {
    return this.http.get<Post[]>('/api/v1/posts');
  }
}
```

Stores can inject services and coordinate state updates.

## Styling Strategy

Use Tailwind CSS as the main styling system.

Guidelines:

- Prefer utility classes.
- Create reusable UI components for repeated patterns.
- Avoid large custom CSS files.
- Keep design tokens documented.

Suggested UI primitives:

- Button
- Input
- Card
- Badge
- Avatar
- Modal
- Tabs
- Dropdown
- EmptyState
- LoadingState

## Routing Strategy

Use lazy-loaded feature routes when possible:

```ts
export const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () =>
      import('./features/posts/posts.routes').then((m) => m.POSTS_ROUTES),
  },
];
```

## Authentication Strategy

Frontend should handle:

- Login/register forms.
- JWT storage.
- Auth state in AuthStore.
- HTTP interceptor for Authorization header.
- Route guards for private pages.

Recommended token strategy for MVP:

- Access token stored in memory or localStorage.

For production hardening, evaluate:

- HttpOnly cookies plus refresh token flow.

## Open Source Frontend Principles

The frontend should prioritize:

- Simple folder structure.
- Small components.
- Clear naming in English.
- Low setup friction.
- Easy first issues.
- Consistent UI patterns.

## Frontend MVP Scope

The frontend MVP should include:

- Landing or home page.
- User register/login.
- Public member directory.
- User profile page.
- Profile edit page.
- Post list.
- Post detail.
- Create post.
- Comments.
- Votes.
- Basic recruiter/opportunity section.

## Future Frontend Evolution

Potential future additions:

- Search and filters with URL query params.
- Profile SEO pages.
- Public talent cards.
- Recruiter dashboard.
- Analytics dashboard.
- Notifications.
- Real-time updates.
- Design system package.
- Internationalization.
