import express from 'express';
import { getAssignedComplaints, updateComplaintStatus } from '../controllers/authority.controller';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();

// Apply auth and RBAC (OWASP Broken Access Control prevention)
router.use(requireAuth);
router.use(requireRole(['AUTHORITY', 'STATE']));

router.get('/complaints', getAssignedComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);

export default router;
