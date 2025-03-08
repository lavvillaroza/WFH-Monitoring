import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Correct Prisma import

const prisma = new PrismaClient(); // Initialize Prisma Client

// GET: Fetch all employees
export async function GET() {
  try {
    const employees = await prisma.humanActivityLog.findMany();
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error); // Logs full error details
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" }, 
      { status: 500 }
    );
  }
}
