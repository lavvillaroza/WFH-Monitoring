import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addDays, isToday } from "date-fns";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaves = await prisma.leave.findMany({
      where: { status: "APPROVED" },
      select: { startDate: true, employeeId: true,endDate:true },
    });

    const checkLatestActivity = await prisma.humanActivityLog.findMany({
        where: {end : null},
        select: {activity:true,employeeId:true}
    })

    const checkNull = await prisma.employeeDetails.findMany({
      where:{activityStatus : null}
    })

    for (const leave of leaves) {
      if (isToday(new Date(leave.startDate))) {
        await prisma.employeeDetails.updateMany({
            where: { 
                employeeId: leave.employeeId, 
                activityStatus: { NOT: "On Leave" } 
            },
            data: {
                activityStatus: "On Leave",
                updatedAt: new Date(),
            },
        });
      }
    }

    for (const leave of leaves) {
        const nextDay = addDays(new Date(leave.endDate), 1);
        if (isToday(nextDay)) {
          await prisma.employeeDetails.update({
            where: { 
                employeeId: leave.employeeId, 
                activityStatus:  "On Leave" 
            },
            data: {
              activityStatus: "Active",
              updatedAt: new Date(),
            },
          });
        }
      }


      for (const activityLog of checkLatestActivity){
        await prisma.employeeDetails.update({
          where:{
            employeeId:activityLog.employeeId
          },
          data:{
            activityStatus:activityLog.activity
          }
        })
      }

      for (const employee of checkNull){
        await prisma.employeeDetails.updateMany({
          where:{
            employeeId:employee.employeeId
          },
          data:{
            activityStatus:"Active"
          }
        })
      }

   


    return NextResponse.json({ message: "Leave status updated successfully" ,checkLatestActivity,checkNull}, { status: 200 });
  } catch (error) {
    console.error("Error updating leave status:", error);

    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message, 
        stack: error.stack // Detailed stack trace for debugging 
      }, 
      { status: 500 }
    );
  }
}



export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    await prisma.employeeDetails.update({
      where:{employeeId:body.employeeId},
      data:{
        activityStatus:"Active"
      }
    })
  }catch{

  }
}
