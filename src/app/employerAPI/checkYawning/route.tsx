import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

   

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999); // End of the day

    // Fetch activity logs for today where activity is "Yawning"
    const employees = await prisma.humanActivityLog.findMany({
      where: { 
        activity: "Yawning", // Filter only "Yawning" activity
        start: {
          gte: today,  // Greater than or equal to today's start
          lte: tomorrow // Less than or equal to today's end
        }
      },
      select: {
        id: true,
        employeeId: true,
        activity: true,
        duration: true,
        start: true
      }
    });

    return NextResponse.json({ message: "Attendance data retrieved", employees }, { status: 200 });

  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure database connection is closed
  }
}
