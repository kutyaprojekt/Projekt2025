-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "talalt_elveszett" TEXT NOT NULL,
    "allatfaj" TEXT NOT NULL,
    "kategoria" TEXT,
    "datum" TEXT NOT NULL,
    "nev" TEXT NOT NULL,
    "neme" TEXT NOT NULL,
    "szin" TEXT NOT NULL,
    "meret" TEXT NOT NULL,
    "egyeb_info" TEXT,
    "helyszin" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "visszakerult_e" TEXT NOT NULL,
    "elutasitva" BOOLEAN,
    "elutasitasoka" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Animal" ("allatfaj", "datum", "egyeb_info", "elutasitasoka", "elutasitva", "filePath", "helyszin", "id", "kategoria", "meret", "neme", "nev", "szin", "talalt_elveszett", "userId", "visszakerult_e") SELECT "allatfaj", "datum", "egyeb_info", "elutasitasoka", "elutasitva", "filePath", "helyszin", "id", "kategoria", "meret", "neme", "nev", "szin", "talalt_elveszett", "userId", "visszakerult_e" FROM "Animal";
DROP TABLE "Animal";
ALTER TABLE "new_Animal" RENAME TO "Animal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
