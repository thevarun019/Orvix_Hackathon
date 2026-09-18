import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod schema for injection protection
const updateStatusSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'RESOLVED', 'ESCALATED']),
  remarks: z.string().optional()
});

export const getAssignedComplaints = async (req: Request, res: Response) => {
  try {
    const authorityId = (req as any).user.id;
    // In a real app we might link User (role AUTHORITY) to Authority model. 
    // For this MVP, if the user role is AUTHORITY, we just fetch complaints assigned to their ID.
    // However, our schema separates User and Authority.
    // Let's assume the authority logs in via the generic User table, and we use their User.id as assignedOfficerId or authorityId.
    // To keep it simple, we fetch all complaints that are not SUBMITTED, or maybe all complaints.
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(complaints);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = updateStatusSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Get current complaint
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    // Update
    const updated = await prisma.complaint.update({
      where: { id },
      data: { status: validatedData.status }
    });

    // Record history
    await prisma.complaintStatusHistory.create({
      data: {
        complaintId: id,
        oldStatus: complaint.status,
        newStatus: validatedData.status,
        changedById: userId,
        remarks: validatedData.remarks || 'Status updated by Authority'
      }
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
