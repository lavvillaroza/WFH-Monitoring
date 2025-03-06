import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { timeStamp } from "console";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { activity,employeeId } = await req.json();

    if (!employeeId || !activity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const logEntry = await prisma.humanActivityLog.create({
      data: {  activity,employeeId },
    });

    return NextResponse.json(logEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


//fetch
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

    writer.write(encoder.encode("event: open\ndata: Connection established\n\n"));

    async function sendUpdates() {
      const logs = await prisma.humanActivityLog.findMany({
        where: { employeeId},
        orderBy: { timestamp: "desc" },
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