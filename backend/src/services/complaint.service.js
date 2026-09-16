"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplaintsByCitizen = exports.createComplaint = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createComplaint = async (citizenId, data) => {
    // Generate ticket number
    const ticketNumber = `RW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    // Find responsible authority (Basic geographic lookup mock for MVP)
    const authority = await prisma_1.default.authority.findFirst();
    if (!authority) {
        console.warn("No authority found in database. Please seed the database with authorities.");
    }
    // Calculate SLA (Mock logic for MVP)
    const slaHours = 72; // Default 3 days
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);
    const complaint = await prisma_1.default.complaint.create({
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
            authorityId: authority?.id,
            slaHours,
            slaDeadline
        }
    });
    // Create status history
    await prisma_1.default.complaintStatusHistory.create({
        data: {
            complaintId: complaint.id,
            newStatus: 'SUBMITTED',
            remarks: 'Complaint submitted by citizen'
        }
    });
    return complaint;
};
exports.createComplaint = createComplaint;
const getComplaintsByCitizen = async (citizenId) => {
    return await prisma_1.default.complaint.findMany({
        where: { citizenId },
        orderBy: { createdAt: 'desc' },
        include: { authority: true }
    });
};
exports.getComplaintsByCitizen = getComplaintsByCitizen;
//# sourceMappingURL=complaint.service.js.map