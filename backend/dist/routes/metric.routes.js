"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metric_controller_1 = require("../controllers/metric.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Métriques
router.post('/metrics', auth_middleware_1.authMiddleware, metric_controller_1.postMetric);
router.get('/metrics', auth_middleware_1.authMiddleware, metric_controller_1.fetchMetrics);
router.get('/metrics/summary', auth_middleware_1.authMiddleware, metric_controller_1.fetchSummary);
// Événements
router.post('/events', auth_middleware_1.authMiddleware, metric_controller_1.postEvent);
router.get('/events', auth_middleware_1.authMiddleware, metric_controller_1.fetchEvents);
// Alertes
router.post('/alerts', auth_middleware_1.authMiddleware, metric_controller_1.createAlert);
router.get('/alerts/check', auth_middleware_1.authMiddleware, metric_controller_1.fetchAlerts);
exports.default = router;
