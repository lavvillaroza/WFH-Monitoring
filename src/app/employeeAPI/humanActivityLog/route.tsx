import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { timeStamp } from "console";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, activity } = await req.json();

    if (!userId || !activity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const logEntry = await prisma.humanActivityLog.create({
      data: { userId, activity },
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
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    writer.write(encoder.encode("event: open\ndata: Connection established\n\n"));

    async function sendUpdates() {
      const logs = await prisma.humanActivityLog.findMany({
        where: { userId},
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
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}