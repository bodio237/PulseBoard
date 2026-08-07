"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }
        const result = await (0, auth_service_1.registerUser)({ email, password, name });
        res.status(201).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(400).json({ message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email et mot de passe requis' });
            return;
        }
        const result = await (0, auth_service_1.loginUser)({ email, password });
        res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur serveur';
        res.status(401).json({ message });
    }
};
exports.login = login;
