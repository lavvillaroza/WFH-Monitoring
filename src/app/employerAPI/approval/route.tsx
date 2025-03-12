import { NextRequest, NextResponse } from "next/server";
import { DTRProblemStatus, PrismaClient, RequestStatus } from "@prisma/client";
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json(); // ✅ Extract JSON body
    const { id,employeeId ,dateTime ,type,file_type ,approval} = body;

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    // 🔍 Check if record exists
  
    
    const updatedRecord = 
    file_type === 'DTRP' 
      ? await prisma.dailyTimeRecordProblem.update({
      where: { id },
      data: {
        status: approval === 'APPROVED' ? DTRProblemStatus.RESOLVED : DTRProblemStatus.REJECTED, // ✅ Use enum
      },
    }) 
    
      : file_type === 'Leave' 
      ? await prisma.leave.update({
        where: { id },
        data: {
          status: approval === 'APPROVED' ? RequestStatus.APPROVED :RequestStatus.REJECTED,
        },
      })
      : file_type === 'Overtime' 
      ? await prisma.overtime.update({
        where: { id },
        data: {
          status: approval === 'APPROVED' ? RequestStatus.APPROVED :RequestStatus.REJECTED,
        },
      })
      :null


      const updateDTRP = async ()  =>{
        const date = new Date(dateTime); // Convert to Date object in UTC
        console.log("Converted date:", date.toISOString()); // Debugging
    
        const checkDTR = await prisma.dailyTimeRecord.findFirst({
          where: {
            employeeId: employeeId,
            date: {
              gte: startOfDay(date), // 2025-03-12T00:00:00.000Z
              lte: endOfDay(date),   // 2025-03-12T23:59:59.999Z
            }
          }
        });
        
        if (checkDTR) {
          // ✅ Correcting the update statement
          const uploadDTR = await prisma.dailyTimeRecord.update({
            where: { id: checkDTR.id }, // ✅ Correctly referencing the ID
            data: {
              ...(type === 'time-in' ? { timeIn: new Date(dateTime) } : { timeOut: new Date(dateTime) }) // ✅ Convert to Date
            }
          });
        } else {
          await prisma.dailyTimeRecord.create({
            data: {
              employeeId,
              date: new Date(dateTime), // ✅ Ensure this is also a Date object
              timeIn: type === 'time-in' ? new Date(dateTime) : null,
              timeOut: type === 'time-out' ? new Date(dateTime) : null,
              remarks: null,
            },
          });
        }
      }
     
    

    return NextResponse.json(
      { message: "Record request updated successfully", record: updatedRecord },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating Record request:", error.message, error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
