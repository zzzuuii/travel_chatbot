-- CreateTable
CREATE TABLE "TouristSpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "entranceFee" REAL NOT NULL,
    "stayMinutes" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToTouristSpot" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToTouristSpot_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToTouristSpot_B_fkey" FOREIGN KEY ("B") REFERENCES "TouristSpot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTouristSpot_AB_unique" ON "_CategoryToTouristSpot"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTouristSpot_B_index" ON "_CategoryToTouristSpot"("B");
