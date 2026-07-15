import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMetricsSummary, useAlerts } from '../hooks/useMetrics';
import MetricCard from '../components/MetricCard';
import MetricChart from '../components/MetricChart';
import AlertBanner from '../components/AlertBanner';

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: metrics, loading } = useMetricsSummary();
  const { data: alerts } = useAlerts();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-bold text-white">PulseBoard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Dashboard</span>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
            <p className="text-gray-400 mt-1">Métriques en temps réel — mise à jour toutes les 10s</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Alertes */}
        <AlertBanner alerts={alerts} />

        {/* Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-6 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics
  .sort((a, b) => {
    const order = ['active_users', 'api_response_time', 'error_rate'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  })
  .map((metric) => (
    <MetricCard key={metric.name} metric={metric} />
  ))}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricChart
            metricName="active_users"
            label="Utilisateurs actifs"
            color="#6366F1"
          />
          <MetricChart
            metricName="api_response_time"
            label="Temps de réponse API (ms)"
            color="#EAB308"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricChart
            metricName="error_rate"
            label="Taux d'erreur (%)"
            color="#EF4444"
          />
          {/* Placeholder pour future métrique */}
          <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-center border-2 border-dashed border-gray-800">
            <p className="text-gray-600 text-sm">Métrique personnalisée à venir</p>
          </div>
        </div>
      </main>
    </div>
  );
}