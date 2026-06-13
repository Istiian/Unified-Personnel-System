# Identity Access Service (IAS)

The Identity Access Service handles all authentication and user management for the Unified Personnel Management System. It is a downstream microservice that sits behind the API Gateway and is never called directly by clients.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Database](#database)
- [Project Structure](#project-structure)
- [Modules](#modules)
  - [Auth Module](#auth-module)
  - [User Module](#user-module)
- [Middleware](#middleware)
- [Roles & Permissions](#roles--permissions)
- [Token Strategy](#token-strategy)
- [Redis Usage](#redis-usage)
- [Email](#email)
- [Logging](#logging)
- [Error Handling](#error-handling)

---

## Overview

IAS is responsible for:

- **Authentication** — login, logout, token refresh using RS256-signed JWTs
- **Password management** — change password, OTP-based password reset
- **User management** — create, update, and list users
- **Authorization** — role-based permission checks on every protected endpoint

All requests arrive from the Gateway, which strips client tokens and injects trusted `x-user-id` and `x-user-role` headers. IAS trusts these headers for identity — it never re-validates JWTs itself.

---

## Architecture

```
Gateway (port 3000)
  │
  │  x-user-id, x-user-role headers (from verified JWT)
  ▼
IAS (port 3001)
  │
  ├── PostgreSQL  — persistent user data
  ├── Redis       — OTP storage, refresh token storage, response caching
  └── Nodemailer  — OTP email delivery
```

---

## Prerequisites

- Node.js >= 18
- pnpm >= 10
- PostgreSQL database
- Redis server
- An RS256 key pair (private + public PEM files)
- SMTP credentials for email delivery

---

## Setup

```bash
# Install dependencies
pnpm install

# Copy and fill in the environment file
cp .env.example .env   # or create .env manually — see Environment Variables section

# Generate and run database migrations
pnpm db:generate
pnpm db:migrate
```

Place your RS256 key pair at the paths specified by `PRIVATE_KEY_PATH` and `PUBLIC_KEY_PATH` (defaults: `./keys/private.pem`, `./keys/public.pem`).

---

## Environment Variables

| Variable           | Required | Default                    | Description                                     |
|--------------------|----------|----------------------------|-------------------------------------------------|
| `PORT`             | No       | `3001`                     | Port IAS listens on                             |
| `DATABASE_URL`     | Yes      | —                          | PostgreSQL connection string                    |
| `PRIVATE_KEY_PATH` | Yes      | —                          | Path to RS256 private key PEM file              |
| `PUBLIC_KEY_PATH`  | Yes      | —                          | Path to RS256 public key PEM file               |
| `REDIS_URL`        | No       | `redis://localhost:6379`   | Redis connection URL                            |
| `EMAIL_HOST`       | Yes      | —                          | SMTP host (e.g. `smtp.gmail.com`)               |
| `EMAIL_PORT`       | No       | `587`                      | SMTP port                                       |
| `EMAIL_USER`       | Yes      | —                          | SMTP sender address                             |
| `EMAIL_PASS`       | Yes      | —                          | SMTP password or app password                   |
| `NODE_ENV`         | No       | —                          | Set to `production` to enable secure cookies    |

Example `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/Identity_Access_Service
PRIVATE_KEY_PATH=./keys/private.pem
PUBLIC_KEY_PATH=./keys/public.pem
REDIS_URL=redis://localhost:6379
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=your_app_password
```

> **Security note:** Never commit `.env` or key files to version control.

---

## Running the Server

```bash
# Development (with hot reload)
pnpm dev

# The server starts at http://localhost:3001
```

---

## Database

IAS uses **PostgreSQL** via [Drizzle ORM](https://orm.drizzle.team/).

### Schema

**`users` table**

| Column              | Type         | Constraints         |
|---------------------|--------------|---------------------|
| `id`                | serial       | Primary key         |
| `first_name`        | varchar(255) | Not null            |
| `last_name`         | varchar(255) | Not null            |
| `middle_name`       | varchar(255) | Nullable            |
| `birth_date`        | date         | Not null            |
| `gender`            | GenderEnum   | Not null            |
| `email`             | varchar(255) | Not null, Unique    |
| `contact_number`    | varchar(20)  | Not null            |
| `username`          | varchar(255) | Not null, Unique    |
| `password`          | varchar(255) | Not null (hashed)   |
| `house_number`      | varchar(255) | Not null            |
| `street`            | varchar(255) | Not null            |
| `barangay`          | varchar(255) | Not null            |
| `city_municipality` | varchar(255) | Not null            |
| `region`            | varchar(255) | Not null            |
| `province`          | varchar(255) | Not null            |
| `role`              | RoleEnum     | Not null            |

Indexes are defined on `email` and `username` for fast lookups.

### Enum Values

**RoleEnum:** `Student`, `Staff`, `Faculty`, `Admin`, `SuperAdmin`

**GenderEnum:** `Male`, `Female`, `Other`

### Migration Commands

```bash
pnpm db:generate   # Generate migration files from schema changes
pnpm db:migrate    # Apply pending migrations to the database
pnpm db:push       # Push schema directly (dev only, skips migration files)
```

---

## Project Structure

```
Identity_Access_Service/
├── src/
│   ├── index.ts                    # App entry point
│   ├── config/
│   │   └── redis.ts                # Redis client setup
│   ├── db/
│   │   ├── client.ts               # Drizzle + pg pool setup
│   │   ├── enum.ts                 # PostgreSQL enum definitions
│   │   ├── schema.ts               # Schema barrel export
│   │   └── user.ts                 # users table definition
│   ├── lib/
│   │   ├── bcrypt.ts               # Password hashing & comparison
│   │   └── token.ts                # JWT sign & verify (RS256)
│   ├── middleware/
│   │   ├── checkPermission.ts      # Role-based access control
│   │   ├── errorHandler.ts         # Global Express error handler
│   │   └── validateRequest.ts      # Zod request body validation
│   ├── module/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts  # Route handlers for auth
│   │   │   ├── auth.routes.ts      # Auth route definitions
│   │   │   ├── auth.service.ts     # Auth business logic
│   │   │   ├── auth.validator.ts   # Zod schemas for auth inputs
│   │   │   └── type.auth.ts        # Auth TypeScript types
│   │   └── user/
│   │       ├── user.controller.ts  # Route handlers for users
│   │       ├── user.routes.ts      # User route definitions
│   │       ├── user.service.ts     # User business logic
│   │       ├── user.type.ts        # User TypeScript types
│   │       └── user.validator.ts   # Zod schemas for user inputs
│   └── utils/
│       ├── AppError.ts             # Custom error class with statusCode
│       ├── authCookie.ts           # Refresh token cookie helpers
│       ├── credentialSlip.ts       # PDF credential slip generator
│       ├── logger.ts               # Winston logger
│       └── sendEmail.ts            # Nodemailer email utility
├── keys/
│   ├── private.pem                 # RS256 private key (never commit)
│   └── public.pem                  # RS256 public key (never commit)
├── drizzle/                        # Auto-generated migration files
├── logs/
│   ├── combined.log
│   └── error.log
├── drizzle.config.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## Modules

### Auth Module

Base path: `/IAS/auth`

#### Public Endpoints

| Method | Path                      | Body                                              | Description                                    |
|--------|---------------------------|---------------------------------------------------|------------------------------------------------|
| `POST` | `/session`                | `{ username, password }`                          | Login. Returns access token; sets refresh token cookie |
| `POST` | `/token`                  | *(refresh token cookie)*                          | Refresh access token                           |
| `POST` | `/password/reset-request` | `{ username }`                                    | Send 6-digit OTP to the user's registered email |
| `POST` | `/otp/verify`             | `{ username, otp }`                               | Verify OTP (required before password reset)    |
| `POST` | `/password/reset`         | `{ username, otp, newPassword, repeatNewPassword }` | Reset password using verified OTP            |

#### Protected Endpoints (requires `x-user-id` header from Gateway)

| Method   | Path                       | Body                                                      | Permission      | Description                        |
|----------|----------------------------|-----------------------------------------------------------|-----------------|------------------------------------|
| `DELETE` | `/session`                 | —                                                         | Any auth user   | Logout — clears refresh token cookie |
| `PATCH`  | `/password/change`         | `{ currentPassword, newPassword, repeatNewPassword }`     | `SuperAdmin`, `Self` | Change own password           |
| `PATCH`  | `/password/change/:userId` | `{ newPassword, repeatNewPassword }`                      | `SuperAdmin`    | Admin: change another user's password |

**Login response:**
```json
{
  "success": true,
  "accessToken": "<JWT>"
}
```
The refresh token is set as an `httpOnly` cookie scoped to `/IAS/auth/token`.

---

### User Module

Base path: `/IAS/users`

All endpoints require the `x-user-id` header (set by Gateway after JWT verification).

| Method   | Path   | Body / Query                                           | Permission                  | Description                                              |
|----------|--------|--------------------------------------------------------|-----------------------------|----------------------------------------------------------|
| `POST`   | `/`    | Full user object (see validator)                       | `SuperAdmin`, `Admin`       | Create a new user. Returns a PDF credential slip.        |
| `PATCH`  | `/:id` | Partial user fields (excluding password, username, role) | `SuperAdmin`, `Admin`, `Self` | Update user information                               |
| `GET`    | `/:id` | —                                                      | `SuperAdmin`, `Admin`, `Self` | Get user by ID                                         |
| `GET`    | `/`    | `?page=1&limit=10&search=&role=`                       | `SuperAdmin`, `Admin`       | List users with optional search and role filter          |

**Create User — required fields:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "middleName": "string (optional)",
  "birthDate": "YYYY-MM-DD",
  "gender": "Male | Female | Other",
  "email": "string",
  "contactNumber": "string",
  "houseNumber": "string",
  "street": "string",
  "barangay": "string",
  "cityMunicipality": "string",
  "region": "string",
  "province": "string",
  "role": "Student | Staff | Faculty | Admin | SuperAdmin"
}
```

On creation, the system auto-generates a `username` (`LASTNAME + YEAR + ID`) and a random 16-character `password`. A **PDF credential slip** containing these credentials is returned directly as the response body (`Content-Type: application/pdf`).

---

## Middleware

### `checkPermission(...roles)`

Reads the `x-user-id` header injected by the Gateway, looks up the user in the database, and checks if their role is in the allowed list.

Special role `Self` grants access when the requesting user's ID matches the target resource ID in `req.params.id` or `req.params.userId`.

```typescript
checkPermission('Admin', 'SuperAdmin')  // only admins
checkPermission('SuperAdmin', 'Self')   // superadmin or the user themselves
```

Returns `401` if the header is missing, `403` if the role is insufficient.

### `validateRequest(schema)`

Validates `req.body` against a Zod schema. On failure, returns the first validation error message as a `400` response. On success, replaces `req.body` with the parsed (type-safe) data.

### `errorHandler`

Catches all errors passed via `next(error)`. Logs `5xx` errors at `error` level with stack trace; `4xx` at `warn`. Response shape:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Roles & Permissions

| Role         | Description                                      |
|--------------|--------------------------------------------------|
| `Student`    | Basic user with limited self-service access      |
| `Staff`      | Administrative staff                             |
| `Faculty`    | Teaching faculty                                 |
| `Admin`      | Can manage users within their scope              |
| `SuperAdmin` | Full system access                               |
| `Self`       | Special pseudo-role — grants access to own data  |

---

## Token Strategy

IAS uses **RS256 asymmetric JWT signing**:

- **Private key** (`PRIVATE_KEY_PATH`) — used by IAS to sign access and refresh tokens
- **Public key** (`PUBLIC_KEY_PATH`) — used by the Gateway to verify tokens; also used by IAS to verify refresh tokens

| Token         | Expiry | Storage                          |
|---------------|--------|----------------------------------|
| Access token  | 1 hour | Returned in response body        |
| Refresh token | 7 days | `httpOnly` cookie + Redis        |

Both keys are loaded once at module startup to avoid repeated filesystem reads.

---

## Redis Usage

| Key pattern                                          | TTL     | Purpose                                    |
|------------------------------------------------------|---------|--------------------------------------------|
| `otp:<userId>`                                       | 5 min   | Stores OTP for password reset flow         |
| `refreshToken:<userId>`                              | 7 days  | Stores refresh token for validation        |
| `user:<userId>`                                      | 1 hour  | Caches individual user records             |
| `userList:page=...:limit=...:search=...:role=...:version=...` | 5 min | Caches paginated user list results |
| `userListVersion`                                    | —       | Incremented on user updates to invalidate list cache |

---

## Email

OTP emails are sent via Nodemailer using SMTP. Configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` in `.env`.

The OTP is a 6-digit random integer. It is stored in Redis **before** the email is sent to ensure it can always be verified even if the email delivery is delayed.

---

## Logging

Logs are written by [Winston](https://github.com/winstonjs/winston):

| Destination         | Format | Level filter |
|---------------------|--------|--------------|
| `logs/error.log`    | JSON   | `error` only |
| `logs/combined.log` | JSON   | All levels   |
| Console             | Colorized text with stack traces | All levels |

---

## Error Handling

Throw `AppError` anywhere in the service layer to produce a structured HTTP error:

```typescript
throw new AppError('User not found', 404);
// → { "success": false, "error": "User not found" }
```

Unmatched routes return `404` with the path in the message.

> **Note:** `user.service.ts` currently has an unresolved Git merge conflict in the `listUsers` function. Resolve the `<<<<<<< HEAD` / `>>>>>>> service/identity_access` markers before running in production.
