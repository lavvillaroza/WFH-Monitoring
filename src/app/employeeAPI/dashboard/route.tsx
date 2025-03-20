import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get("employeeId");

  if (!employeeId) {
    return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
  }


  const currentTime = new Date();

  try {
    const employeeStatus = await prisma.employeeDetails.findUnique({
      where: { employeeId },
      select: { activityStatus: true },
    });

    if (!employeeStatus) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    const statusEMP = await prisma.user.findUnique({
      where: { employeeId },
      select: { status: true },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dailyTimeRecord = await prisma.dailyTimeRecord.findFirst({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lt: endOfDay
      }
      },
      orderBy: { timeIn: "asc" },
      select: { timeIn: true, timeOut: true },
    });

    if (!dailyTimeRecord?.timeIn) {
      return NextResponse.json({ }, { status: 200 });
    }

    //const timein = new Date(dailyTimeRecord.timeIn);

    const calculateTimeSpent = (logs: any[]) => {
      return logs.reduce((total, log) => {
        const startTime = new Date(log.start);
        const endTime = log.end ? new Date(log.end) : new Date();
        return total + (endTime.getTime() - startTime.getTime());
      }, 0);
    };

    const sleeping = await prisma.humanActivityLog.findMany({
      where: { employeeId, activity: "Sleeping", start: {  gte: startOfDay,
        lt: endOfDay} },
    });

    const idle = await prisma.humanActivityLog.findMany({
      where: { employeeId, activity: "Idle", start: {  gte: startOfDay,
        lt: endOfDay } },
    });

    const lastActivityLog = await prisma.humanActivityLog.findFirst({
      where: { employeeId, start: {  gte: startOfDay,
        lt: endOfDay }, end: null },
      orderBy: { start: "desc" },
      select: { activity: true },
    });

    const dtr = await prisma.dailyTimeRecord.findFirst({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lt: endOfDay
        },
        timeOut: null,
      },
      orderBy: { timeIn: "desc" },
      select: { timeIn: true, timeOut: true },
    })

    const employeeDTR = await prisma.dailyTimeRecord.findMany({
      where: { employeeId, date: {  gte: startOfDay,
        lt: endOfDay }, timeOut: { not: null } },
      select: { duration: true },
    });

    const totalDuration = employeeDTR.reduce((sum, record) => sum + (record.duration ?? 0), 0);

    let wakefulnessStatus = "Awake";
    if (lastActivityLog?.activity === "Sleeping" || lastActivityLog?.activity === "Idle") {
      wakefulnessStatus = lastActivityLog.activity;
    }

    const idleTime = calculateTimeSpent(idle) / 1000;
    const sleepingTime = calculateTimeSpent(sleeping) / 1000;

    let totalTime = 0;
    let hoursRendered = 0;

    if (dtr && dtr.timeOut === null) {
      totalTime = Math.floor(currentTime.getTime() - dtr.timeIn.getTime()) / 1000 + totalDuration;
      hoursRendered = totalTime - (idleTime + sleepingTime);
    } else {
      totalTime = totalDuration;
      hoursRendered = totalTime - (idleTime + sleepingTime);
    }
    
    let productivityPercentage = 100;
    const nonProductiveTime = idleTime + sleepingTime;
    if (nonProductiveTime > 0) {
      productivityPercentage = ((totalTime - nonProductiveTime) / totalTime) * 100;
    }

    return NextResponse.json({
      employeeStatus: statusEMP?.status,
      wakefulnessStatus,
      productivityPercentage: Math.round(productivityPercentage),
      idleTime,
      sleepingTime,
      totalTime,
      hoursRendered,
    });

  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
  }
}