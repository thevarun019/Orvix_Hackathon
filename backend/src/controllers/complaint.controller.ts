import { Request, Response } from 'express';
import * as complaintService from '../services/complaint.service';

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const citizenId = (req as any).user.id;
    const complaintData = req.body;
    const result = await complaintService.createComplaint(citizenId, complaintData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyComplaints = async (req: Request, res: Response) => {
  try {
    const citizenId = (req as any).user.id;
    const complaints = await complaintService.getComplaintsByCitizen(citizenId);
    res.status(200).json(complaints);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
