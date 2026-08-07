"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (data) => {
    const { email, password, name } = data;
    // Vérifier si l'email existe déjà
    const existing = await database_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        throw new Error('Email déjà utilisé');
    }
    // Hasher le mot de passe
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Créer l'utilisateur
    const result = await database_1.default.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name', [email, hashedPassword, name]);
    const user = result.rows[0];
    // Générer le token JWT
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    // Vérifier si l'utilisateur existe
    const result = await database_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        throw new Error('Email ou mot de passe incorrect');
    }
    const user = result.rows[0];
    // Vérifier le mot de passe
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        throw new Error('Email ou mot de passe incorrect');
    }
    // Générer le token JWT
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return {
        user: { id: user.id, email: user.email, name: user.name },
        token
    };
};
exports.loginUser = loginUser;
