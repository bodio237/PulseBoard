import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import metricRoutes from './routes/metric.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', metricRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PulseBoard API is running' });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export default app;