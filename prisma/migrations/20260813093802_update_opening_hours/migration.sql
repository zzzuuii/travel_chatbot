/*
  Warnings:

  - You are about to drop the column `closingTime` on the `TouristSpot` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `TouristSpot` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT,
    "closeTime" TEXT,
    "closesNextDay" BOOLEAN NOT NULL DEFAULT false,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "touristSpotId" INTEGER NOT NULL,
    CONSTRAINT "OpeningHour_touristSpotId_fkey" FOREIGN KEY ("touristSpotId") REFERENCES "TouristSpot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TouristSpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "entranceFee" REAL NOT NULL,
    "stayMinutes" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "recommendedTime" TEXT
);
INSERT INTO "new_TouristSpot" ("entranceFee", "id", "latitude", "longitude", "name", "stayMinutes") SELECT "entranceFee", "id", "latitude", "longitude", "name", "stayMinutes" FROM "TouristSpot";
DROP TABLE "TouristSpot";
ALTER TABLE "new_TouristSpot" RENAME TO "TouristSpot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHour_touristSpotId_dayOfWeek_key" ON "OpeningHour"("touristSpotId", "dayOfWeek");
