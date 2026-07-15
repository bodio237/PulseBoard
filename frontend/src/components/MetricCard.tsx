import type { MetricSummary } from '../hooks/useMetrics';

interface Props {
  metric: MetricSummary;
}

const metricLabels: Record<string, string> = {
  active_users: 'Utilisateurs actifs',
  api_response_time: 'Temps de réponse API',
  error_rate: 'Taux d\'erreur',
};

const metricUnits: Record<string, string> = {
  active_users: 'users',
  api_response_time: 'ms',
  error_rate: '%',
};

const metricColors: Record<string, string> = {
  active_users: 'border-indigo-500',
  api_response_time: 'border-yellow-500',
  error_rate: 'border-red-500',
};

export default function MetricCard({ metric }: Props) {
  const label = metricLabels[metric.name] || metric.name;
  const unit = metricUnits[metric.name] || '';
  const color = metricColors[metric.name] || 'border-gray-500';

  return (
    <div className={`bg-gray-900 rounded-2xl p-6 border-l-4 ${color}`}>
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{label}</p>
      <p className="text-4xl font-bold text-white mt-2">
        {metric.avg_value}
        <span className="text-lg text-gray-400 ml-1">{unit}</span>
      </p>
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <span>Min: <span className="text-gray-300">{metric.min_value}{unit}</span></span>
        <span>Max: <span className="text-gray-300">{metric.max_value}{unit}</span></span>
        <span>Points: <span className="text-gray-300">{metric.total_records}</span></span>
      </div>
    </div>
  );
}