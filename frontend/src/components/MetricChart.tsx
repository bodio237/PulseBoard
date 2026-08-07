import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMetricTrend } from '../hooks/useMetrics';

interface Props {
  metricName: string;
  label: string;
  color: string;
}

export default function MetricChart({ metricName, label, color }: Props) {
  const { data, loading } = useMetricTrend(metricName);

 if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6">
        <p className="text-gray-300 font-semibold mb-4">{label}</p>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-500 text-sm">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-center h-64">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <p className="text-gray-300 font-semibold mb-4">{label}</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="recorded_at"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            interval={Math.max(0, Math.floor(data.length / 6) - 1)}
            minTickGap={20}
          />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#9CA3AF' }}
            itemStyle={{ color: '#F9FAFB' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}