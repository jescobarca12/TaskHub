# 📋 TaskHub

*[Versión en español](README.md)*

Full-stack task manager in the style of Todoist/TickTick. Each user organizes
their tasks into lists, with priorities, due dates and filters.

## Why this project

I wanted to learn everything from scratch by building it myself, understanding
the reason behind each decision instead of copy-pasting code from a tutorial.
More than the structure of the code, I was interested in understanding **how
things actually work under the hood**: why a password is hashed, why a
parameterized query prevents SQL injection, why a token is verified on every
request.

TaskHub is the result: a full-stack application built piece by piece,
prioritizing security and solid backend practices over the number of features.

## Features

- Authentication with registration and login via JWT.
- Full CRUD for lists, scoped to each user.
- CRUD for tasks within a list, with priority and due date.
- Mark tasks as completed.
- Combinable filters: pending only, high priority, or overdue tasks.
- Full isolation between users: each one only accesses their own data.

## Stack

**Backend:** Node.js, Express 5, TypeScript, PostgreSQL (`pg` driver with raw
SQL), `jsonwebtoken`, `bcrypt` and `zod`.

**Frontend:** React 19, TypeScript and Vite.

## Structure

```
TaskHub/
├── backend/
│   └── src/
│       ├── routes/          # endpoint definitions
│       ├── controllers/     # translate HTTP <-> logic
│       ├── services/        # business logic + SQL queries
│       ├── middlewares/     # auth, validation, error handling
│       ├── schemas/         # input validation with Zod
│       ├── errors/          # error classes with their HTTP status
│       └── db.ts            # PostgreSQL connection pool
└── frontend/
    └── src/
        ├── App.tsx          # main state and logic
        ├── Login.tsx / Registro.tsx
        ├── ListaItem.tsx / TareaItem.tsx   # reusable components
        └── types.ts         # shared types
```

## Setup

Requirements: Node.js 22.12+ (or 24 LTS) and PostgreSQL.

**1. Database**
```sql
CREATE DATABASE taskhub;
```
Then run the `CREATE TABLE` statements in `backend/db/schema.sql`.

**2. Backend**
```bash
cd backend
npm install
# create your .env file based on .env.example
npm run dev          # http://localhost:3000
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

## API

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/auth/register` | Create account (returns token) | No |
| POST | `/auth/login` | Log in (returns token) | No |
| GET | `/listas` | User's lists | Yes |
| POST | `/listas` | Create list | Yes |
| PATCH | `/listas/:id` | Edit list | Yes |
| DELETE | `/listas/:id` | Delete list | Yes |
| GET | `/listas/:listaId/tareas` | Tasks in a list (supports filters) | Yes |
| POST | `/listas/:listaId/tareas` | Create task | Yes |
| PATCH | `/tareas/:id` | Edit / complete task | Yes |
| DELETE | `/tareas/:id` | Delete task | Yes |

Filters (query params on `GET /listas/:listaId/tareas`, combinable):
`?estado=pendiente`, `?prioridad=alta`, `?vencidas=true`.

Protected routes require the `Authorization: Bearer <token>` header.

## Technical decisions

These are the design decisions I made on purpose, and the reasoning behind each:

- **Passwords hashed with bcrypt.** They are never stored or returned in plain
  text. If the database were leaked, the real passwords would stay protected.
- **Parameterized queries everywhere.** User values travel as parameters (`$1`,
  `$2`), never concatenated into the SQL. This makes SQL injection impossible:
  the database treats input as data, not as code.
- **Opaque authentication responses.** Login returns the same `401` whether the
  email doesn't exist or the password is wrong, to avoid revealing which accounts
  exist (*user enumeration*). For the same reason, accessing someone else's
  resource returns `404`, not `403`.
- **Per-user authorization on every query.** Identity always comes from the token
  (`req.user.id`), never from client-provided data. Every query filters by that
  id, so a user can't see or touch another user's resources.
- **Two-layer validation (defense in depth).** Zod validates input in the backend
  and returns a clear `400` before touching the database; PostgreSQL constraints
  (`CHECK`, `NOT NULL`) remain as a last safety net if anything slips through.
- **Centralized error handling.** A single middleware translates each error to
  its correct HTTP status (`404`, `409`, `400`...) via custom error classes,
  instead of repeating `try/catch` in every controller.
- **`ON DELETE CASCADE` on foreign keys.** Deleting a user cascades to their
  lists, and deleting a list cascades to its tasks, leaving no orphaned data.
- **Layered architecture** (routes → controllers → services → db) on the backend
  and reusable components on the frontend, separating responsibilities so the
  code is easy to maintain and extend.

## What I learned

More than writing code that works, this project helped me understand **how things
work under the hood**: the lifecycle of an authenticated request, why state in
React must be treated immutably, how tables relate through foreign keys, and why
security isn't a layer added at the end but decisions made at every step.

## Future improvements

- Tags (N:M relationship) to classify tasks.
- Subtasks.
- Automated tests.
- Sharing lists between users.

## Author

Jorge — Systems Engineering student.
