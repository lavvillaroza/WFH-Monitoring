import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { timeStamp } from "console";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Extract data from the request body
    const { activity, employeeId, start, end, remarks } = await req.json();

    // Validate required fields
    if (!employeeId || !activity || !start ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a log entry in the database
    const logEntry = await prisma.humanActivityLog.create({
      data: {
        activity,
        employeeId,
        start,
        end,
        remarks,  // Adding remarks to the log entry
      },
    });

    // Return the created log entry as a response
    return NextResponse.json(logEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Fetch logs for a specific employee
export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get today's date, ignoring the time part
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set time to midnight (start of today)

    // End of today (midnight tomorrow)
    const tomorrow = new Date(today);
    tomorrow.setHours(24, 0, 0, 0);  // Set to midnight of the next day

    writer.write(encoder.encode("event: open\ndata: Connection established\n\n"));

    async function sendUpdates() {
      // Fetch the logs for the employee only for today's date
      const logs = await prisma.humanActivityLog.findMany({
        where: {
          employeeId,
          start: {
            gte: today, // Start time greater than or equal to midnight today
            lt: tomorrow, // Less than midnight tomorrow (end of today)
          },
        },
        orderBy: { start: "desc" },
      });

      writer.write(encoder.encode(`data: ${JSON.stringify(logs)}\n\n`));
    }

    // Send updates every 3 seconds (adjust as needed)
    const interval = setInterval(sendUpdates, 3000);

    req.signal.addEventListener("abort", () => {
      clearInterval(interval);
      writer.close();
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error);
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
  }
}