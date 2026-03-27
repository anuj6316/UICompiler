# Environment Configuration Guide

To maintain a secure and consistent environment across the entire codebase, we use a centralized configuration pattern.

## The `src/config/env.ts` File
Instead of calling `import.meta.env` or `process.env` randomly throughout the application, all environment variables **must** be declared and exported from `src/config/env.ts`.

### Why?
1. **Type Safety:** It provides autocomplete and type checking for all environment variables.
2. **Fallbacks:** It allows us to set default fallback values (e.g., `import.meta.env.VITE_APP_NAME || 'UICompiler'`).
3. **Security:** It explicitly separates frontend variables (accessible in the browser) from backend variables (only accessible in Node.js), preventing accidental secret leaks.

## Adding a New Environment Variable

### 1. Frontend Variables (Browser Accessible)
If you need a variable to be accessible in React components:
1. Add it to `.env.example` with the `VITE_` prefix:
   ```env
   VITE_API_URL="https://api.example.com"
   ```
2. Add it to `src/config/env.ts`:
   ```typescript
   export const env = {
     // ...
     apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
   }
   ```

### 2. Backend Variables (Server Only)
If you need a variable for backend logic (e.g., an API secret key):
1. Add it to `.env.example` **without** the `VITE_` prefix:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   ```
2. Add it to `src/config/env.ts` wrapped in a `typeof process !== 'undefined'` check to prevent browser crashes:
   ```typescript
   export const env = {
     // ...
     stripeSecret: typeof process !== 'undefined' ? process.env.STRIPE_SECRET_KEY : undefined,
   }
   ```

## Usage in Components
Import the `env` object from the config file:

```tsx
import { env } from '@/config/env';

export function MyComponent() {
  return <h1>Welcome to {env.appName}</h1>;
}
```
