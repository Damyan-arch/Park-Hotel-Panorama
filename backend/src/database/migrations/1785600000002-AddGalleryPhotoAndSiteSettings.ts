import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryPhotoAndSiteSettings1785600000002 implements MigrationInterface {
  name = 'AddGalleryPhotoAndSiteSettings1785600000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "GalleryPhoto" (
        "id" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "altTextEn" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "SiteSettings" (
        "id" TEXT NOT NULL,
        "phoneNumber" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "restaurantHoursDays" TEXT NOT NULL,
        "restaurantHoursText" TEXT NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "SiteSettings"`);
    await queryRunner.query(`DROP TABLE "GalleryPhoto"`);
  }
}
