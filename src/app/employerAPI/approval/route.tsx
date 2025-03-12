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
  
    
    const updatedRecord = await (async () => {
      if (file_type === 'DTRP') {
        const record = await prisma.dailyTimeRecordProblem.update({
          where: { id },
          data: {
            status: approval === 'APPROVED' ? DTRProblemStatus.RESOLVED : DTRProblemStatus.REJECTED,
          },
        });
    
        await updateDTRP(); // ✅ Call function after updating DTRP
        return record;
      } else if (file_type === 'Leave') {
        return await prisma.leave.update({
          where: { id },
          data: {
            status: approval === 'APPROVED' ? RequestStatus.APPROVED : RequestStatus.REJECTED,
          },
        });
      } else if (file_type === 'Overtime') {
        return await prisma.overtime.update({
          where: { id },
          data: {
            status: approval === 'APPROVED' ? RequestStatus.APPROVED : RequestStatus.REJECTED,
          },
        });
      } else {
        return null;
      }
    })();
    
    // ✅ Define updateDTRP function correctly
    async function updateDTRP() {
      const date = new Date(dateTime);
      console.log("Converted date:", date.toISOString());
    
      const checkDTR = await prisma.dailyTimeRecord.findFirst({
        where: {
          employeeId: employeeId,
          date: {
            gte: startOfDay(date),
            lte: endOfDay(date),
          }
        }
      });
    
      if (checkDTR) {
        await prisma.dailyTimeRecord.update({
          where: { id: checkDTR.id },
          data: {
            ...(type === 'time-in' ? { timeIn: new Date(dateTime) } : { timeOut: new Date(dateTime) }),
          },
        });
      } else {
        await prisma.dailyTimeRecord.create({
          data: {
            employeeId,
            date: new Date(dateTime),
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
