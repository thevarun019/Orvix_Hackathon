import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Authority
  const pwdAuthority = await prisma.authority.create({
    data: {
      name: 'PWD Jaipur',
      type: 'LOCAL',
      district: 'Jaipur',
      state: 'Rajasthan',
      latitude: 26.9124,
      longitude: 75.7873
    }
  });

  // 2. Create Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const authUser = await prisma.user.upsert({
    where: { email: 'authority@demo.com' },
    update: {},
    create: {
      name: 'Demo Authority',
      email: 'authority@demo.com',
      passwordHash,
      role: 'AUTHORITY'
    }
  });
  
  const stateUser = await prisma.user.upsert({
    where: { email: 'state@demo.com' },
    update: {},
    create: {
      name: 'Demo State Admin',
      email: 'state@demo.com',
      passwordHash,
      role: 'STATE'
    }
  });

  const citizenUser = await prisma.user.upsert({
    where: { email: 'citizen@demo.com' },
    update: {},
    create: {
      name: 'Demo Citizen',
      email: 'citizen@demo.com',
      passwordHash,
      role: 'CITIZEN'
    }
  });

  // 3. Create mock complaints in different statuses around Jaipur
  const baseLat = 26.9124;
  const baseLng = 75.7873;

  for (let i = 1; i <= 5; i++) {
    // Generate a random lat/lng within ~5km of base
    const lat = baseLat + (Math.random() - 0.5) * 0.05;
    const lng = baseLng + (Math.random() - 0.5) * 0.05;
    
    // Mix of statuses
    let status = 'SUBMITTED';
    let slaDeadline = new Date(Date.now() + 24 * 3600 * 1000); // Tomorrow
    
    if (i === 1) status = 'IN_PROGRESS';
    if (i === 2) status = 'RESOLVED';
    if (i === 3) {
      status = 'SUBMITTED';
      slaDeadline = new Date(Date.now() - 24 * 3600 * 1000); // Yesterday (Will be caught by CRON)
    }

    await prisma.complaint.upsert({
      where: { ticketNumber: `RW-SEED-${i}` },
      update: {},
      create: {
        ticketNumber: `RW-SEED-${i}`,
        citizenId: citizenUser.id,
        title: `Seed Complaint ${i}`,
        description: 'Auto-generated seed complaint for hackathon demo.',
        latitude: lat,
        longitude: lng,
        address: 'Jaipur, Rajasthan',
        damageType: 'pothole',
        severity: Math.random(),
        status: status,
        authorityId: pwdAuthority.id, // Assigned to our seed authority
        slaHours: 48,
        slaDeadline: slaDeadline
      }
    });
  }

  console.log('Seeding complete! You can login with:');
  console.log('Authority: authority@demo.com / password123');
  console.log('State Admin: state@demo.com / password123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
