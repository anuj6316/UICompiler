# Environment Configuration

## Overview

All environment variables are centralized in `frontend/src/config/env.ts`. Import `env` from there instead of accessing `import.meta.env` directly anywhere else in the codebase.

---

## Frontend Variables

Frontend variables **must** use the `VITE_` prefix to be exposed to the browser by Vite.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Base URL of the Django backend |
| `VITE_APP_NAME` | `UICompiler` | App display name used in the UI |
| `GEMINI_API_KEY` | — | Gemini API key (server-only; exposed via `vite.config.ts` `define`) |

### `frontend/src/config/env.ts`

```ts
export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'UICompiler',
  apiUrl:  (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, ''),

  isDev:  import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode:   import.meta.env.MODE,

  // Server-only — undefined in the browser
  geminiApiKey: typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined,
  appUrl:       typeof process !== 'undefined' ? process.env.APP_URL : undefined,
} as const;
```

### Usage in components

```tsx
import { env } from '@/config/env';

<span>{env.appName}</span>
<p>API: {env.apiUrl}</p>
```

---

## Local Development File

Create `frontend/.env.local` (not committed to git):

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=UICompiler
GEMINI_API_KEY=your_gemini_key_here
```

`.env.local` is already covered by `.gitignore` via the `.env` pattern.

---

## Django Backend Variables

The backend currently reads configuration directly from `core/settings.py`. For production, move sensitive values to environment variables using `os.environ.get()` or a package like `django-environ`.

Key settings to externalize for production:

| Setting | Description |
|---|---|
| `SECRET_KEY` | Django secret key — never commit to source control |
| `DEBUG` | Set to `False` in production |
| `ALLOWED_HOSTS` | Your production domain(s) |
| Database credentials | `NAME`, `USER`, `PASSWORD`, `HOST`, `PORT` |
| Email SMTP settings | `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, etc. |

Example production pattern:
```python
import os
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'fallback-dev-only')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
```

---

## ngrok Configuration

When using ngrok for local tunneling:

1. Add your ngrok URL to `ALLOWED_HOSTS` in `core/settings.py`:
   ```python
   ALLOWED_HOSTS = ['your-subdomain.ngrok-free.dev', 'localhost', '127.0.0.1']
   ```

2. Add your ngrok URL to `CORS_ALLOWED_ORIGINS`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-subdomain.ngrok-free.dev",
       # ...
   ]
   ```

3. Update `VITE_API_URL` in your `.env.local`:
   ```env
   VITE_API_URL=https://your-subdomain.ngrok-free.dev
   ```

The frontend's `api.ts` automatically adds `ngrok-skip-browser-warning: true` to all requests when the API URL contains `ngrok-free.dev`.

---

## Adding New Variables

### Frontend variable (browser-accessible)

1. Add to `frontend/.env.local`:
   ```env
   VITE_MY_VAR=value
   ```
2. Add to `frontend/src/config/env.ts`:
   ```ts
   export const env = {
     // ...
     myVar: import.meta.env.VITE_MY_VAR || 'default',
   }
   ```
3. Use `env.myVar` in components.

### Backend-only variable (server secret)

1. Add to `frontend/.env.local` **without** the `VITE_` prefix:
   ```env
   MY_SECRET=value
   ```
2. Add to `frontend/src/config/env.ts` with a `process` guard:
   ```ts
   mySecret: typeof process !== 'undefined' ? process.env.MY_SECRET : undefined,
   ```

This ensures the variable is never bundled into the browser JS.
