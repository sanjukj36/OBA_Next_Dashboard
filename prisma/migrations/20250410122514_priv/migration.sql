-- CreateTable
CREATE TABLE "UserTypePriv" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pages" TEXT[],

    CONSTRAINT "UserTypePriv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTypePriv_name_key" ON "UserTypePriv"("name");
