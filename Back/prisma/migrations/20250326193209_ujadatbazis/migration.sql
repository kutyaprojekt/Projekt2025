-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "profilePicture" TEXT,
    "admin" TEXT NOT NULL DEFAULT 'true'
);

-- CreateTable
CREATE TABLE "Animal" (
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
    "elutasitva" BOOLEAN NOT NULL,
    "elutasitasoka" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
