import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
<<<<<<< HEAD
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

=======
    // Fetch latest requests (only 1 each) and include createdAt, status, and employeeId
>>>>>>> f28a17a56f5053bbe799520814d433455d372129
    const latestDTRP = await prisma.dailyTimeRecordProblem.findFirst({
      where: { employeeId: employeeId },
      orderBy: { createdAt: "desc" },
<<<<<<< HEAD
      select: { id: true, createdAt: true, status: true },
    });

    const latestOvertime = await prisma.overtime.findFirst({
      where: { employeeId: employeeId },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, status: true },
=======
      select: { id: true, createdAt: true, status: true, employeeId: true ,remarks: true ,type:true,date:true},
>>>>>>> f28a17a56f5053bbe799520814d433455d372129
    });

    const latestLeave = await prisma.leave.findFirst({
      where: { employeeId: employeeId },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, status: true, employeeId: true ,reason: true,leaveType:true,startDate:true,endDate:true}, // Include employeeId
    });

    // Fetch all pending requests
    const pendingDTRP = await prisma.dailyTimeRecordProblem.findMany({
<<<<<<< HEAD
      where: { status: "PENDING",employeeId: employeeId  },
      select: { id: true, createdAt: true, status: true },
    });

    const pendingOvertime = await prisma.overtime.findMany({
      where: { status: "PENDING",employeeId: employeeId  },
      select: { id: true, createdAt: true, status: true },
    });

    const pendingLeave = await prisma.leave.findMany({
      where: { status: "PENDING",employeeId: employeeId  },
      select: { id: true, createdAt: true, status: true },
=======
      orderBy: { createdAt: "desc" },
      where: { status: "PENDING" },
      select: { id: true, createdAt: true, status: true, employeeId: true,remarks: true,type:true ,date:true },
    });

    const pendingLeave = await prisma.leave.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "PENDING" },
      select: { id: true, createdAt: true, status: true, employeeId: true ,reason:true ,leaveType:true ,startDate:true,endDate:true}, // Include employeeId
>>>>>>> f28a17a56f5053bbe799520814d433455d372129
    });

    return NextResponse.json({
      latest: [
        latestDTRP ? { file_type: "DTRP", ...latestDTRP } : null,
        latestLeave ? { file_type: "Leave", ...latestLeave } : null,
      ].filter(Boolean), // Remove null values

      pending: [
        ...pendingDTRP.map((req) => ({ file_type: "DTRP", ...req })),
        ...pendingLeave.map((req) => ({ file_type: "Leave", ...req })),
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
