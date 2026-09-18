import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// To demonstrate during the hackathon, we'll run this every minute.
// In production, this might be `0 * * * *` (every hour).
const schedule = '* * * * *';

export const startSlaMonitoring = () => {
  cron.schedule(schedule, async () => {
    console.log('[Cron Job] Checking for SLA breaches...');

    try {
      const now = new Date();
      
      // Find complaints that are not resolved/escalated, and whose deadline has passed
      const breachedComplaints = await prisma.complaint.findMany({
        where: {
          status: {
            notIn: ['RESOLVED', 'ESCALATED']
          },
          slaDeadline: {
            lt: now
          }
        }
      });

      if (breachedComplaints.length === 0) {
        return;
      }

      console.log(`[Cron Job] Found ${breachedComplaints.length} breached complaints. Escalating...`);

      for (const complaint of breachedComplaints) {
        // 1. Update the complaint status to ESCALATED
        await prisma.complaint.update({
          where: { id: complaint.id },
          data: { status: 'ESCALATED' }
        });

        // 2. Create history record
        await prisma.complaintStatusHistory.create({
          data: {
            complaintId: complaint.id,
            oldStatus: complaint.status,
            newStatus: 'ESCALATED',
            remarks: 'Automated escalation due to SLA breach'
          }
        });

        // 3. Create Escalation record
        await prisma.escalation.create({
          data: {
            complaintId: complaint.id,
            fromAuthorityId: complaint.authorityId,
            reason: 'SLA Deadline exceeded'
          }
        });
      }

      console.log(`[Cron Job] Successfully escalated ${breachedComplaints.length} complaints.`);
    } catch (error) {
      console.error('[Cron Job] Error during SLA monitoring:', error);
    }
  });
  
  console.log(`[Cron Job] SLA Monitoring initialized (Schedule: ${schedule})`);
};
