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
    "recommendedTime" TEXT,
    "area" TEXT NOT NULL DEFAULT 'Unknown',
    "priorityWeight" INTEGER NOT NULL DEFAULT 50
);
INSERT INTO "new_TouristSpot" ("entranceFee", "id", "latitude", "longitude", "name", "priorityWeight", "recommendedTime", "stayMinutes") SELECT "entranceFee", "id", "latitude", "longitude", "name", "priorityWeight", "recommendedTime", "stayMinutes" FROM "TouristSpot";
DROP TABLE "TouristSpot";
ALTER TABLE "new_TouristSpot" RENAME TO "TouristSpot";
CREATE UNIQUE INDEX "TouristSpot_name_key" ON "TouristSpot"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
