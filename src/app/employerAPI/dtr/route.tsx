import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, timeIn, timeOut, remarks } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (timeIn) {
            // Create a new record for "Time In"
            await prisma.dailyTimeRecord.create({
                data: {
                    userId,
                    date: new Date(),
                    timeIn: new Date(timeIn),
                    timeOut: null, 
                    remarks: remarks,
                },
            });
        } else if (timeOut) {
            // Find the latest record with a null timeOut
            const lastRecord = await prisma.dailyTimeRecord.findFirst({
                where: { userId, timeOut: null },
                orderBy: { date: "desc" }, // Get the latest record
            });

            if (!lastRecord) {
                return NextResponse.json({ error: "No active Time In record found" }, { status: 400 });
            }

            // Update the found record with timeOut
            await prisma.dailyTimeRecord.update({
                where: { id: lastRecord.id },
                data: {
                    timeOut: new Date(timeOut), // Convert string to Date object
                    remarks: remarks || "Clocked out",
                },
            });
        } else {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        return NextResponse.json({ message: "Daily Time Record updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DTR API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//fetch null time out to check if the last entry is time in

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch the last DTR entry for the user
        const lastRecord = await prisma.dailyTimeRecord.findFirst({
            where: { userId },
            orderBy: { date: "desc" },
        });

        return NextResponse.json(lastRecord, { status: 200 });
    } catch (error) {
        console.error("Error fetching last DTR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
