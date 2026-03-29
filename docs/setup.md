# Setup & Installation

## Prerequisites

| Tool | Minimum version |
|---|---|
| Python | 3.12 |
| Node.js | 20 |
| npm | 8 |

---

## Backend Setup

### 1. Clone and enter the repo

```bash
git clone <repo-url>
cd UICompiler
```

### 2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
```

### 3. Install Python dependencies

Using pip:
```bash
pip install -r requirements.txt
```

Or using uv (if `pyproject.toml` is present):
```bash
uv sync
```

Core dependencies:
- `django>=6.0.3`
- `djangorestframework>=3.17.1`
- `djangorestframework-simplejwt>=5.5.1`
- `django-cors-headers>=4.9.0`
- `pillow>=12.1.1`

### 4. Apply database migrations

```bash
python manage.py migrate
```

### 5. Create a superuser (optional, for admin access)

```bash
python manage.py createsuperuser
```

### 6. Start the development server

```bash
python manage.py runserver
```

The API is now available at `http://localhost:8000`.

---

## Frontend Setup

### 1. Enter the frontend directory

```bash
cd frontend
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env.local` file (or copy `.env.example` if it exists):

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=UICompiler
```

See [Environment Configuration](environment.md) for all available variables.

### 4. Start the development server

```bash
npm run dev
```

The frontend is now available at `http://localhost:3000`.

---

## Running Both Together

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
source .venv/bin/activate
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## Using ngrok (for mobile testing or sharing)

If you want to test on a mobile device or share a preview:

```bash
ngrok http 8000
```

Then update your frontend `.env.local`:
```env
VITE_API_URL=https://<your-ngrok-subdomain>.ngrok-free.dev
```

The API service automatically adds the `ngrok-skip-browser-warning` header for ngrok URLs.

Also add your ngrok domain to `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `core/settings.py`.

---

## Production Considerations

Before deploying, update these settings in `core/settings.py`:

- Set `DEBUG = False`
- Use a strong, random `SECRET_KEY` (store in environment variable, not in code)
- Switch `DATABASES` to PostgreSQL or another production database
- Switch `EMAIL_BACKEND` to an SMTP backend
- Remove `"otp": otp` from the `send_otp` response
- Set `ALLOWED_HOSTS` to your actual domain
- Run `python manage.py collectstatic`

---

## Troubleshooting

**Frontend can't reach the backend:**
- Confirm the backend is running on port 8000
- Check `VITE_API_URL` in your `.env.local`
- Verify `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`

**OTP not received:**
- In development, OTPs are printed to the Django terminal — check there
- Confirm you're calling `send_otp` before `signup` or `reset_password`

**JWT token expired:**
- Access tokens expire after 2 hours. Re-login to get new tokens.
- The frontend does not yet implement silent token refresh — this is a known limitation.
