import pool from '../config/database';

export const insertMetric = async (name: string, value: number, unit?: string) => {
  const result = await pool.query(
    'INSERT INTO metrics (name, value, unit) VALUES ($1, $2, $3) RETURNING *',
    [name, value, unit]
  );
  return result.rows[0];
};

export const getMetrics = async (name?: string) => {
  if (name) {
    const result = await pool.query(
      'SELECT * FROM metrics WHERE name = $1 ORDER BY recorded_at DESC LIMIT 50',
      [name]
    );
    return result.rows;
  }
  const result = await pool.query(
    'SELECT * FROM metrics ORDER BY recorded_at DESC LIMIT 100'
  );
  return result.rows;
};

export const getMetricsSummary = async () => {
  const result = await pool.query(`
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

export const insertEvent = async (event_type: string, user_id?: number, metadata?: Record<string, unknown>) => {
  const result = await pool.query(
    'INSERT INTO events (event_type, user_id, metadata) VALUES ($1, $2, $3) RETURNING *',
    [event_type, user_id, metadata]
  );
  return result.rows[0];
};

export const getEvents = async () => {
  const result = await pool.query(
    'SELECT * FROM events ORDER BY created_at DESC LIMIT 50'
  );
  return result.rows;
};

export const getActiveAlerts = async () => {
  const result = await pool.query(
    'SELECT * FROM alerts WHERE is_active = true'
  );
  return result.rows;
};

export const checkAlerts = async () => {
  const alerts = await getActiveAlerts();
  const triggered = [];

  for (const alert of alerts) {
    const result = await pool.query(
      'SELECT value FROM metrics WHERE name = $1 ORDER BY recorded_at DESC LIMIT 1',
      [alert.metric_name]
    );

    if (result.rows.length === 0) continue;

    const latest = result.rows[0].value;
    let isTriggered = false;

    if (alert.condition === 'gt' && latest > alert.threshold) isTriggered = true;
    if (alert.condition === 'lt' && latest < alert.threshold) isTriggered = true;
    if (alert.condition === 'eq' && latest === alert.threshold) isTriggered = true;

    if (isTriggered) {
      triggered.push({ ...alert, current_value: latest });
    }
  }

  return triggered;
};