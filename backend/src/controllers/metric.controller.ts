import { Request, Response } from 'express';
import {
  insertMetric,
  getMetrics,
  getMetricsSummary,
  insertEvent,
  getEvents,
  checkAlerts
} from '../services/metric.service';
import pool from '../config/database';

export const postMetric = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, value, unit } = req.body;
    if (!name || value === undefined) {
      res.status(400).json({ message: 'name et value sont requis' });
      return;
    }
    const metric = await insertMetric(name, value, unit);
    res.status(201).json(metric);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};

export const fetchMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;
    const metrics = await getMetrics(name as string);
    res.status(200).json(metrics);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};

export const fetchSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await getMetricsSummary();
    res.status(200).json(summary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};

export const postEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_type, user_id, metadata } = req.body;
    if (!event_type) {
      res.status(400).json({ message: 'event_type est requis' });
      return;
    }
    const event = await insertEvent(event_type, user_id, metadata);
    res.status(201).json(event);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};

export const fetchEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};

export const fetchAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const triggered = await checkAlerts();
    res.status(200).json(triggered);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};

export const createAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { metric_name, threshold, condition, message } = req.body;
    if (!metric_name || threshold === undefined || !condition || !message) {
      res.status(400).json({ message: 'Tous les champs sont requis' });
      return;
    }
    const result = await pool.query(
      'INSERT INTO alerts (metric_name, threshold, condition, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [metric_name, threshold, condition, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};