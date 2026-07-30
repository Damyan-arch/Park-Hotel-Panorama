# Park Hotel Panorama — Website

New guest-facing website for Park Hotel Panorama (Tryavna, Bulgaria), replacing the current
phone-only reservation process with online booking and payment.

## Stack

- **Frontend:** Angular (standalone components, SCSS) — `frontend/`
- **Backend:** NestJS — `backend/`
- **Database:** PostgreSQL, accessed via Prisma — `backend/prisma/schema.prisma`
- **Payments:** Stripe

**Why this stack:** Angular + NestJS share TypeScript end-to-end, which suits a booking flow
with non-trivial client-side state (multi-step forms, live availability) and a backend that
must guarantee correctness for reservations and payments. PostgreSQL + Prisma give relational,
transactional guarantees — the schema includes a Postgres GiST exclusion constraint that makes
double-booking a room impossible at the database level, not just checked in application code.

This website is **guest-facing only** — no admin dashboard is included. Hotel staff currently
use a separate app; the backend's `reservations` module is kept as a clean, documented API
(Swagger at `/api` once the server is running) so that app can be connected later.

Note: Prisma 7's generated client requires an explicit driver adapter to connect (it no longer
reads `DATABASE_URL` implicitly at runtime) — `PrismaService` (`backend/src/prisma/prisma.service.ts`)
constructs a `@prisma/adapter-pg` adapter from `process.env.DATABASE_URL`. This differs from
older Prisma tutorials/docs and is easy to miss if you're used to earlier Prisma versions.

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
npm install                            # installs both workspaces (frontend + backend)
cd backend && npx prisma migrate deploy   # applies the already-written migrations
cd ..
npm run dev                            # runs Angular (http://localhost:4201) and Nest (http://localhost:3001) together
```

Note: use `npx prisma migrate deploy`, not `migrate dev` — the `park_hotel` role isn't a
superuser and can't create Postgres's temporary "shadow database" that `migrate dev` needs for
diffing. `deploy` just applies the existing migration files directly, which is all that's needed
here since the schema isn't changing.

The frontend dev server defaults to port **4201** (set in `frontend/angular.json`'s `serve.options.port`),
not Angular's usual 4200, to avoid clashing with other projects that may already be using 4200 on
your machine. To use a different port instead, either change that same `angular.json` value, or
override for a single run with `cd frontend && npx ng serve --port <PORT>` — if you do, also
update `FRONTEND_ORIGIN` in `backend/.env` to match (it's used for the backend's CORS check).

Other useful commands:

- `npm run dev:frontend` / `npm run dev:backend` — run just one side
- `npm run db:up` / `npm run db:down` — only relevant if you switch to the Docker Postgres path
- `npx prisma studio` (from `backend/`) — browse the local database in a web GUI
- Swagger API docs: `http://localhost:3001/api` once the backend is running

## Project layout

```
frontend/   Angular app — pages: home, rooms, booking, restaurant, gallery, services, location, contact
backend/    NestJS app — modules: rooms, guests, reservations, payments (+ shared prisma module)
  prisma/schema.prisma   data model (Room, Guest, Reservation, Payment)
  prisma/migrations/     versioned SQL migrations
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
