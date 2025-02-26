import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOvertimes(req, res);
    case 'POST':
      return createOvertime(req, res);
    case 'PUT':
      return updateOvertime(req, res);
    case 'DELETE':
      return deleteOvertime(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// GET - Fetch all overtime records
async function getOvertimes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const overtimes = await prisma.overtime.findMany({
      include: { employee: true },
    });
    return res.status(200).json(overtimes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch overtime records' });
  }
}

// POST - Create a new overtime request
async function createOvertime(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { employeeId, date, startTime, endTime, reason } = req.body;
    const newOvertime = await prisma.overtime.create({
      data: {
        employeeId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reason,
      },
    });
    return res.status(201).json(newOvertime);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create overtime record' });
  }
}

// PUT - Update an overtime request (approve/reject)
async function updateOvertime(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const updatedOvertime = await prisma.overtime.update({
      where: { id },
      data: { status },
    });
    return res.status(200).json(updatedOvertime);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update overtime record' });
  }
}

// DELETE - Remove an overtime request
async function deleteOvertime(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    await prisma.overtime.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'Overtime record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete overtime record' });
  }
}
