-- CreateTable
CREATE TABLE "session" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("pkId")
);

-- CreateIndex
CREATE INDEX "session_sessionId_idx" ON "session"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_per_session_id" ON "session"("sessionId", "id");
