# Backend Integration Guide

There are two main ways to integrate a backend with this application, depending on where your backend lives.

---

## Option 1: External Backend (Recommended)
If you already have a backend running somewhere else (e.g., a Node.js, Python, or Go server hosted on Heroku, AWS, Render, etc.), you just need to configure the frontend to talk to it.

### Step 1: Set the Environment Variable
In your `.env.example` (and your actual `.env` file if running locally), set the `VITE_API_URL` to point to your backend.

```env
VITE_API_URL="https://api.yourdomain.com/v1"
```

### Step 2: Use the API Service
We have created a centralized API service at `src/services/api.ts`. This service automatically uses your `VITE_API_URL` and handles JSON parsing and error throwing.

**Example Usage in a Component:**
```tsx
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        // This will automatically call: https://api.yourdomain.com/v1/users/me
        const data = await api.get('/users/me');
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    }
    fetchUser();
  }, []);

  const updateProfile = async (newData) => {
    // This will automatically call: POST https://api.yourdomain.com/v1/users/update
    await api.post('/users/update', newData);
  };

  // ... render component
}
```

### Step 3: Handle CORS
Make sure your external backend is configured to accept Cross-Origin Resource Sharing (CORS) requests from this frontend's domain.

---

## Option 2: Full-Stack (Express + Vite in the same repo)
If you want to build your backend *inside* this exact same codebase using Node.js and Express, you need to convert this project into a Full-Stack application.

### Step 1: Install Express
```bash
npm install express cors
npm install -D @types/express @types/cors tsx
```

### Step 2: Create `server.ts`
Create a `server.ts` file in the root of your project:

```typescript
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // --- YOUR BACKEND API ROUTES GO HERE ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running!" });
  });

  app.post("/api/users", (req, res) => {
    const { name } = req.body;
    res.json({ message: `User ${name} created` });
  });
  // ---------------------------------------

  // Vite middleware for serving the frontend during development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
```

### Step 3: Update `package.json` Scripts
Change your `dev` and `start` scripts to run the new Express server instead of just Vite:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc && vite build",
    "start": "node server.ts"
  }
}
```

### Step 4: Update Environment
Set your `VITE_API_URL` to point to the local API route:
```env
VITE_API_URL="/api"
```

Now, when you use `api.get('/health')` in your React components, it will hit your Express server running in the same project!
