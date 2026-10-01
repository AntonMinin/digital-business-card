-- CreateTable
CREATE TABLE "Profile" (
    "id" STRING NOT NULL,
    "fullName" STRING NOT NULL,
    "title" STRING NOT NULL,
    "location" STRING NOT NULL,
    "email" STRING NOT NULL,
    "about" STRING NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "category" STRING NOT NULL,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" STRING NOT NULL,
    "label" STRING NOT NULL,
    "url" STRING NOT NULL,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_name_key" ON "Skill"("profileId", "name");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
