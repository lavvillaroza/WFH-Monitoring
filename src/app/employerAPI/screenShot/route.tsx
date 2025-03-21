import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { employeeId, screenCapture } = body;

    // Validate required fields
    if (!employeeId || !screenCapture) {
      return NextResponse.json(
        { error: "Employee ID and screen capture are required" },
        { status: 400 }
      );
    }

    // Convert Base64 to Binary (Buffer)
    const base64Data = screenCapture.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Save to database
    const savedCapture = await prisma.screenShotModel.create({
      data: {
        employeeId,
        picture: imageBuffer,
        date: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Screen capture saved successfully", data: savedCapture },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Detailed error:", error);

    return NextResponse.json(
      { error: error.message || "Unknown internal server error" },
      { status: 500 }
    );
  }finally {
    await prisma.$disconnect();
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10; // Limit per page

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const screenshots = await prisma.screenShotModel.findMany({
      where: {
        employeeId: employeeId,
        date: {
          gte: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
          lte: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
        },
      },
      skip: (page - 1) * pageSize, // Pagination logic
      take: pageSize, // Limit to 10 per page
      orderBy: {
        date: "desc", // Sort by latest first
      },
    });

    const totalCount = await prisma.screenShotModel.count({
      where: {
        employeeId: employeeId,
      },
    });

    const formattedScreenshots = screenshots.map((screenshot) => ({
      id: screenshot.id,
      image: screenshot.picture
        ? `data:image/png;base64,${Buffer.from(screenshot.picture).toString("base64")}`
        : null,
      createdAt: screenshot.date,
    }));

    return NextResponse.json({ 
      screenshots: formattedScreenshots, 
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching screenshots:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


