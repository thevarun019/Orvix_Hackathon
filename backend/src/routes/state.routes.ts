import express from 'express';
import { getStateKPIs, getStateHeatmap, getDistrictPerformance } from '../controllers/state.controller';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();

// All state routes require authentication AND the STATE or ADMIN role (RBAC)
router.use(requireAuth);
router.use(requireRole(['STATE', 'ADMIN']));

// GET /api/state/kpis
router.get('/kpis', getStateKPIs);

// GET /api/state/heatmap
router.get('/heatmap', getStateHeatmap);

// GET /api/state/district-performance
router.get('/district-performance', getDistrictPerformance);

export default router;
