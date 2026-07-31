import { MigrationInterface, QueryRunner } from 'typeorm';

// The original schema left "updatedAt" without a database default (it relied
// on the previous ORM setting it from application code on every write).
// TypeORM's @UpdateDateColumn expects the database to supply a default on
// insert, so add one here to match.
export class AddUpdatedAtDefaults1785497676429 implements MigrationInterface {
  name = 'AddUpdatedAtDefaults1785497676429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Room" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "Reservation" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "Payment" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Payment" ALTER COLUMN "updatedAt" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Reservation" ALTER COLUMN "updatedAt" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Room" ALTER COLUMN "updatedAt" DROP DEFAULT`);
  }
}
