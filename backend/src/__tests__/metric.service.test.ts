import { checkAlerts, insertMetric, getMetricsSummary } from '../services/metric.service';
import pool from '../config/database';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

describe('insertMetric', () => {
  it('insère une métrique et retourne la ligne créée', async () => {
    const created = { id: 1, name: 'active_users', value: 120, unit: 'users' };
    mockedQuery.mockResolvedValueOnce({ rows: [created] });

    const result = await insertMetric('active_users', 120, 'users');

    expect(result).toEqual(created);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO metrics'),
      ['active_users', 120, 'users']
    );
  });
});

describe('getMetricsSummary', () => {
  it('retourne les agrégats par métrique', async () => {
    const summary = [
      { name: 'active_users', avg_value: '150.00', min_value: '40.00', max_value: '320.00' },
    ];
    mockedQuery.mockResolvedValueOnce({ rows: summary });

    const result = await getMetricsSummary();

    expect(result).toEqual(summary);
  });
});

describe('checkAlerts', () => {
  const alert = {
    id: 1,
    metric_name: 'api_response_time',
    threshold: 300,
    condition: 'gt',
    message: 'Temps de reponse API trop eleve',
    is_active: true,
  };

  it('déclenche une alerte "gt" quand la valeur dépasse le seuil', async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [alert] })
      .mockResolvedValueOnce({ rows: [{ value: 412 }] });

    const triggered = await checkAlerts();

    expect(triggered).toHaveLength(1);
    expect(triggered[0].current_value).toBe(412);
    expect(triggered[0].message).toBe(alert.message);
  });

  it('ne déclenche pas une alerte "gt" quand la valeur est sous le seuil', async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [alert] })
      .mockResolvedValueOnce({ rows: [{ value: 180 }] });

    const triggered = await checkAlerts();

    expect(triggered).toHaveLength(0);
  });

  it('ne déclenche pas quand la valeur est exactement au seuil', async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [alert] })
      .mockResolvedValueOnce({ rows: [{ value: 300 }] });

    const triggered = await checkAlerts();

    expect(triggered).toHaveLength(0);
  });

  it('déclenche une alerte "lt" quand la valeur passe sous le seuil', async () => {
    const ltAlert = { ...alert, metric_name: 'active_users', condition: 'lt', threshold: 50 };
    mockedQuery
      .mockResolvedValueOnce({ rows: [ltAlert] })
      .mockResolvedValueOnce({ rows: [{ value: 20 }] });

    const triggered = await checkAlerts();

    expect(triggered).toHaveLength(1);
    expect(triggered[0].current_value).toBe(20);
  });

  it('ignore une alerte sans métrique enregistrée', async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [alert] })
      .mockResolvedValueOnce({ rows: [] });

    const triggered = await checkAlerts();

    expect(triggered).toHaveLength(0);
  });

  it('évalue plusieurs alertes indépendamment', async () => {
    const second = { ...alert, id: 2, metric_name: 'error_rate', threshold: 5 };
    mockedQuery
      .mockResolvedValueOnce({ rows: [alert, second] })
      .mockResolvedValueOnce({ rows: [{ value: 412 }] })  // dépasse
      .mockResolvedValueOnce({ rows: [{ value: 2.1 }] }); // ne dépasse pas

    const triggered = await checkAlerts();

    expect(triggered).toHaveLength(1);
    expect(triggered[0].id).toBe(1);
  });
});