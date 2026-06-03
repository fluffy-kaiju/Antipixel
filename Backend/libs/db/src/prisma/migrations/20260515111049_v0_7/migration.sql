-- CreateTable
CREATE TABLE "UserEmailConfirmation" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "TTL" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserEmailConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEmailConfirmation_token_key" ON "UserEmailConfirmation"("token");

-- AddForeignKey
ALTER TABLE "UserEmailConfirmation" ADD CONSTRAINT "UserEmailConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
