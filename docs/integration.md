# Backend–Frontend Integration

## Overview

The frontend (React SPA on port 3000) communicates with the Django backend (port 8000) over HTTP using JWT authentication. All API calls go through the centralized `src/services/api.ts` client.

---

## Authentication Flow

[![Authentication Sequence](https://storage.googleapis.com/second-petal-295822.appspot.com/elements/elements%3A037b8a6a596f167a82e3473e69fa1b1eee897566cd5522156d2d9a5500e1e82b.png)](https://app.eraser.io/new?requestId=W5s14XTBtqMffJ5M2ZSZ&state=HW8WlC2D-H-WEFEgCL_fQ)

*[✍️ Edit this diagram in Eraser](https://app.eraser.io/new?requestId=W5s14XTBtqMffJ5M2ZSZ&state=HW8WlC2D-H-WEFEgCL_fQ)*

<details>
<summary>View Eraser DSL Code</summary>

```eraser
User [icon: user] > React [label: "React (UserContext)", icon: react]: "Submits login form"
React > API [label: "Django Backend", icon: server]: "POST /auth/login/ {email, password}"

alt [label: "Invalid Credentials"] {
  API > React: "400 Bad Request"
  React > User: "Show Error Toast"
}
else [label: "Success"] {
  API > React: "200 OK + {access_token, refresh_token}"
  React > API: "GET /auth/get_user_details/"
  API > React: "Return User Profile"
  React > User: "Redirect to / (Dashboard)"
}
```
</details>

### Token Storage

| Key | Value | Where used |
|---|---|---|
| `access_token` | JWT access token (2h lifetime) | Every authenticated API request |
| `refresh_token` | JWT refresh token (7d lifetime) | `POST /auth/logout/` body |

### Session Restore on Page Load

`UserContext` runs this on mount:

```ts
const token = localStorage.getItem('access_token');
if (token) {
  await fetchUserDetails();  // GET /auth/get_user_details/
}
```

If the token is expired or invalid, `fetchUserDetails` throws, `logout()` is called, and the user is redirected to `/auth`.

> **Known limitation:** Silent token refresh is not implemented. When the access token expires (after 2 hours), the user must log in again manually.

---

## HTTP Client (`src/services/api.ts`)

### Request pipeline

For every request, `api.ts`:
1. Resolves the full URL from `env.apiUrl + endpoint`
2. Sets `Content-Type: application/json` (unless `FormData`)
3. Sets `Accept: application/json`
4. Injects `ngrok-skip-browser-warning: true` for ngrok URLs
5. Reads `access_token` from `localStorage` and sets `Authorization: Bearer <token>` (if `requireAuth` is not `false`)
6. Makes the `fetch` call with `mode: 'cors'` and `credentials: 'include'`
7. Throws on non-2xx responses with the backend's `msg` field as the error message

### Unauthenticated requests

Pass `{ requireAuth: false }` as the options argument:

```ts
await api.post('/auth/login/', data, { requireAuth: false });
```

Used for login, signup, send-OTP, and reset-password.

---

## CORS Configuration (Backend)

`core/settings.py` allows these origins:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",     # Vite default
    "http://localhost:5173",     # alternate Vite port
    "http://localhost:8000",     # same-origin for testing
    "https://<ngrok-domain>",    # ngrok tunnel
    # production URLs...
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    "ngrok-skip-browser-warning",
]
```

---

## Data Mapping

The Django backend uses **snake_case** field names (`first_name`, `last_name`). The frontend uses **camelCase** (`firstName`, `lastName`). The mapping happens in `UserContext`:

### Reading (backend → frontend)

```ts
setUser({
  firstName: data.first_name || '',
  lastName:  data.last_name  || '',
  // ...
});
```

### Writing (frontend → backend)

```ts
const backendUpdates: any = {};
if (updates.firstName) backendUpdates.first_name = updates.firstName;
if (updates.lastName)  backendUpdates.last_name  = updates.lastName;
await api.patch('/auth/get_user_details/', backendUpdates);
```

---

## Error Handling

The backend wraps all errors in:
```json
{ "msg": "...", "data": { ... } }
```

`api.ts` extracts `msg` and throws it as an `Error`. Components catch it and display it in local `error` state:

```tsx
try {
  await login(credentials);
} catch (err: any) {
  setError(err.message || 'Something went wrong.');
}
```

---

## File Uploads

For profile image uploads (future feature), use `api.postFormData`:

```ts
const formData = new FormData();
formData.append('profile_img', file);
await api.postFormData('/auth/get_user_details/', formData);
```

This skips the `Content-Type: application/json` header so the browser can set the correct `multipart/form-data` boundary.

---

## Adding a New Feature End-to-End

1. **Backend:** Add a new `@action` on `AuthViewSet` (or create a new app/viewset)
2. **Backend:** Add a serializer if needed
3. **Backend:** Verify the URL is accessible via the DRF router
4. **Frontend:** Add the API call in `UserContext` (or a new context/hook)
5. **Frontend:** Call it from the page component and handle loading/error states
6. **Frontend:** Update `env.ts` if a new environment variable is needed
