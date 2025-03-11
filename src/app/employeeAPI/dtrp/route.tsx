import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handle GET request (Fetch DTRP by userID)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "employeeId is required" }, { status: 400 });
    }

    console.log("Received userID:", employeeId); // Debugging
    employeeId
    // ✅ Check if user exists before fetching records
    const userExists = await prisma.user.findUnique({ where: { employeeId: employeeId } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Ensure correct field names in Prisma query
    const dtrProblems = await prisma.dailytimerecordproblem.findMany({
      where: { employeeId: employeeId }   });
    

    if (!dtrProblems.length) {
      return NextResponse.json({ error: "No records found" }, { status: 200 });
    }

    return NextResponse.json(dtrProblems, { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
  }
}


/**
 * Handle POST request (Create DTRP)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, dateTime, type, remarks } = body;

    // Validate required fields
    if (!employeeId || !dateTime || !type || !remarks) {
      return NextResponse.json({ error: "⚠️ All fields are required." }, { status: 400 });
    }

    // Convert dateTime to proper Date object
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "❌ Invalid date format." }, { status: 400 });
    }

    // Create DTR Problem record in the database
    const newDTRP = await prisma.dailytimerecordproblem.create({
      data: {
        employeeId,
        date: parsedDate,
        type,
        remarks,
        status: "PENDING", // Default status
      },
    });

    return NextResponse.json({ success: "✅ Submitted successfully!", newDTRP }, { status: 201 });

  } catch (error) {
    console.error("🚨 Error creating DTRP record:", error);
    return NextResponse.json({ error: "❌ Failed to create record." }, { status: 500 });
  }
}

/**
 * Handle PUT request (Update DTRP)
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const updatedDTRP = await prisma.dailytimerecordproblem.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedDTRP, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

/**
 * Handle DELETE request (Delete DTRP)
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.dailytimerecordproblem.delete({ where: { id } });

    return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating Record request:", error.message, error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id ,type, dateTime, remarks} = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    // 🔍 Check if leave exists
    const existingRecord = await prisma.dailytimerecordproblem.findUnique({ where: { id } });

    if (!existingRecord) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    // 🔄 Update the leave request
    const updatedRecord = await prisma.dailytimerecordproblem.update({
      where: { id },
      data: {
        type: type || existingRecord.type,
        date: dateTime ? new Date(dateTime) : existingRecord.date,
        remarks: remarks || existingRecord.remarks,
       
      },
    });

    return NextResponse.json({ message: "Record request updated successfully", record: updatedRecord }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating Record request:", error.message, error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

