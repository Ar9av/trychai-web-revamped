-- CreateTable
CREATE TABLE "data_table" (
    "id" SERIAL NOT NULL,
    "md5_hash" CHAR(32) NOT NULL,
    "payload" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    CONSTRAINT "data_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_table_v2" (
    "id" SERIAL NOT NULL,
    "md5_hash" CHAR(32),
    "payload" TEXT,
    "output" TEXT,
    "title" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_table_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_data" (
    "id" SERIAL NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "md5_hash" CHAR(32) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "private" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interested_users" (
    "user_email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "id" BIGSERIAL NOT NULL
);

-- CreateTable
CREATE TABLE "credit_history" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "hashtag" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "news_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_table_v2_md5_hash_key" ON "data_table_v2"("md5_hash");

-- CreateIndex
CREATE UNIQUE INDEX "user_data_md5_hash_key" ON "user_data"("md5_hash");

-- CreateIndex
CREATE INDEX "user_data_md5_hash_idx" ON "user_data"("md5_hash");

-- CreateIndex
CREATE INDEX "credit_history_user_id_idx" ON "credit_history"("user_id");

-- CreateIndex
CREATE INDEX "news_hashtag_idx" ON "news"("hashtag");

-- AddForeignKey
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_md5_hash_fkey" FOREIGN KEY ("md5_hash") REFERENCES "data_table_v2"("md5_hash") ON DELETE RESTRICT ON UPDATE CASCADE;
