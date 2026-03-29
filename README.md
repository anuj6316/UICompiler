# UICompiler

> An AI-driven system that converts natural language and sketches into production-ready frontend code.

UICompiler generates structured UI schemas, enforces best practices, and compiles them into scalable, maintainable React components with consistent layouts, design tokens, and reusable architecture.

---

## Documentation Index

| Document | Description |
|---|---|
| [Architecture Overview](docs/architecture.md) | System design, tech stack, and project structure |
| [Backend Guide](docs/backend.md) | Django REST API, models, serializers, views, and endpoints |
| [Frontend Guide](docs/frontend.md) | React app structure, routing, contexts, and pages |
| [API Reference](docs/api-reference.md) | Complete REST API endpoint documentation |
| [Setup & Installation](docs/setup.md) | Local development setup for backend and frontend |
| [Design System](docs/design-system.md) | Tailwind theme, color palette, typography, and component patterns |
| [Environment Config](docs/environment.md) | Environment variables and configuration guide |
| [Backend–Frontend Integration](docs/integration.md) | How frontend communicates with the Django API |

---

## Quick Start

### Backend

```bash
# Install Python dependencies
pip install -r requirements.txt   # or: uv sync

# Run migrations
python manage.py migrate

# Start dev server
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:8000`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 6, Django REST Framework, SimpleJWT |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| UI Components | Base UI, shadcn/ui, Lucide Icons |
| Canvas | Konva / React-Konva |
| Animation | Motion (Framer Motion) |
| Auth | JWT (access + refresh tokens with blacklisting) |
