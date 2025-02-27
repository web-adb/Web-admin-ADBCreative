-- CreateTable
CREATE TABLE "PodcastProgram" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "host" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastProgram_pkey" PRIMARY KEY ("id")
);
