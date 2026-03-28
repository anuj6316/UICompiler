# Authentication API Documentation

**Base URL:** `https://echoless-spectrologically-teresa.ngrok-free.dev`

This document provides a technical guide for the Authentication Service endpoints. This is designed to enable frontend developers to integrate the backend without direct consultation with backend developers.

## Authentication Overview
The system uses **JWT (JSON Web Token)** for authentication.
- **Access Token:** Short-lived, used in the `Authorization` header for protected endpoints.
- **Refresh Token:** Longer-lived, used to obtain new access tokens or to logout.
- **Header Format:** `Authorization: Bearer <access_token>`

---

## 1. Send OTP
Request a 6-digit verification code to be sent to an email address. This is required before signup or password reset.

- **Method:** `POST`
- **URL:** `/auth/send_otp/`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "msg": "OTP sent successfully",
    "otp": 123456
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "msg": "Email is required"
  }
  ```

---

## 2. User Signup
Register a new user account. Requires a valid OTP previously sent to the email.

- **Method:** `POST`
- **URL:** `/auth/signup/`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "user@example.com",
    "password": "securepassword123",
    "otp": "123456"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "msg": "User created successfully",
    "data": {
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "email": "user@example.com"
    }
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "msg": "Something went wrong",
    "data": {
      "non_field_errors": ["Invalid OTP"]
    }
  }
  ```

---

## 3. User Login
Authenticate a user and receive JWT tokens.

- **Method:** `POST`
- **URL:** `/auth/login/`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "msg": "User logged in successfully",
    "data": {
      "email": "user@example.com",
      "refresh_token": "eyJhbG...",
      "access_token": "eyJhbG..."
    }
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "msg": "Something went wrong",
    "data": {
      "non_field_errors": ["Invalid credentials"]
    }
  }
  ```

---

## 4. Get User Details
Fetch the authenticated user's profile information.

- **Method:** `GET`
- **URL:** `/auth/get_user_details/`
- **Auth Required:** Yes (`Authorization: Bearer <access_token>`)
- **Success Response (200 OK):**
  ```json
  {
    "msg": "User details fetched successfully",
    "data": {
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "email": "user@example.com"
    }
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }
  ```

---

## 5. Update User Details
Partially update the authenticated user's profile.

- **Method:** `PATCH`
- **URL:** `/auth/get_user_details/`
- **Auth Required:** Yes (`Authorization: Bearer <access_token>`)
- **Request Body (Optional fields):**
  ```json
  {
    "first_name": "Jonathan",
    "last_name": "Smith"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "msg": "User details updated successfully",
    "data": {
      "first_name": "Jonathan",
      "last_name": "Smith",
      "username": "johndoe",
      "email": "user@example.com"
    }
  }
  ```

---

## 6. Change Password
Change the password for the currently logged-in user.

- **Method:** `POST`
- **URL:** `/auth/change_password/`
- **Auth Required:** Yes (`Authorization: Bearer <access_token>`)
- **Request Body:**
  ```json
  {
    "old_password": "oldpassword123",
    "new_password": "newpassword456",
    "confirm_password": "newpassword456"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "msg": "Password changed successfully"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "msg": "Old password is incorrect"
  }
  ```

---

## 7. Reset Password (Forgot Password)
Reset the password using an OTP sent to the email.

- **Method:** `POST`
- **URL:** `/auth/reset_password/`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "newpassword456",
    "confirm_password": "newpassword456"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "msg": "Password reset successfully"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "msg": "Something went wrong",
    "data": {
      "non_field_errors": ["Invalid OTP or OTP has expired"]
    }
  }
  ```

---

## 8. User Logout
Invalidate the refresh token to log out the user.

- **Method:** `POST`
- **URL:** `/auth/logout/`
- **Auth Required:** Yes (`Authorization: Bearer <access_token>`)
- **Request Body:**
  ```json
  {
    "refresh_token": "eyJhbG..."
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "msg": "User logged out successfully"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "msg": "Refresh token is required"
  }
  ```
