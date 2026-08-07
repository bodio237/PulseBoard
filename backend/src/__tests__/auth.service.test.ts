import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../services/auth.service';
import pool from '../config/database';

// On isole la base de données : les tests ne doivent pas dépendre de PostgreSQL
jest.mock('../config/database', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret';
});

describe('registerUser', () => {
  it('crée un utilisateur et retourne un token valide', async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [] }) // email non utilisé
      .mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com', name: 'Test' }],
      });

    const result = await registerUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
    });

    expect(result.user).toEqual({ id: 1, email: 'test@example.com', name: 'Test' });

    const decoded = jwt.verify(result.token, 'test_secret') as { userId: number };
    expect(decoded.userId).toBe(1);
  });

  it('hache le mot de passe avant insertion', async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 2, email: 'a@b.c', name: 'A' }] });

    await registerUser({ email: 'a@b.c', password: 'monMotDePasse', name: 'A' });

    const insertCall = mockedQuery.mock.calls[1];
    const storedPassword = insertCall[1][1];

    expect(storedPassword).not.toBe('monMotDePasse');
    await expect(bcrypt.compare('monMotDePasse', storedPassword)).resolves.toBe(true);
  });

  it('rejette un email déjà utilisé', async () => {
    mockedQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await expect(
      registerUser({ email: 'existe@deja.com', password: 'pass', name: 'X' })
    ).rejects.toThrow('Email déjà utilisé');
  });
});

describe('loginUser', () => {
  it('authentifie un utilisateur avec les bons identifiants', async () => {
    const hashed = await bcrypt.hash('bonMotDePasse', 10);
    mockedQuery.mockResolvedValueOnce({
      rows: [{ id: 5, email: 'user@test.com', name: 'User', password: hashed }],
    });

    const result = await loginUser({ email: 'user@test.com', password: 'bonMotDePasse' });

    expect(result.user).toEqual({ id: 5, email: 'user@test.com', name: 'User' });
    expect(result.user).not.toHaveProperty('password');
    expect(typeof result.token).toBe('string');
  });

  it('rejette un mot de passe incorrect', async () => {
    const hashed = await bcrypt.hash('bonMotDePasse', 10);
    mockedQuery.mockResolvedValueOnce({
      rows: [{ id: 5, email: 'user@test.com', name: 'User', password: hashed }],
    });

    await expect(
      loginUser({ email: 'user@test.com', password: 'mauvaisMotDePasse' })
    ).rejects.toThrow('Email ou mot de passe incorrect');
  });

  it('rejette un email inexistant', async () => {
    mockedQuery.mockResolvedValueOnce({ rows: [] });

    await expect(
      loginUser({ email: 'inconnu@test.com', password: 'pass' })
    ).rejects.toThrow('Email ou mot de passe incorrect');
  });
});