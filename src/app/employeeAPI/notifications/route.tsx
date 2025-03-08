import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch latest requests (only 1 each) and include createdAt & status
    const latestDTRP = await prisma.dailyTimeRecordProblem.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, status: true },
    });

    const latestLeave = await prisma.leave.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, status: true },
    });

    // Fetch all pending requests
    const pendingDTRP = await prisma.dailyTimeRecordProblem.findMany({
      where: { status: "PENDING" },
      select: { id: true, createdAt: true, status: true },
    });

    const pendingLeave = await prisma.leave.findMany({
      where: { status: "PENDING" },
      select: { id: true, createdAt: true, status: true },
    });

    return NextResponse.json({
      latest: [
        latestDTRP ? { type: "DTRP", ...latestDTRP } : null,
        latestLeave ? { type: "Leave", ...latestLeave } : null,
      ].filter(Boolean), // Remove null values

      pending: [
        ...pendingDTRP.map((req: any) => ({ type: "DTRP", ...req })),
        ...pendingLeave.map((req: any) => ({ type: "Leave", ...req })),
      ],
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error fetching notifications", details: error },
      { status: 500 }
    );
  }
}
