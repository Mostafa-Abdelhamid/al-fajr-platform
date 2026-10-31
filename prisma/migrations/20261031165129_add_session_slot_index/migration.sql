-- CreateTable
CREATE TABLE "QiraatOption" (
    "id" TEXT NOT NULL,
    "reciter" TEXT NOT NULL,
    "riwaya" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QiraatOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QiraatOption_riwaya_key" ON "QiraatOption"("riwaya");

-- CreateIndex
CREATE INDEX "QiraatOption_reciter_idx" ON "QiraatOption"("reciter");

-- CreateIndex
CREATE INDEX "Session_teacherId_startAt_idx" ON "Session"("teacherId", "startAt");

-- Prevent double-booking the same teacher slot at the DB level. Scoped to
-- SCHEDULED only (a partial index, not representable in schema.prisma) so it
-- can't conflict with historical COMPLETED sessions that happen to share a
-- timestamp with a later SCHEDULED one.
CREATE UNIQUE INDEX "Session_teacherId_startAt_scheduled_key" ON "Session"("teacherId", "startAt") WHERE "status" = 'SCHEDULED';
