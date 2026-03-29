# API Reference

Base URL: `http://localhost:8000` (development)

All endpoints are under the `/auth/` prefix. Authenticated endpoints require the header:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### `POST /auth/send_otp/`

Sends a 6-digit OTP to the given email. Deletes any existing OTP for that email first.

**Auth required:** No

**Request body:**
```json
{ "email": "user@example.com" }
```

**Response `200`:**
```json
{
  "msg": "OTP sent successfully",
  "otp": 123456
}
```

> ⚠️ The `otp` field is returned in development. Remove before production.

---

### `POST /auth/signup/`

Creates a new user account after verifying the OTP.

**Auth required:** No

**Request body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "janedoe",
  "email": "user@example.com",
  "password": "securepassword",
  "otp": "123456"
}
```

**Response `201`:**
```json
{
  "msg": "User created successfully",
  "data": {
    "first_name": "Jane",
    "last_name": "Doe",
    "username": "janedoe",
    "email": "user@example.com",
    "is_email_verified": true
  }
}
```

**Response `400`** (invalid OTP, expired OTP, validation errors):
```json
{ "msg": "Something went wrong", "data": { ... } }
```

---

### `POST /auth/login/`

Authenticates a user and returns JWT tokens.

**Auth required:** No

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "msg": "User logged in successfully",
  "data": {
    "email": "user@example.com",
    "password": "...",
    "refresh_token": "<refresh_jwt>",
    "access_token": "<access_jwt>"
  }
}
```

**Response `400`** (invalid credentials):
```json
{ "msg": "Something went wrong", "data": { ... } }
```

---

### `POST /auth/logout/`

Blacklists the refresh token, invalidating the session.

**Auth required:** Yes

**Request body:**
```json
{ "refresh_token": "<refresh_jwt>" }
```

**Response `200`:**
```json
{ "msg": "User logged out successfully" }
```

---

### `POST /auth/change_password/`

Changes the password for the currently authenticated user.

**Auth required:** Yes

**Request body:**
```json
{
  "old_password": "currentpassword",
  "new_password": "newpassword",
  "confirm_password": "newpassword"
}
```

**Response `200`:**
```json
{ "msg": "Password changed successfully" }
```

**Response `400`** (wrong old password or mismatched new passwords):
```json
{ "msg": "Old password is incorrect" }
```

---

### `POST /auth/reset_password/`

Resets the password using an OTP. Call `send_otp` first to get the OTP.

**Auth required:** No

**Request body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "newpassword",
  "confirm_password": "newpassword"
}
```

**Response `200`:**
```json
{ "msg": "Password reset successfully" }
```

---

## User Profile Endpoints

### `GET /auth/get_user_details/`

Returns the profile of the currently authenticated user.

**Auth required:** Yes

**Response `200`:**
```json
{
  "msg": "User details fetched successfully",
  "data": {
    "first_name": "Jane",
    "last_name": "Doe",
    "username": "janedoe",
    "email": "user@example.com",
    "is_email_verified": true
  }
}
```

---

### `PATCH /auth/get_user_details/`

Partially updates the authenticated user's profile.

**Auth required:** Yes

**Request body** (any subset of fields):
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "username": "janesmith"
}
```

**Response `200`:**
```json
{
  "msg": "User details updated successfully",
  "data": { ... }
}
```

---

## Error Format

All error responses follow this shape:

```json
{
  "msg": "Human-readable error description",
  "data": { ... }   // validation errors, field-level detail
}
```

Common HTTP status codes used:
- `200` — success
- `201` — resource created
- `400` — bad request / validation error
- `401` — authentication required
- `403` — permission denied
