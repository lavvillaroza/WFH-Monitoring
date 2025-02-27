import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { employeeId, action } = req.body;
            const timestamp = new Date();

            // Insert new log entry
            const logEntry = await prisma.timeLog.create({
                data: {
                    employeeId,
                    date: new Date().toISOString().split("T")[0], // Store only the date
                    action,
                    timestamp,
                },
            });

            return res.status(201).json(logEntry);
        } catch (error) {
            console.error("Error saving timekeeping data:", error);
            return res.status(500).json({ error: "Failed to log event" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
