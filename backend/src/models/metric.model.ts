export interface Metric {
  id: number;
  name: string;
  value: number;
  unit?: string;
  recorded_at: Date;
}

export interface Event {
  id: number;
  user_id?: number;
  event_type: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

export interface Alert {
  id: number;
  metric_name: string;
  threshold: number;
  condition: 'gt' | 'lt' | 'eq';
  message: string;
  is_active: boolean;
  created_at: Date;
}