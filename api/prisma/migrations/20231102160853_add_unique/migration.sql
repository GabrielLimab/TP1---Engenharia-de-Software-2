-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "pictures" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PictureTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PictureTags_A_fkey" FOREIGN KEY ("A") REFERENCES "pictures" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PictureTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pictures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "profile_picture" BOOLEAN NOT NULL DEFAULT false,
    "picture_url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pictures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pictures" ("created_at", "id", "picture_url", "user_id") SELECT "created_at", "id", "picture_url", "user_id" FROM "pictures";
DROP TABLE "pictures";
ALTER TABLE "new_pictures" RENAME TO "pictures";
CREATE UNIQUE INDEX "pictures_user_id_profile_picture_key" ON "pictures"("user_id", "profile_picture");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikes_AB_unique" ON "_UserLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikes_B_index" ON "_UserLikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PictureTags_AB_unique" ON "_PictureTags"("A", "B");

-- CreateIndex
CREATE INDEX "_PictureTags_B_index" ON "_PictureTags"("B");
