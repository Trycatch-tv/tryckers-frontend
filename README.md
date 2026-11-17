# TryckersFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Environment Configuration

Environment configuration is managed centrally:
- **Local Development:** Default configuration in `src/environments/environment.ts` points to `http://localhost:8080/api/v1`.
- **Production Build (AWS Amplify):** At build time, `scripts/generate-environment.mjs` reads `API_BASE_URL` provided by Amplify, validates HTTPS requirement, and creates `src/environments/environment.production.ts`. `angular.json` uses `fileReplacements` to substitute the configuration during `ng build --configuration production`.

To build locally for production:
```bash
export API_BASE_URL="https://api.tryckers.com/api/v1"
node scripts/generate-environment.mjs
npm run build
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
