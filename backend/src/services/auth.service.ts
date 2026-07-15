import pool from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateUserDTO, LoginDTO } from '../models/user.model';

export const registerUser = async (data: CreateUserDTO) => {
  const { email, password, name } = data;

  // Vérifier si l'email existe déjà
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('Email déjà utilisé');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const result = await pool.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email, hashedPassword, name]
  );

  const user = result.rows[0];

  // Générer le token JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const loginUser = async (data: LoginDTO) => {
  const { email, password } = data;

  // Vérifier si l'utilisateur existe
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const user = result.rows[0];

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Générer le token JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token
  };
};