import prisma from '../utils/prisma';

export const createComplaint = async (citizenId: string, data: any) => {
  // Generate ticket number
  const ticketNumber = `RW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Find responsible authority (Basic geographic lookup mock for MVP)
  const authority = await prisma.authority.findFirst();
  
  if (!authority) {
    console.warn("No authority found in database. Please seed the database with authorities.");
  }

  // Calculate SLA (Mock logic for MVP)
  const slaHours = 72; // Default 3 days
  const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

  const complaint = await prisma.complaint.create({
    data: {
      ticketNumber,
      citizenId,
      title: data.title,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      damageType: data.damageType,
      severity: 5.0, // Default MVP severity
      status: 'SUBMITTED',
      authorityId: authority?.id || null,
      slaHours,
      slaDeadline
    }
  });

  // Create status history
  await prisma.complaintStatusHistory.create({
    data: {
      complaintId: complaint.id,
      newStatus: 'SUBMITTED',
      remarks: 'Complaint submitted by citizen'
    }
  });

  return complaint;
};

export const getComplaintsByCitizen = async (citizenId: string) => {
  return await prisma.complaint.findMany({
    where: { citizenId },
    orderBy: { createdAt: 'desc' },
    include: { authority: true }
  });
};
