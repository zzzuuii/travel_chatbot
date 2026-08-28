-- CreateTable
CREATE TABLE "SavedPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budget" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SavedPlanItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "travelMinutes" INTEGER,
    "fare" REAL,
    "transport" TEXT,
    "savedPlanId" TEXT NOT NULL,
    "touristSpotId" INTEGER NOT NULL,
    CONSTRAINT "SavedPlanItem_savedPlanId_fkey" FOREIGN KEY ("savedPlanId") REFERENCES "SavedPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedPlanItem_touristSpotId_fkey" FOREIGN KEY ("touristSpotId") REFERENCES "TouristSpot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
