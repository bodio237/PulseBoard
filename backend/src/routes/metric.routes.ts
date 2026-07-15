import { Router } from 'express';
import {
  postMetric,
  fetchMetrics,
  fetchSummary,
  postEvent,
  fetchEvents,
  fetchAlerts,
  createAlert
} from '../controllers/metric.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Métriques
router.post('/metrics', authMiddleware, postMetric);
router.get('/metrics', authMiddleware, fetchMetrics);
router.get('/metrics/summary', authMiddleware, fetchSummary);

// Événements
router.post('/events', authMiddleware, postEvent);
router.get('/events', authMiddleware, fetchEvents);

// Alertes
router.post('/alerts', authMiddleware, createAlert);
router.get('/alerts/check', authMiddleware, fetchAlerts);

export default router;