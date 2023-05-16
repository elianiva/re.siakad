-- CreateEnum
CREATE TYPE "LectureType" AS ENUM ('resource', 'assignment', 'url', 'quiz', 'forum', 'page', 'unknown');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docent" (
    "id" TEXT NOT NULL,
    "nidn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Docent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "LectureType" NOT NULL DEFAULT 'unknown',
    "deadline" TIMESTAMP(3) NOT NULL,
    "meeting_id" TEXT NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "docent_id" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_docent_id_fkey" FOREIGN KEY ("docent_id") REFERENCES "Docent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
