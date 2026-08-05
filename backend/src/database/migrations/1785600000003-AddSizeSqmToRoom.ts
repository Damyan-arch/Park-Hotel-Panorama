import { MigrationInterface, QueryRunner } from 'typeorm';

// The public Rooms page has always shown a per-room size (30/42/30/49 m²)
// as a hardcoded frontend value; this gives it a real column so the size
// becomes admin-editable, and backfills the 4 existing seeded rooms so the
// displayed values don't change when the frontend switches to reading it
// from here.
export class AddSizeSqmToRoom1785600000003 implements MigrationInterface {
  name = 'AddSizeSqmToRoom1785600000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Room" ADD COLUMN "sizeSqm" INTEGER`);
    await queryRunner.query(
      `UPDATE "Room" SET "sizeSqm" = 30 WHERE "name" = 'Double Room with Balcony'`,
    );
    await queryRunner.query(
      `UPDATE "Room" SET "sizeSqm" = 42 WHERE "name" = 'Apartment with Balcony'`,
    );
    await queryRunner.query(
      `UPDATE "Room" SET "sizeSqm" = 30 WHERE "name" = 'Triple Room with Balcony'`,
    );
    await queryRunner.query(`UPDATE "Room" SET "sizeSqm" = 49 WHERE "name" = 'Town Suite'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Room" DROP COLUMN "sizeSqm"`);
  }
}
