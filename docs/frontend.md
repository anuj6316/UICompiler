# Frontend Guide

## Stack

- **React 19** — UI library
- **Vite 6** — build tool and dev server
- **TypeScript** — static typing
- **Tailwind CSS v4** — utility-first styling
- **React Router DOM v7** — client-side routing
- **Base UI / shadcn/ui** — headless + styled component primitives
- **Lucide React** — icon library
- **Konva / React-Konva** — canvas drawing (SketchToUI page)
- **Motion (Framer Motion)** — animations
- **Sonner** — toast notifications

---

## Architecture & Layout

The entire authenticated frontend experience is standardized around a global wrapper:

### `DashboardLayout` (`src/components/layout/DashboardLayout.tsx`)
A universal shell that maintains consistent navigation and state across all dashboard pages. Features include:
- A responsive, animated `Sidebar` with mobile overlay functionality.
- A sticky `Header` (either the default one or injected via a render prop).
- State lifting to avoid duplicate sidebar visibility and collapse toggling logic on per-page basis.

Any new authenticated page should be wrapped in `<DashboardLayout> {children} </DashboardLayout>`.

---

## Entry Points

| File | Role |
|---|---|
| `index.html` | HTML shell |
| `src/main.tsx` | React root, mounts `<App />` in `StrictMode` |
| `src/App.tsx` | Router + provider tree |
| `src/index.css` | Tailwind imports, CSS custom properties, utility layers |

---

## Provider Tree (`App.tsx`)

```
<ThemeProvider>
  <UserProvider>
    <BrowserRouter>
      <AppRoutes />      ← route-level auth guard
    </BrowserRouter>
  </UserProvider>
</ThemeProvider>
```

`AppRoutes` shows a spinner while `UserContext` loads, then redirects unauthenticated users to `/auth`.

---

## Routing

| Path | Component | Auth required |
|---|---|---|
| `/` | `Home` | ✅ |
| `/auth` | `Auth` | ❌ (redirects if logged in) |
| `/profile` | `Profile` | ✅ |
| `/sketch` | `SketchToUI` | ✅ |

---

## Contexts

### `ThemeContext` (`src/contexts/ThemeContext.tsx`)

Manages dark/light mode. Adds/removes the `dark` class on `<html>`.

```tsx
const { isDark, toggleTheme } = useTheme();
```

### `UserContext` (`src/contexts/UserContext.tsx`)

Manages the authenticated user session.

```tsx
const {
  user,           // UserProfile | null
  isLoading,
  login,          // POST /auth/login/
  signup,         // POST /auth/signup/
  sendOtp,        // POST /auth/send_otp/
  logout,         // POST /auth/logout/ + clear localStorage
  updateUser,     // PATCH /auth/get_user_details/
  changePassword, // POST /auth/change_password/
  resetPassword,  // POST /auth/reset_password/
  guestLogin,     // sets a mock guest user (no API call)
  refreshUser,    // re-fetches user details
} = useUser();
```

`UserProfile` shape:

```ts
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
}
```

On mount, `UserContext` checks `localStorage` for an `access_token` and hydrates the user if found.

---

## Pages

### `Auth.tsx`

Multi-step authentication page with four flows:

1. **Sign In** — email + password → JWT
2. **Sign Up** — name/email/password → send OTP → verify OTP → create account → auto-login
3. **Forgot Password** — email → send OTP → verify OTP + new password → redirect to sign-in
4. **Guest Login** — sets a mock user profile without any API call

The left panel (desktop only) shows a branded hero image. The right panel contains the adaptive form.

### `Home.tsx`

Dashboard with a collapsible sidebar. Features:

- Sidebar navigation (Dashboard, Sketch to UI, Projects, Schedule, Settings)
- Responsive mobile overlay menu
- Sticky header with search, theme toggle, notifications, and new project button
- Welcome card linking to the SketchToUI page
- Dark/light mode with smooth 500ms transitions

### `Profile.tsx`

Settings page showing:

- Cover photo and avatar (initials-based)
- Personal information form (first name, last name, job title, email, phone)
- Preferences panel (notifications toggle, password change, 2FA status)
- Change Password modal with old/new/confirm fields

### `SketchToUI.tsx`

The core feature page. It seamlessly plugs into `<DashboardLayout>` by injecting its own custom top bar (with the editable project title) via the `header` render prop.

**Header:**
- Features a "Back" navigation button.
- Contains an editable project title ("Untitled Project" by default) and viewport resizing actions.

**Workspace (Split-screen canvas + result panel):**

**Canvas panel (left):**
- Floating toolbar with pen, rectangle, circle, text, image upload, select tools
- Konva-powered canvas with undo/redo history
- Keyboard shortcuts (V, P, R, O, T for tools; Ctrl+Z/Y for undo/redo; Delete for element removal)
- Command palette (Ctrl+K)

**Result panel (right, appears after generation):**

| State | UI |
|---|---|
| `idle` | Empty state with instructions |
| `processing_variants` | Skeleton loaders + agent activity log |
| `wireframe_generated` | Three variant cards with AI-detected component tags |
| `variant_selected` | Selected variant highlighted + AI tweak textarea |
| `reviewing_tags` | List of detected component types with confirmation |
| `selecting_palettes` | Theme and font pickers |
| `processing_code` | Loading state |
| `completed` | Preview (device frames: desktop/tablet/mobile) or React code view |

---

## Services

### `src/services/api.ts`

Centralized HTTP client wrapping `fetch`. Reads `VITE_API_URL` from `src/config/env.ts`.

```ts
api.get('/auth/get_user_details/')
api.post('/auth/login/', { email, password })
api.patch('/auth/get_user_details/', { first_name: 'Jane' })
```

- Automatically injects `Authorization: Bearer <token>` from `localStorage`
- Handles `Content-Type: application/json` for all non-FormData bodies
- Injects `ngrok-skip-browser-warning` header when using ngrok URLs
- Throws descriptive errors on non-2xx responses

### `src/config/env.ts`

Single source of truth for environment variables. Import `env` instead of using `import.meta.env` directly anywhere else.

```ts
env.apiUrl      // VITE_API_URL or 'http://localhost:8000'
env.appName     // VITE_APP_NAME or 'UICompiler'
env.isDev       // import.meta.env.DEV
```

---

## Build Configuration (`vite.config.ts`)

Asset splitting has been aggressively configured via `manualChunks` to prevent 500kB minification warnings and optimize download speeds:
- `vendor-react` (React + Router)
- `vendor-canvas` (Konva)
- `vendor-ui` (Lucide, Framer Motion, Sonner)

---

## Component Library (`frontend/components/ui/`)

Re-exported from `components/ui/index.ts`. All built on **Base UI** primitives with Tailwind styling.

Available components: `Avatar`, `Badge`, `Button`, `Card`, `Collapsible`, `Command`, `Dialog`, `DropdownMenu`, `Input`, `InputGroup`, `Progress`, `RadioGroup`, `ResizablePanels`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Skeleton`, `Sonner (Toaster)`, `Tabs`, `Textarea`.

---

## Build & Scripts

```bash
npm run dev      # dev server on :3000
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # TypeScript type-check (noEmit)
npm run clean    # remove dist/
```
