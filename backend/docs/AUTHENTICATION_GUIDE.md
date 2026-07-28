# HomeMart Authentication & Security Guide

## Overview
HomeMart uses **JSON Web Token (JWT)** based authentication with **bcrypt** password hashing.

### Key Authentication Policies
1. **Permanent Access Tokens**: Authentication access tokens issued upon login/registration do NOT expire.
2. **Password Security**: Passwords are hashed using `bcryptjs` with 10 salt rounds prior to storage. Passwords are never returned in database queries or API outputs.
3. **Security Headers**: API uses `helmet` middleware for standard HTTP security headers and CORS protection.
4. **Rate Limiting**:
   - Authentication endpoints (`/auth/register`, `/auth/login`) are limited to 30 requests per 15-minute window per IP.
   - General API endpoints are limited to 300 requests per 15-minute window per IP.

---

## Standard Error Responses
When authentication fails, the server responds with a `401 Unauthorized` status:

```json
{
  "success": false,
  "message": "Authentication token is missing"
}
```
