import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("🟢 Database connected successfully");
  } catch (error) {
    console.log("🔴 Database connection failed");
    console.error(error);
    process.exit(1);
  }
};