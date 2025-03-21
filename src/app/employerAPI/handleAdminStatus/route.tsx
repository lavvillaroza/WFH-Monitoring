import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addDays, isToday } from "date-fns";

const prisma = new PrismaClient();



export async function PUT(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const body = await req.json(); // ✅ Extract JSON body
    const { action } = body;

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    // Check if employee exists before updating
    const employee = await prisma.user.findUnique({
      where: { employeeId: employeeId },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Update employee's activity status to Active
    await prisma.user.update({
      where: { employeeId: employeeId },
      data: { status: action === "LOGIN" ? "ACTIVE" : "INACTIVE"  },
    });

    return NextResponse.json({ message: "Employee status updated to Active" }, { status: 200 });

  } catch (error) {
    console.error("Error updating employee status:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message, 
        stack: error.stack 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
