import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Register a new Employee
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate userId before proceeding
    if (!body.email) {
      return NextResponse.json({ error: "Missing Email" }, { status: 400 });
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: body.email },
    });

    // Check if Employee already exists by email
    const existingEmployee = await prisma.employeeDetails.findFirst({
      where: { email: body.email },
    });

    const existingEmployeeId = await prisma.employeeDetails.findFirst({
      where: { employeeId: body.employeeId },
    });

    if (existingEmployeeId) {
      return NextResponse.json({ error: "Employee with this Employee Id already exists" }, { status: 400 });
    }

    if (existingEmployee) {
      return NextResponse.json({ error: "Employee with this email already exists" }, { status: 400 });
    }

    // Generate the new employee ID if not provided
    const generatedEmployeeId = await generateEmployeeId();

    // Create new EmployeeDetails entry
    const employee = await prisma.employeeDetails.create({
      data: {
        employeeId: generatedEmployeeId,
        name: body.name,
        email: body.email,
        position: body.position,
        department: body.department,
        contactNumber: body.contactNumber || null,
        address: body.address || null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("❌ Error registering employee:", error);
    return NextResponse.json(
      { error: `Error registering employee: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// Function to generate the next employee ID
const generateEmployeeId = async () => {
  const lastEmployee = await prisma.employeeDetails.findFirst({
    orderBy: { employeeId: 'desc' },
  });

  let newIdNumber = 1;

  if (lastEmployee) {
    const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""), 10);
    newIdNumber = lastIdNumber + 1; // Increment the number
  }

  return `EMP${newIdNumber}`;
};

// GET method to fetch the latest employee ID
export async function GET() {
  try {
    const generatedEmployeeId = await generateEmployeeId();
    return NextResponse.json({ employeeId: generatedEmployeeId }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching latest employee ID:", error);
    return NextResponse.json({ error: "Failed to fetch the latest employee ID" }, { status: 500 });
  }
}
