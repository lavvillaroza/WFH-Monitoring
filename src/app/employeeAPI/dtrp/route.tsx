import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handle GET request (Fetch DTRP by userID)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");

    if (!userID) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("Received userID:", userID); // Debugging

    // ✅ Check if user exists before fetching records
    const userExists = await prisma.user.findUnique({ where: { id: userID } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Ensure correct field names in Prisma query
    const dtrProblems = await prisma.dailyTimeRecordProblem.findMany({
      where: { userId: userID }   });
    

    if (!dtrProblems.length) {
      return NextResponse.json({ error: "No records found" }, { status: 200 });
    }

    return NextResponse.json(dtrProblems, { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}


/**
 * Handle POST request (Create DTRP)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, dtrId, issueType, description,type } = body;

    if (!userId || !dtrId || !issueType || !description || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newDTRP = await prisma.dailyTimeRecordProblem.create({
      data: { userId, dtrId, issueType, description,type },
    });

    return NextResponse.json(newDTRP, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
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

    const updatedDTRP = await prisma.dailyTimeRecordProblem.update({
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

    await prisma.dailyTimeRecordProblem.delete({ where: { id } });

    return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
