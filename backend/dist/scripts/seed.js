"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const METRICS = [
    { name: 'active_users', unit: 'users', base: 150, variance: 60, min: 40, max: 320 },
    { name: 'api_response_time', unit: 'ms', base: 220, variance: 90, min: 90, max: 480 },
    { name: 'error_rate', unit: '%', base: 1.8, variance: 1.5, min: 0, max: 7 },
];
const POINTS_PER_METRIC = 48;
const INTERVAL_MINUTES = 30;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const generateSeries = (config) => {
    const values = [];
    let current = config.base;
    for (let i = 0; i < POINTS_PER_METRIC; i++) {
        // Cycle journalier : pic en journée, creux la nuit
        const hourOfDay = (i * INTERVAL_MINUTES / 60) % 24;
        const dailyFactor = Math.sin((hourOfDay - 6) * Math.PI / 12);
        // Marche aléatoire + tendance journalière
        const drift = (Math.random() - 0.5) * config.variance * 0.4;
        const seasonal = dailyFactor * config.variance * 0.5;
        current = clamp(config.base + seasonal + drift, config.min, config.max);
        // Pics occasionnels (5% de chance)
        const value = Math.random() < 0.05
            ? clamp(current * 1.6, config.min, config.max)
            : current;
        values.push(Number(value.toFixed(2)));
    }
    return values;
};
const seed = async () => {
    console.log('🌱 Génération des données de démonstration...\n');
    try {
        await database_1.default.query('DELETE FROM metrics');
        console.log('   Anciennes métriques supprimées');
        const now = Date.now();
        const intervalMs = INTERVAL_MINUTES * 60 * 1000;
        let total = 0;
        for (const config of METRICS) {
            const values = generateSeries(config);
            for (let i = 0; i < values.length; i++) {
                const recordedAt = new Date(now - (values.length - 1 - i) * intervalMs);
                await database_1.default.query('INSERT INTO metrics (name, value, unit, recorded_at) VALUES ($1, $2, $3, $4)', [config.name, values[i], config.unit, recordedAt]);
                total++;
            }
            const last = values[values.length - 1];
            console.log(`   ${config.name.padEnd(20)} ${values.length} points  (dernière valeur : ${last}${config.unit})`);
        }
        console.log(`\n✅ ${total} métriques insérées sur les dernières 24h`);
    }
    catch (error) {
        console.error('❌ Erreur lors du seed :', error);
        process.exitCode = 1;
    }
    finally {
        await database_1.default.end();
    }
};
seed();
