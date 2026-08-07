"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAlerts = exports.getActiveAlerts = exports.getEvents = exports.insertEvent = exports.getMetricsSummary = exports.getMetrics = exports.insertMetric = void 0;
const database_1 = __importDefault(require("../config/database"));
const insertMetric = async (name, value, unit) => {
    const result = await database_1.default.query('INSERT INTO metrics (name, value, unit) VALUES ($1, $2, $3) RETURNING *', [name, value, unit]);
    return result.rows[0];
};
exports.insertMetric = insertMetric;
const getMetrics = async (name) => {
    if (name) {
        const result = await database_1.default.query('SELECT * FROM metrics WHERE name = $1 ORDER BY recorded_at DESC LIMIT 50', [name]);
        return result.rows;
    }
    const result = await database_1.default.query('SELECT * FROM metrics ORDER BY recorded_at DESC LIMIT 100');
    return result.rows;
};
exports.getMetrics = getMetrics;
const getMetricsSummary = async () => {
    const result = await database_1.default.query(`
    SELECT
      name,
      ROUND(AVG(value)::numeric, 2) as avg_value,
      ROUND(MIN(value)::numeric, 2) as min_value,
      ROUND(MAX(value)::numeric, 2) as max_value,
      COUNT(*) as total_records,
      MAX(recorded_at) as last_recorded
    FROM metrics
    GROUP BY name
  `);
    return result.rows;
};
exports.getMetricsSummary = getMetricsSummary;
const insertEvent = async (event_type, user_id, metadata) => {
    const result = await database_1.default.query('INSERT INTO events (event_type, user_id, metadata) VALUES ($1, $2, $3) RETURNING *', [event_type, user_id, metadata]);
    return result.rows[0];
};
exports.insertEvent = insertEvent;
const getEvents = async () => {
    const result = await database_1.default.query('SELECT * FROM events ORDER BY created_at DESC LIMIT 50');
    return result.rows;
};
exports.getEvents = getEvents;
const getActiveAlerts = async () => {
    const result = await database_1.default.query('SELECT * FROM alerts WHERE is_active = true');
    return result.rows;
};
exports.getActiveAlerts = getActiveAlerts;
const checkAlerts = async () => {
    const alerts = await (0, exports.getActiveAlerts)();
    const triggered = [];
    for (const alert of alerts) {
        const result = await database_1.default.query('SELECT value FROM metrics WHERE name = $1 ORDER BY recorded_at DESC LIMIT 1', [alert.metric_name]);
        if (result.rows.length === 0)
            continue;
        const latest = result.rows[0].value;
        let isTriggered = false;
        if (alert.condition === 'gt' && latest > alert.threshold)
            isTriggered = true;
        if (alert.condition === 'lt' && latest < alert.threshold)
            isTriggered = true;
        if (alert.condition === 'eq' && latest === alert.threshold)
            isTriggered = true;
        if (isTriggered) {
            triggered.push({ ...alert, current_value: latest });
        }
    }
    return triggered;
};
exports.checkAlerts = checkAlerts;
