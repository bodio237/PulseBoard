import { useState, useEffect } from 'react';
import client from '../api/client';

export interface MetricSummary {
  name: string;
  avg_value: number;
  min_value: number;
  max_value: number;
  total_records: number;
  last_recorded: string;
}

export interface MetricPoint {
  recorded_at: string;
  value: number;
}

export interface TriggeredAlert {
  id: number;
  metric_name: string;
  threshold: number;
  condition: string;
  message: string;
  current_value: number;
}

export const useMetricsSummary = () => {
  const [data, setData] = useState<MetricSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await client.get('/metrics/summary');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, refetch: fetch };
};

export const useMetricTrend = (metricName: string) => {
  const [data, setData] = useState<MetricPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get(`/metrics?name=${metricName}`);
        setData(res.data.map((m: { value: number; recorded_at: string }) => ({
          value: m.value,
          recorded_at: new Date(m.recorded_at).toLocaleTimeString(),
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [metricName]);

  return { data, loading };
};

export const useAlerts = () => {
  const [data, setData] = useState<TriggeredAlert[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/alerts/check');
        setData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, []);

  return { data };
};