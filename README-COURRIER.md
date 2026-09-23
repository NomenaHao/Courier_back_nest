# Courrier API (NestJS)

Remplacement du backend Django avec la **même API** pour le frontend Vue.

## Démarrage

1. Copie `.env.example` → `.env` (mêmes `DB_*` que `Courier-back/.env`).
2. `JWT_SECRET` : idéalement la même valeur que `SECRET_KEY` Django.
3. Arrête Django sur le port 8000 (un seul serveur à la fois).

```bash
cd courier-back-nest
npm install
npm run start:dev
```

API : `http://localhost:8000/api`  
WebSocket : `ws://localhost:8000/ws/notifications/?token=...`

## Endpoints

Identiques à Django : `auth/*`, `orders/*`.

Les mots de passe Django (`pbkdf2_sha256`) restent valides au login.
