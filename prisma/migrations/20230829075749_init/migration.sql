-- CreateTable
CREATE TABLE "Chat" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "archived" BOOLEAN,
    "contactPrimaryIdentityKey" BYTEA,
    "conversationTimestamp" BIGINT,
    "createdAt" BIGINT,
    "createdBy" VARCHAR(128),
    "description" VARCHAR(255),
    "disappearingMode" JSONB,
    "displayName" VARCHAR(128),
    "endOfHistoryTransfer" BOOLEAN,
    "endOfHistoryTransferType" INTEGER,
    "ephemeralExpiration" INTEGER,
    "ephemeralSettingTimestamp" BIGINT,
    "id" VARCHAR(128) NOT NULL,
    "isDefaultSubgroup" BOOLEAN,
    "isParentGroup" BOOLEAN,
    "lastMsgTimestamp" BIGINT,
    "lidJid" VARCHAR(128),
    "markedAsUnread" BOOLEAN,
    "mediaVisibility" INTEGER,
    "messages" JSONB,
    "muteEndTime" BIGINT,
    "name" VARCHAR(128),
    "newJid" VARCHAR(128),
    "notSpam" BOOLEAN,
    "oldJid" VARCHAR(128),
    "pHash" VARCHAR(128),
    "parentGroupId" VARCHAR(128),
    "participant" JSONB,
    "pinned" INTEGER,
    "pnJid" VARCHAR(128),
    "pnhDuplicateLidThread" BOOLEAN,
    "readOnly" BOOLEAN,
    "shareOwnPn" BOOLEAN,
    "support" BOOLEAN,
    "suspended" BOOLEAN,
    "tcToken" BYTEA,
    "tcTokenSenderTimestamp" BIGINT,
    "tcTokenTimestamp" BIGINT,
    "terminated" BOOLEAN,
    "unreadCount" INTEGER,
    "unreadMentionCount" INTEGER,
    "wallpaper" JSONB,
    "lastMessageRecvTimestamp" INTEGER,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Contact" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(128) NOT NULL,
    "name" VARCHAR(128),
    "notify" VARCHAR(128),
    "verifiedName" VARCHAR(128),
    "imgUrl" VARCHAR(255),
    "status" VARCHAR(128),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "GroupMetadata" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(128) NOT NULL,
    "owner" VARCHAR(128),
    "subject" VARCHAR(128) NOT NULL,
    "subjectOwner" VARCHAR(128),
    "subjectTime" INTEGER,
    "creation" INTEGER,
    "desc" VARCHAR(255),
    "descOwner" VARCHAR(128),
    "descId" VARCHAR(128),
    "restrict" BOOLEAN,
    "announce" BOOLEAN,
    "size" INTEGER,
    "participants" JSONB NOT NULL,
    "ephemeralDuration" INTEGER,
    "inviteCode" VARCHAR(255),

    CONSTRAINT "GroupMetadata_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Message" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "remoteJid" VARCHAR(128) NOT NULL,
    "id" VARCHAR(128) NOT NULL,
    "agentId" VARCHAR(128),
    "bizPrivacyStatus" INTEGER,
    "broadcast" BOOLEAN,
    "clearMedia" BOOLEAN,
    "duration" INTEGER,
    "ephemeralDuration" INTEGER,
    "ephemeralOffToOn" BOOLEAN,
    "ephemeralOutOfSync" BOOLEAN,
    "ephemeralStartTimestamp" BIGINT,
    "finalLiveLocation" JSONB,
    "futureproofData" BYTEA,
    "ignore" BOOLEAN,
    "keepInChat" JSONB,
    "key" JSONB NOT NULL,
    "labels" JSONB,
    "mediaCiphertextSha256" BYTEA,
    "mediaData" JSONB,
    "message" JSONB,
    "messageC2STimestamp" BIGINT,
    "messageSecret" BYTEA,
    "messageStubParameters" JSONB,
    "messageStubType" INTEGER,
    "messageTimestamp" BIGINT,
    "multicast" BOOLEAN,
    "originalSelfAuthorUserJidString" VARCHAR(128),
    "participant" VARCHAR(128),
    "paymentInfo" JSONB,
    "photoChange" JSONB,
    "pollAdditionalMetadata" JSONB,
    "pollUpdates" JSONB,
    "pushName" VARCHAR(128),
    "quotedPaymentInfo" JSONB,
    "quotedStickerData" JSONB,
    "reactions" JSONB,
    "revokeMessageTimestamp" BIGINT,
    "starred" BOOLEAN,
    "status" INTEGER,
    "statusAlreadyViewed" BOOLEAN,
    "statusPsa" JSONB,
    "urlNumber" BOOLEAN,
    "urlText" BOOLEAN,
    "userReceipt" JSONB,
    "verifiedBizName" VARCHAR(128),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Session" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("pkId")
);

-- CreateIndex
CREATE INDEX "Chat_sessionId_idx" ON "Chat"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_chat_per_session_id" ON "Chat"("sessionId", "id");

-- CreateIndex
CREATE INDEX "Contact_sessionId_idx" ON "Contact"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_contact_per_session_id" ON "Contact"("sessionId", "id");

-- CreateIndex
CREATE INDEX "GroupMetadata_sessionId_idx" ON "GroupMetadata"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_group_per_session_id" ON "GroupMetadata"("sessionId", "id");

-- CreateIndex
CREATE INDEX "Message_sessionId_idx" ON "Message"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_message_key_per_session_id" ON "Message"("sessionId", "remoteJid", "id");

-- CreateIndex
CREATE INDEX "Session_sessionId_idx" ON "Session"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_per_session_id" ON "Session"("sessionId", "id");
