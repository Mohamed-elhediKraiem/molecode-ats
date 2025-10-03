-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "society" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "creationDate" DATETIME NOT NULL
);
