# PulseBoard 📊

> Dashboard de monitoring SaaS en temps réel — suivez les performances de votre application depuis une interface intuitive.

![CI](https://github.com/bodio237/PulseBoard/actions/workflows/ci.yml/badge.svg)

---

## 🎯 Pourquoi PulseBoard ?

Quand une application est en production, les équipes ont besoin de savoir en temps réel :
- Combien d'utilisateurs sont actifs ?
- L'API répond-elle rapidement ?
- Y a-t-il des erreurs critiques ?

PulseBoard centralise ces métriques dans un dashboard visuel avec alertes automatiques — sans attendre que les utilisateurs se plaignent.

---

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** — register / login sécurisé avec bcrypt
- 📈 **Métriques temps réel** — mise à jour automatique toutes les 10s
- 🔔 **Alertes configurables** — notification visuelle si un seuil est dépassé
- 📊 **Graphiques interactifs** — courbes d'évolution par métrique (Recharts)
- 🐍 **Analytics Python** — calcul de tendances (hausse/baisse/stable) avec Pandas
- 🐳 **Containerisé** — lancement en une commande avec Docker Compose
- ⚙️ **CI/CD** — pipeline GitHub Actions (build + lint sur 3 services)

---

## 📸 Aperçu

### Page de connexion
![Login](screenshots/login.png)

### Dashboard principal
![Dashboard](screenshots/dashboard.png)

### Graphiques temps réel
![Charts](screenshots/charts.png)

---

## 🏗️ Architecture
┌─────────────────┐ ┌──────────────────────┐ ┌─────────────────────┐
│ Frontend │────▶│ Backend │────▶│ PostgreSQL │
│ React / TS │ │ Node.js/Express/TS │ │ Base de données │
│ Port 3000 │ │ Port 4000 │ │ Port 5432 │
└─────────────────┘ └──────────────────────┘ └─────────────────────┘
▲
┌──────────────────────┐ │
│ Analytics Service │────────────────┘
│ Python / FastAPI │
│ Port 8000 │
└──────────────────────┘

---

## 🛠️ Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Recharts, Axios |
| **Backend** | Node.js, Express, TypeScript, JWT, bcrypt |
| **Analytics** | Python 3.11, FastAPI, Pandas, psycopg2 |
| **Base de données** | PostgreSQL 15 |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

---

## 🚀 Lancement en local

### Prérequis
- Docker Desktop
- Node.js 20+

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/bodio237/PulseBoard.git
cd PulseBoard

# 2. Créer le fichier d'environnement
cp .env.example .env

# 3. Lancer les services backend (db + api + analytics)
docker compose up --build
```

```bash
# 4. Dans un second terminal, lancer le frontend
cd frontend
npm install
npm run dev
```

### Accès

| Service | URL |
|---------|-----|
| 🖥️ Dashboard | http://localhost:3000 |
| 🔌 API Backend | http://localhost:4000 |
| 🐍 Analytics | http://localhost:8000 |
| 📖 Analytics Docs | http://localhost:8000/docs |

---

## 📡 API Endpoints

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/register` | Créer un compte |
| `POST` | `/api/auth/login` | Se connecter |

### Métriques (🔒 authentification requise)
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/metrics` | Enregistrer une métrique |
| `GET` | `/api/metrics` | Lister les métriques |
| `GET` | `/api/metrics/summary` | Statistiques agrégées |

### Alertes (🔒 authentification requise)
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/alerts` | Créer une alerte |
| `GET` | `/api/alerts/check` | Vérifier les alertes déclenchées |

---

## 📁 Structure du projet

## 📁 Structure du projet

```
PulseBoard/
├── frontend/              # React + TypeScript + Tailwind
│   └── src/
│       ├── api/           # Client Axios
│       ├── components/    # MetricCard, MetricChart, AlertBanner
│       ├── context/       # AuthContext (JWT)
│       ├── hooks/         # useMetrics, useAlerts
│       └── pages/         # Login, Register, Dashboard
│
├── backend/               # Node.js + Express + TypeScript
│   └── src/
│       ├── config/        # DB + init.sql
│       ├── controllers/   # Logique HTTP
│       ├── middleware/    # Auth JWT
│       ├── models/        # Types TypeScript
│       ├── routes/        # Définition des endpoints
│       └── services/      # Logique métier
│
├── analytics/             # Python + FastAPI
│   ├── routers/           # Endpoints analytics
│   ├── database.py        # Connexion PostgreSQL + Pandas
│   └── main.py
│
├── .github/workflows/     # CI/CD GitHub Actions
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Modèle de données

```sql
users     (id, email, password, name, created_at)
metrics   (id, name, value, unit, recorded_at)
events    (id, user_id, event_type, metadata, created_at)
alerts    (id, metric_name, threshold, condition, message, is_active)
```

---

## 👩‍💻 Auteure

**Pricilia Sandrine Bodio**  
Étudiante ingénieure M2 — ISEN Nantes  
🔗 [GitHub](https://github.com/bodio237)