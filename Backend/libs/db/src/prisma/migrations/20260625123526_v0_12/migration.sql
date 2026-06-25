-- CreateTable
CREATE TABLE "AntipixelStatusHistory" (
    "id" SERIAL NOT NULL,
    "changeMadeByUserId" INTEGER NOT NULL,
    "status" "EUserAccountStatus" NOT NULL,
    "changeMadeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,

    CONSTRAINT "AntipixelStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AntipixelStatusHistory" ADD CONSTRAINT "AntipixelStatusHistory_changeMadeByUserId_fkey" FOREIGN KEY ("changeMadeByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
