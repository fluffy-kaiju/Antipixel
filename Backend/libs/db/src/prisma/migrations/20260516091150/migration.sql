-- CreateTable
CREATE TABLE "EmailConfirmationCode" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "TTL_sec" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EmailConfirmationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetCode" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "TTL_sec" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PasswordResetCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmationCode_token_key" ON "EmailConfirmationCode"("token");

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmationCode_userId_key" ON "EmailConfirmationCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetCode_token_key" ON "PasswordResetCode"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetCode_userId_key" ON "PasswordResetCode"("userId");

-- AddForeignKey
ALTER TABLE "EmailConfirmationCode" ADD CONSTRAINT "EmailConfirmationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetCode" ADD CONSTRAINT "PasswordResetCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
