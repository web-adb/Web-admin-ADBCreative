-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "teamImages" TEXT[],
    "status" TEXT NOT NULL,
    "budget" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
