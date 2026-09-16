import { Router } from 'express';
import { createComplaint, getMyComplaints } from '../controllers/complaint.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/', createComplaint);
router.get('/my', getMyComplaints);

export default router;
