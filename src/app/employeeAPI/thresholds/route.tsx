import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    
    const thresholds = await prisma.configSettings.findMany();
  
    // Return the updated log entry as a response
    return NextResponse.json( thresholds, { status: 200 });
  } catch (error) {
    console.error("Error fetching thresholds:", error);
    return NextResponse.json(
      { error: "Error fetching thresholds", details: error },
      { status: 500 }
    );
  }
}
