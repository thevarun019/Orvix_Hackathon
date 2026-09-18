import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStateKPIs = async (req: Request, res: Response) => {
  try {
    const total = await prisma.complaint.count();
    const resolved = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
    const escalated = await prisma.complaint.count({ where: { status: 'ESCALATED' } });
    const inProgress = await prisma.complaint.count({ where: { status: 'IN_PROGRESS' } });
    const submitted = await prisma.complaint.count({ where: { status: 'SUBMITTED' } });

    // Average resolution time (in hours) for resolved complaints
    const resolvedComplaints = await prisma.complaint.findMany({
      where: { status: 'RESOLVED' },
      select: { createdAt: true, updatedAt: true }
    });
    let avgResolutionHours = 0;
    if (resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((sum, c) => {
        const diffMs = c.updatedAt.getTime() - c.createdAt.getTime();
        return sum + diffMs / 3600000;
      }, 0);
      avgResolutionHours = Math.round(totalHours / resolvedComplaints.length);
    }

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      total,
      resolved,
      escalated,
      inProgress,
      submitted,
      resolutionRate,
      avgResolutionHours
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStateHeatmap = async (req: Request, res: Response) => {
  try {
    // Secure list: only expose minimal fields needed for heatmap, no PII
    const complaints = await prisma.complaint.findMany({
      where: {
        status: { notIn: ['RESOLVED'] }
      },
      select: {
        latitude: true,
        longitude: true,
        severity: true,
        status: true,
        damageType: true
      }
    });
    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDistrictPerformance = async (req: Request, res: Response) => {
  try {
    // Group by district (authority's district field)
    const authorities = await prisma.authority.findMany({
      select: {
        id: true,
        name: true,
        district: true,
        complaints: {
          select: {
            status: true,
            severity: true
          }
        }
      }
    });

    const districtData = authorities.map(auth => {
      const total = auth.complaints.length;
      const resolved = auth.complaints.filter(c => c.status === 'RESOLVED').length;
      const escalated = auth.complaints.filter(c => c.status === 'ESCALATED').length;
      const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
      const avgSeverity = total > 0
        ? parseFloat((auth.complaints.reduce((s, c) => s + (c.severity || 0), 0) / total).toFixed(2))
        : 0;

      return {
        name: auth.district || auth.name,
        total,
        resolved,
        escalated,
        resolutionRate,
        avgSeverity
      };
    });

    res.json(districtData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
