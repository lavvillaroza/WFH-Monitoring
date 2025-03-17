import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Correct Prisma import

const prisma = new PrismaClient(); // Initialize Prisma Client

// GET: Fetch all employees
export async function GET() {
  try {
    const configSettings = await prisma.configSettings.findMany();
    return NextResponse.json(configSettings, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error); // Logs full error details
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" }, 
      { status: 500 }
    );
  }
}
// POST: Add a new employee
// export async function POST(req: Request) {
//   try {
//     const body = await req.json(); // Await the JSON body
//     const newEmployee = await prisma.configSettings.create({
//       data: body,
//     });
//     return NextResponse.json(newEmployee, { status: 201 });
//   } catch (error) {
//     console.error("Error adding employee:", error);
//     return NextResponse.json({ error: "Error adding employee" }, { status: 500 });
//   }
// }

// PUT: Update an existing employee
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { idleThreshold, sleepingThreshold, screenshotThreshold } = body;

    if (
      idleThreshold === undefined ||
      sleepingThreshold === undefined ||
      screenshotThreshold === undefined
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updateIdle = prisma.configSettings.updateMany({
      where: { name: "idleThreshold" },
      data: { threshold: idleThreshold },
    });

    const updateSleeping = prisma.configSettings.updateMany({
      where: { name: "sleepingThreshold" },
      data: { threshold: sleepingThreshold },
    });

    const updateScreenshot = prisma.configSettings.updateMany({
      where: { name: "screenShotThreshold" },
      data: { threshold: screenshotThreshold },
    });
    // Run all updates in parallel
    await prisma.$transaction([updateIdle, updateSleeping, updateScreenshot]);

    return NextResponse.json({ message: "Settings updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating Config request:", error.message, error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
}   finally {
  await prisma.$disconnect(); // Ensure database connection is closed
}
}
