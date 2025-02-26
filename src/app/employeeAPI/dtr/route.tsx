import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getDailyTimeRecords(req, res);
    case 'POST':
      return createDailyTimeRecord(req, res);
    case 'PUT':
      return updateDailyTimeRecord(req, res);
    case 'DELETE':
      return deleteDailyTimeRecord(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// GET - Fetch all Daily Time Records
async function getDailyTimeRecords(req: NextApiRequest, res: NextApiResponse) {
  try {
    const records = await prisma.dailyTimeRecord.findMany({
      include: { employee: true }, // Fetch associated employee data
    });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch records' });
  }
}

// POST - Create a new Daily Time Record
async function createDailyTimeRecord(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { employeeId, date, checkIn, breakOut, breakIn, checkOut } = req.body;
    const record = await prisma.dailyTimeRecord.create({
      data: { employeeId, date, checkIn, breakOut, breakIn, checkOut },
    });
    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create record' });
  }
}

// PUT - Update an existing Daily Time Record
async function updateDailyTimeRecord(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, checkIn, breakOut, breakIn, checkOut } = req.body;
    const record = await prisma.dailyTimeRecord.update({
      where: { id },
      data: { checkIn, breakOut, breakIn, checkOut },
    });
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update record' });
  }
}

// DELETE - Remove a Daily Time Record
async function deleteDailyTimeRecord(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    await prisma.dailyTimeRecord.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete record' });
  }
}
