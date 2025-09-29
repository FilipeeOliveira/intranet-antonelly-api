-- CreateEnum
CREATE TYPE "public"."MeetingDuration" AS ENUM ('MIN_15', 'MIN_30', 'MIN_45', 'H_1', 'H_1_30', 'H_2', 'H_3');

-- CreateEnum
CREATE TYPE "public"."MeetingType" AS ENUM ('INLOCAL', 'ONLINE');

-- CreateEnum
CREATE TYPE "public"."MeetingPriority" AS ENUM ('LOW', 'MID', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."MeetingReminder" AS ENUM ('NOT', 'MIN_5', 'MIN_15', 'MIN_30', 'H_1', 'D_1');

-- CreateTable
CREATE TABLE "public"."meeting_schedule" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" "public"."MeetingDuration" NOT NULL,
    "participants" TEXT NOT NULL,
    "type" "public"."MeetingType" NOT NULL,
    "priority" "public"."MeetingPriority" NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "reminder" "public"."MeetingReminder" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meeting_schedule_pkey" PRIMARY KEY ("id")
);
