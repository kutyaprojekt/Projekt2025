/*
  Warnings:

  - You are about to alter the column `chipszam` on the `Animal` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "talalt_elveszett" TEXT NOT NULL,
    "allatfaj" TEXT NOT NULL,
    "kategoria" TEXT,
    "datum" TEXT NOT NULL,
    "neme" TEXT NOT NULL,
    "szin" TEXT NOT NULL,
    "meret" TEXT NOT NULL,
    "egyeb_info" TEXT,
    "helyszin" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "visszakerult_e" TEXT NOT NULL,
    "chipszam" BIGINT NOT NULL DEFAULT 0,
    "elutasitva" TEXT NOT NULL DEFAULT '',
    "elutasitasoka" TEXT NOT NULL DEFAULT '',
    "visszajelzes" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Animal" ("allatfaj", "chipszam", "datum", "egyeb_info", "elutasitasoka", "elutasitva", "filePath", "helyszin", "id", "kategoria", "meret", "neme", "szin", "talalt_elveszett", "userId", "visszajelzes", "visszakerult_e") SELECT "allatfaj", "chipszam", "datum", "egyeb_info", "elutasitasoka", "elutasitva", "filePath", "helyszin", "id", "kategoria", "meret", "neme", "szin", "talalt_elveszett", "userId", "visszajelzes", "visszakerult_e" FROM "Animal";
DROP TABLE "Animal";
ALTER TABLE "new_Animal" RENAME TO "Animal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
