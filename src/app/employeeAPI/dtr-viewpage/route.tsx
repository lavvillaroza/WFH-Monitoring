import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { employeeId, timeIn, timeOut, remarks } = body;

        if (!employeeId) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        if (timeIn) {
            // Create a new record for "Time In"
            await prisma.dailyTimeRecord.create({
                data: {
                    employeeId,
                    date: new Date(),
                    timeIn: new Date(timeIn),
                    timeOut: null, 
                    remarks: remarks,
                },
            });
            await prisma.user.update({
                where: { employeeId: employeeId }, 
                data: {
                  status: "ACTIVE", 
                },
              });
        } else if (timeOut) {
            // Find the latest record with a null timeOut
            const lastRecord = await prisma.dailyTimeRecord.findFirst({
                where: { employeeId, timeOut: null },
                orderBy: { date: "desc" }, // Get the latest record
            });
            await prisma.user.update({
                where: { employeeId: employeeId }, 
                data: {
                  status: "INACTIVE", 
                },
              });

              
            if (!lastRecord) {
                return NextResponse.json({ error: "No active Time In record found" }, { status: 400 });
            }
        
            // Parse the timeOut and timeIn
            const timeIn = new Date(lastRecord.timeIn);  // Assume timeIn is a Date object
            const timeOutDate = new Date(timeOut);  // Convert string to Date object
        
            // Calculate duration in seconds
            const durationInSeconds = Math.floor((timeOutDate.getTime() - timeIn.getTime()) / 1000);
        
            // Update the found record with timeOut, duration, and remarks
            await prisma.dailyTimeRecord.update({
                where: { id: lastRecord.id },
                data: {
                    timeOut: timeOutDate,
                    duration: durationInSeconds,
                    remarks: remarks || "Clocked out",  // Use default remark if none is provided
                },
            });
            }
        else {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        return NextResponse.json({ message: "Daily Time Record updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DTR API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//fetch null time out to check if the last entry is time in
//fetch null time out to check if the last entry is time in
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get("employeeId");

        if (!employeeId) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        // Fetch all unique dates where the employee has clocked in
        const uniqueDates = await prisma.$queryRaw<
            { createdDate: Date }[]
        >`SELECT DISTINCT DATE(date) AS createdDate FROM DailyTimeRecord WHERE employeeId = ${employeeId} ORDER BY createdDate DESC`;

        let dtrData = [];

        for (const { createdDate } of uniqueDates) {
            // Convert createdDate to start and end of the day
            const startOfDay = new Date(createdDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(createdDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Get first time in for the unique date
            const firstTimeIn = await prisma.dailyTimeRecord.findFirst({
                where: { 
                    employeeId, 
                    date: {
                        gte: startOfDay,
                        lt: endOfDay
                    }
                },
                orderBy: { timeIn: "asc" },
                select: { timeIn: true }
            });

            // Get last time out for the unique date
            const lastTimeOut = await prisma.dailyTimeRecord.findFirst({
                where: { 
                    employeeId, 
                    date: {
                        gte: startOfDay,
                        lt: endOfDay
                    },
                    timeOut: { not: null },
                },
                orderBy: { timeOut: "desc" },
                select: { timeOut: true }
            });

            // Calculate total duration (excluding idle and sleeping time)
            const employeeDTR = await prisma.dailyTimeRecord.findMany({
                where: { 
                    employeeId, 
                    date: {
                        gte: startOfDay,
                        lt: endOfDay
                    },
                    timeOut: { not: null }
                },
                select: { duration: true },
            });

            const totalDuration = employeeDTR.reduce((sum, record) => sum + (record.duration ?? 0), 0);

            const calculateTimeSpent = (logs: any[]) => {
                return logs.reduce((total, log) => {
                    const startTime = new Date(log.start);
                    const endTime = log.end ? new Date(log.end) : new Date();
                    return total + (endTime.getTime() - startTime.getTime());
                }, 0);
            };

            // Fetch Sleeping and Idle logs
            const sleeping = await prisma.humanActivityLog.findMany({
                where: { 
                    employeeId, 
                    activity: "Sleeping", 
                    start: { 
                        gte: startOfDay, 
                        lt: endOfDay 
                    }
                }
            });

            const idle = await prisma.humanActivityLog.findMany({
                where: { 
                    employeeId, 
                    activity: "Idle", 
                    start: { 
                        gte: startOfDay, 
                        lt: endOfDay 
                    }
                }
            });

            const idleTime = calculateTimeSpent(idle) / 1000;
            const sleepingTime = calculateTimeSpent(sleeping) / 1000;

            let totalSeconds = totalDuration - (idleTime + sleepingTime);
            totalSeconds = totalSeconds > 0 ? totalSeconds : 0;

            // Convert total seconds to formatted time (HH hrs MM mins SS secs)
            const hours = Math.max(Math.floor(totalSeconds / 3600) - 1, 0);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            const formattedTime = `${hours} hrs ${minutes} mins ${seconds} secs`;

            dtrData.push({
                date: createdDate,
                firstTimeIn: firstTimeIn?.timeIn || null,
                lastTimeOut: lastTimeOut?.timeOut || null,
                hoursRendered: formattedTime
            });
        }

        return NextResponse.json({ dtrData }, { status: 200 });

    } catch (error) {
        console.error("Error fetching DTR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

