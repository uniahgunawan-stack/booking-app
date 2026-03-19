-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "snapExpiry" TIMESTAMP(3),
ADD COLUMN     "snapToken" TEXT;
