# Architecture Overview

## System Design

UICompiler is a full-stack web application with a clear separation between a Django REST API backend and a React SPA frontend. They communicate over HTTP using JWT authentication.

[![Architecture Diagram](https://storage.googleapis.com/second-petal-295822.appspot.com/elements/elements%3A9207f3df6b7d41438de699b0d635ae4f550626bef4839a6296f3cc8ab366709d.png)](https://app.eraser.io/new?requestId=w3Gz0pBnTpw0Q9QIW6cG&state=SKShuJzaATKp2NXlcIf1F)

*[✍️ Edit this diagram in Eraser](https://app.eraser.io/new?requestId=w3Gz0pBnTpw0Q9QIW6cG&state=SKShuJzaATKp2NXlcIf1F)*

<details>
<summary>View Eraser DSL Code</summary>

```eraser
// Define groups and nodes
Browser [icon: monitor] {
  UI [label: "React 19 + Tailwind v4 Pages", icon: react, color: blue]
  State [label: "React Contexts", icon: box, color: blue]
  Client [label: "Central API Service", icon: link, color: blue]
}

Server [icon: server] {
  API [label: "REST API (DRF)", icon: python, color: green]
  Auth [label: "Authentication Flow", icon: lock, color: green]
}

Storage [icon: database] {
  DB [label: "Database (SQLite/Postgres)", icon: database, color: yellow]
}

// Connections
UI <> State
State <> Client
API <> Auth
Client > API: "HTTP Requests (Bearer JWT)"
API > DB: "ORM Queries"
```
</details>

---

## Project Structure

```
UICompiler/
├── README.md                    # Central documentation hub
├── docs/                        # All project documentation
│   ├── architecture.md
│   ├── backend.md
│   ├── frontend.md
│   ├── api-reference.md
│   ├── setup.md
│   ├── design-system.md
│   ├── environment.md
│   └── integration.md
│
├── manage.py                    # Django CLI entry point
├── pyproject.toml               # Python deps (uv/pip)
├── core/                        # Django project config
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── authentication/              # Auth Django app
│   ├── models.py                # CustomUser, EmailOTP
│   ├── serializers.py
│   ├── views.py                 # AuthViewSet
│   ├── urls.py
│   └── migrations/
│
└── frontend/                    # React SPA
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── components/ui/           # Reusable UI components (shadcn/base-ui)
    ├── lib/utils.ts             # cn() utility
    └── src/
        ├── main.tsx
        ├── App.tsx              # Router + Providers
        ├── index.css            # Tailwind + CSS vars
        ├── config/env.ts        # Centralized env config
        ├── contexts/
        │   ├── ThemeContext.tsx
        │   └── UserContext.tsx
        ├── components/
        │   └── layout/          # Global application shells
        │       ├── DashboardLayout.tsx
        │       ├── Header.tsx
        │       └── Sidebar.tsx
        ├── services/api.ts      # HTTP client
        └── pages/
            ├── Auth.tsx
            ├── Home.tsx
            ├── Profile.tsx
            └── SketchToUI.tsx
```

---

## Key Design Decisions

### Authentication Flow

1. User requests OTP → backend sends email
2. User submits OTP + credentials → backend validates and creates account
3. Backend returns JWT access + refresh tokens
4. Frontend stores tokens in `localStorage`
5. All authenticated requests send `Authorization: Bearer <access_token>`
6. Logout blacklists the refresh token (via SimpleJWT's token blacklist)

### Frontend State

- **UserContext** — global user session state; hydrates from `localStorage` on mount
- **ThemeContext** — dark/light mode toggle; applies `dark` class to `<html>`
- **Local state** — per-page form data and UI interactions

### CORS

The backend allows requests from `localhost:3000`, `localhost:5173`, and the configured production domain. The `ngrok-skip-browser-warning` header is also whitelisted for ngrok tunnels.
