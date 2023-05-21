-- CreateEnum
CREATE TYPE "StudentRole" AS ENUM ('member', 'admin');

-- CreateEnum
CREATE TYPE "LectureType" AS ENUM ('resource', 'assignment', 'url', 'quiz', 'forum', 'page', 'unknown');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "date_of_birth" TEXT,
    "address" TEXT,
    "role" "StudentRole" NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docent" (
    "id" TEXT NOT NULL,
    "nidn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT,

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
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "course_number" TEXT NOT NULL,
    "docent_id" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "competence" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_nim_key" ON "Student"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "Docent_name_key" ON "Docent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_url_key" ON "Lecture"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_courseTitle_title_key" ON "Meeting"("courseTitle", "title");

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_docent_id_fkey" FOREIGN KEY ("docent_id") REFERENCES "Docent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
