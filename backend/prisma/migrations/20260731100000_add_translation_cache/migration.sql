-- CreateTable
CREATE TABLE "TranslationCache" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TranslationCache_locale_sourceHash_key" ON "TranslationCache"("locale", "sourceHash");
