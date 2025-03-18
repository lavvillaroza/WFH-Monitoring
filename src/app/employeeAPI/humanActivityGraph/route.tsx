import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch logs for a specific employee
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    // Get today's date, ignoring the time part
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Fetch the logs for the employee with all necessary details
    const logs = await prisma.humanActivityLog.findMany({
      where: {
        employeeId,
        activity: { not: "Yawning" },
        start: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { start: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error);
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
  }
}
