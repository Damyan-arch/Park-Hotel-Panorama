# Park Hotel Panorama — Website

New guest-facing website for Park Hotel Panorama (Tryavna, Bulgaria), replacing the current
phone-only reservation process with online booking and payment.

## Stack

- **Frontend:** Angular (standalone components, SCSS) — `frontend/`
- **Backend:** NestJS — `backend/`
- **Database:** PostgreSQL, accessed via TypeORM — entities live next to each feature module
  (e.g. `backend/src/rooms/room.entity.ts`), migrations in `backend/src/database/migrations/`
- **Payments:** Stripe

**Why this stack:** Angular + NestJS share TypeScript end-to-end, which suits a booking flow
with non-trivial client-side state (multi-step forms, live availability) and a backend that
must guarantee correctness for reservations and payments. PostgreSQL + TypeORM give relational,
transactional guarantees — the schema includes a Postgres GiST exclusion constraint that makes
double-booking a room impossible at the database level, not just checked in application code.

This website is **guest-facing only** — no admin dashboard is included. Hotel staff currently
use a separate app; the backend's `reservations` module is kept as a clean, documented API
(Swagger at `/api` once the server is running) so that app can be connected later.

Note: `@CreateDateColumn`/`@UpdateDateColumn` rely on a real Postgres column default to fill in
a value on insert — a plain `DEFAULT CURRENT_TIMESTAMP` migration (`AddUpdatedAtDefaults`) had to
be added for `updatedAt` columns specifically, since the original schema only had one for
`createdAt`. Easy to miss if you're adding a new entity with these decorators.

## Prerequisites

- Node.js and npm
- A local PostgreSQL server. This project currently uses a **native PostgreSQL install** on this
  machine (not Docker) — a `park_hotel` role/database were created directly in it:
  ```sql
  CREATE ROLE park_hotel WITH LOGIN PASSWORD 'park_hotel_dev_password';
  CREATE DATABASE park_hotel OWNER park_hotel;
  ```
  `docker-compose.yml` is still included as an alternative (e.g. for a teammate without a local
  Postgres install) — run `npm run db:up`/`npm run db:down` if you use that route instead, but
  don't run both at once, since they'd both try to bind port 5432.

## Setup

```bash
npm install                       # installs both workspaces (frontend + backend)
cd backend && npm run migration:run  # applies any pending TypeORM migrations
cd ..
npm run dev                       # runs Angular (http://localhost:4201) and Nest (http://localhost:3001) together
```

The frontend dev server defaults to port **4201** (set in `frontend/angular.json`'s `serve.options.port`),
not Angular's usual 4200, to avoid clashing with other projects that may already be using 4200 on
your machine. To use a different port instead, either change that same `angular.json` value, or
override for a single run with `cd frontend && npx ng serve --port <PORT>` — if you do, also
update `FRONTEND_ORIGIN` in `backend/.env` to match (it's used for the backend's CORS check).

Other useful commands:

- `npm run dev:frontend` / `npm run dev:backend` — run just one side
- `npm run db:up` / `npm run db:down` — only relevant if you switch to the Docker Postgres path
- `npm run db:seed` (from `backend/`) — seeds starter rooms if the table is empty
- `npm run migration:generate -- src/database/migrations/<Name>` (from `backend/`) — generate a
  new migration from entity changes; `npm run migration:run` / `migration:revert` apply/undo
- Swagger API docs: `http://localhost:3001/api` once the backend is running

## Project layout

```
frontend/   Angular app — pages: home, rooms, booking, restaurant, gallery, services, location, contact
backend/    NestJS app — modules: rooms, guests, reservations, payments, translation
  src/rooms/room.entity.ts, src/guests/guest.entity.ts, etc.   TypeORM entities, one per module
  src/database/data-source.ts     TypeORM CLI config (migrations, seed script)
  src/database/migrations/        versioned SQL migrations
  src/database/seed.ts            starter room data
docker-compose.yml        local Postgres (+ optional pgAdmin: `docker compose --profile tools up -d`)
```

## What's implemented vs. what's next

This is a **scaffold**: both apps run, are wired to each other and to Postgres, and the data
model + double-booking safety constraint are in place. Not yet built (intentionally, as
follow-up work):

- Availability-check logic in `ReservationsService`
- Stripe PaymentIntent creation + webhook handling in `PaymentsService`/`PaymentsController`
- Request validation DTOs on the real endpoints
- The actual booking UI (room → dates → guest details → Stripe checkout) and an Angular HTTP
  service layer talking to the backend
- Full page content/design (currently placeholder text)
- Seed data, tests, hosting/deploy decision, and the future integration with the staff's
  existing booking-management app
