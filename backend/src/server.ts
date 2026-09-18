import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import complaintRoutes from './routes/complaint.routes';
import authorityRoutes from './routes/authority.routes';
import stateRoutes from './routes/state.routes';
import { startSlaMonitoring } from './jobs/slaEscalation.job';

dotenv.config();

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 5000;

// Security Headers
app.use(helmet());

// Rate Limiter: Max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Strict CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/authority', authorityRoutes);
app.use('/api/state', stateRoutes);

app.get('/', (req, res) => {
  res.send('RoadWatch API is running');
});

// Start Background Jobs
if (process.env.NODE_ENV !== 'test') {
  startSlaMonitoring();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
