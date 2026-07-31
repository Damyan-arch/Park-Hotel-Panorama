import { MigrationInterface, QueryRunner } from 'typeorm';

// Mirrors the schema this database was originally created with (previously
// managed by Prisma migrations). Marked as already-applied on the existing
// dev database — this file exists so a fresh database ends up with the same
// schema, and so future changes have a real migration history to build on.
export class InitialSchema1785497165136 implements MigrationInterface {
  name = 'InitialSchema1785497165136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "public"`);

    await queryRunner.query(`CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'SUITE', 'FAMILY')`);
    await queryRunner.query(
      `CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "Room" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "type" "RoomType" NOT NULL,
        "description" TEXT,
        "capacity" INTEGER NOT NULL,
        "basePricePerNight" DECIMAL(10,2) NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "imageUrls" TEXT[],
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Guest" (
        "id" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Reservation" (
        "id" TEXT NOT NULL,
        "roomId" TEXT NOT NULL,
        "guestId" TEXT NOT NULL,
        "checkInDate" DATE NOT NULL,
        "checkOutDate" DATE NOT NULL,
        "numberOfGuests" INTEGER NOT NULL,
        "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
        "totalPrice" DECIMAL(10,2) NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "specialRequests" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "Payment" (
        "id" TEXT NOT NULL,
        "reservationId" TEXT NOT NULL,
        "stripePaymentIntentId" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'EUR',
        "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "TranslationCache" (
        "id" TEXT NOT NULL,
        "locale" TEXT NOT NULL,
        "sourceHash" TEXT NOT NULL,
        "sourceText" TEXT NOT NULL,
        "translatedText" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "TranslationCache_pkey" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email")`);
    await queryRunner.query(
      `CREATE INDEX "Reservation_roomId_checkInDate_checkOutDate_idx" ON "Reservation"("roomId", "checkInDate", "checkOutDate")`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId")`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "TranslationCache_locale_sourceHash_key" ON "TranslationCache"("locale", "sourceHash")`,
    );

    await queryRunner.query(
      `ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );

    // Prevent double-booking: no two PENDING/CONFIRMED reservations may overlap
    // on the same room. This is the hard backstop; application-level
    // availability checks still run first for a good user-facing error message.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS btree_gist`);
    await queryRunner.query(`
      ALTER TABLE "Reservation"
        ADD CONSTRAINT no_overlapping_reservations
        EXCLUDE USING gist (
          "roomId" WITH =,
          daterange("checkInDate", "checkOutDate", '[)') WITH &&
        )
        WHERE ("status" IN ('PENDING', 'CONFIRMED'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Reservation" DROP CONSTRAINT "no_overlapping_reservations"`);
    await queryRunner.query(`ALTER TABLE "Payment" DROP CONSTRAINT "Payment_reservationId_fkey"`);
    await queryRunner.query(`ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_guestId_fkey"`);
    await queryRunner.query(`ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_roomId_fkey"`);
    await queryRunner.query(`DROP TABLE "TranslationCache"`);
    await queryRunner.query(`DROP TABLE "Payment"`);
    await queryRunner.query(`DROP TABLE "Reservation"`);
    await queryRunner.query(`DROP TABLE "Guest"`);
    await queryRunner.query(`DROP TABLE "Room"`);
    await queryRunner.query(`DROP TYPE "PaymentStatus"`);
    await queryRunner.query(`DROP TYPE "ReservationStatus"`);
    await queryRunner.query(`DROP TYPE "RoomType"`);
  }
}
