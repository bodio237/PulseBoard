"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlert = exports.fetchAlerts = exports.fetchEvents = exports.postEvent = exports.fetchSummary = exports.fetchMetrics = exports.postMetric = void 0;
const metric_service_1 = require("../services/metric.service");
const database_1 = __importDefault(require("../config/database"));
const postMetric = async (req, res) => {
    try {
        const { name, value, unit } = req.body;
        if (!name || value === undefined) {
            res.status(400).json({ message: 'name et value sont requis' });
            return;
        }
        const metric = await (0, metric_service_1.insertMetric)(name, value, unit);
        res.status(201).json(metric);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.postMetric = postMetric;
const fetchMetrics = async (req, res) => {
    try {
        const { name } = req.query;
        const metrics = await (0, metric_service_1.getMetrics)(name);
        res.status(200).json(metrics);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.fetchMetrics = fetchMetrics;
const fetchSummary = async (req, res) => {
    try {
        const summary = await (0, metric_service_1.getMetricsSummary)();
        res.status(200).json(summary);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.fetchSummary = fetchSummary;
const postEvent = async (req, res) => {
    try {
        const { event_type, user_id, metadata } = req.body;
        if (!event_type) {
            res.status(400).json({ message: 'event_type est requis' });
            return;
        }
        const event = await (0, metric_service_1.insertEvent)(event_type, user_id, metadata);
        res.status(201).json(event);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.postEvent = postEvent;
const fetchEvents = async (req, res) => {
    try {
        const events = await (0, metric_service_1.getEvents)();
        res.status(200).json(events);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.fetchEvents = fetchEvents;
const fetchAlerts = async (req, res) => {
    try {
        const triggered = await (0, metric_service_1.checkAlerts)();
        res.status(200).json(triggered);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.fetchAlerts = fetchAlerts;
const createAlert = async (req, res) => {
    try {
        const { metric_name, threshold, condition, message } = req.body;
        if (!metric_name || threshold === undefined || !condition || !message) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }
        const result = await database_1.default.query('INSERT INTO alerts (metric_name, threshold, condition, message) VALUES ($1, $2, $3, $4) RETURNING *', [metric_name, threshold, condition, message]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(500).json({ message });
    }
};
exports.createAlert = createAlert;
