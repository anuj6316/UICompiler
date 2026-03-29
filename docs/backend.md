# Backend Guide

## Stack

- **Django 6** — web framework
- **Django REST Framework (DRF)** — REST API
- **djangorestframework-simplejwt** — JWT auth with token blacklisting
- **django-cors-headers** — CORS support
- **Pillow** — image handling for user avatars

---

## Django Apps

### `authentication`

Handles all user identity: registration, login, OTP, password management, and profile.

### `core`

The Django project package containing `settings.py`, `urls.py`, `asgi.py`, and `wsgi.py`.

---

## Models

### `CustomUser` (`authentication/models.py`)

Extends `AbstractUser`. Uses **email as the primary login field** instead of username.

| Field | Type | Notes |
|---|---|---|
| `email` | EmailField | unique, `USERNAME_FIELD` |
| `username` | CharField | nullable, max 255 chars |
| `first_name` | CharField | inherited |
| `last_name` | CharField | inherited |
| `profile_img` | ImageField | nullable |
| `backcover_img` | ImageField | nullable |
| `is_email_verified` | BooleanField | default `False` |
| `verification_token` | UUIDField | auto-generated |

`REQUIRED_FIELDS = ['first_name', 'last_name', 'username']`

### `EmailOTP` (`authentication/models.py`)

Stores one-time passwords for email verification and password reset. OTPs expire after **10 minutes**.

| Field | Type | Notes |
|---|---|---|
| `email` | EmailField | target address |
| `otp` | CharField | 6-digit code |
| `created_at` | DateTimeField | auto on create |

`is_valid()` — returns `True` if `now < created_at + 10 minutes`.

---

## Serializers (`authentication/serializers.py`)

| Serializer | Purpose |
|---|---|
| `SignupSerializer` | Validates OTP, creates user, deletes OTP on success |
| `LoginSerializer` | Authenticates credentials, returns JWT tokens |
| `ChangePasswordSerializer` | Validates old/new/confirm password |
| `ResetPasswordSerializer` | Validates email + OTP + new password |
| `UserDetailsSerializer` | Read/update user profile fields |

---

## Views (`authentication/views.py`)

All views live in **`AuthViewSet`** (a DRF `ViewSet`). Default permission is `AllowAny`; individual actions override this where needed.

See [API Reference](api-reference.md) for the full endpoint list.

---

## URL Configuration

```
/admin/              → Django admin
/auth/               → authentication.urls (AuthViewSet router)
```

The router auto-generates URLs for all `@action` methods on `AuthViewSet`. For example:

- `POST /auth/send_otp/`
- `POST /auth/signup/`
- `POST /auth/login/`
- etc.

---

## JWT Configuration (`core/settings.py`)

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=120),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

Access tokens last **2 hours**. Refresh tokens last **7 days** and are blacklisted on rotation/logout.

---

## Email Backend

In development, `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` — OTPs are printed to the terminal instead of being sent. Switch to an SMTP backend for production.

> **Note:** The `send_otp` endpoint currently also returns the OTP in the response body (`"otp": <value>`). Remove this before deploying to production.

---

## Database

SQLite is used for development (`db.sqlite3`). Switch to PostgreSQL or another production-grade database before deploying.

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

---

## Running Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

Migration history:

| Migration | Change |
|---|---|
| `0001_initial` | Creates `CustomUser` |
| `0002_alter_customuser_username` | Makes username nullable |
| `0003_emailotp` | Creates `EmailOTP` |
| `0004_customuser_backcover_img_customuser_profile_img` | Adds image fields |
