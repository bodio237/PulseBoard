import type { TriggeredAlert } from '../hooks/useMetrics';

interface Props {
  alerts: TriggeredAlert[];
}

export default function AlertBanner({ alerts }: Props) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-red-500/10 border border-red-500 rounded-xl px-5 py-4 flex items-center gap-4"
        >
          <span className="text-red-400 text-xl">⚠️</span>
          <div>
            <p className="text-red-400 font-semibold">{alert.message}</p>
            <p className="text-red-300 text-sm mt-1">
              Valeur actuelle : <strong>{alert.current_value}</strong> — Seuil : {alert.condition === 'gt' ? '>' : alert.condition === 'lt' ? '<' : '='} {alert.threshold}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}