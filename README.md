# CineHub — API REST de gestion de cinéma

API Node.js / Express / MySQL : films, salles, séances et réservations, sécurisée par JWT avec deux rôles (`user` et `admin`).

Interface web React (bonus) : [cinehub_front](https://github.com/pascal62680/cinehub_front).

## Technologies
Node.js (modules ES6), Express, MySQL (`mysql2/promise`), `bcrypt`, `jsonwebtoken`, `dotenv`, `nodemailer`, `nodemon`.

## Installation

1. Cloner le dépôt puis installer les dépendances :
   ```bash
   git clone https://github.com/pascal62680/cinehub_back.git
   cd cinehub_back
   npm install
   ```
2. Créer la base de données : exécuter `bdd.sql` avec un compte MySQL administrateur (root), par exemple dans MySQL Workbench (*File → Open SQL Script*, puis ⚡).
   Le script crée la base `cinehub`, les 5 tables, l'utilisateur MySQL `cine_user` (mot de passe `cinehub`, droits SELECT / INSERT / UPDATE / DELETE sur `cinehub` uniquement) et des données de test.
3. Copier `.env.example` en `.env` et compléter les valeurs (`DB_PASSWORD`, `JWT_SECRET`…).
   Pour l'e-mail de confirmation (facultatif) : renseigner `SMTP_USER` et `SMTP_PASSWORD`. Avec Gmail, il faut un **mot de passe d'application** (16 caractères), pas le mot de passe du compte.

## Lancement
```bash
npm start
```
L'API est disponible sur `http://127.0.0.1:3000` (`GET /` → `{ "status": "OK" }`).

## Comptes de test
| Rôle  | Username | Mot de passe | Origine |
|-------|----------|--------------|---------|
| admin | `pascal` | `pascal62680` | créé par `bdd.sql` (mot de passe haché avec bcrypt) |
| user  | `jean`   | `jean1234`    | à créer via `POST /auth/register` |

## Authentification
1. `POST /auth/login` avec `{ "username": "pascal", "password": "pascal62680" }` → renvoie un `token` (valable 1 h).
2. Envoyer ce token dans l'en-tête de chaque requête protégée :
   `Authorization: Bearer <token>`

## Principaux endpoints
| Méthode | URL | Accès |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | public |
| GET | `/films`, `/films/showing`, `/films/:id` | connecté |
| POST / PATCH / DELETE | `/films`, `/films/:id` | admin (DELETE = retrait de l'affiche) |
| GET | `/rooms`, `/rooms/:id` | connecté |
| POST / PATCH / DELETE | `/rooms`, `/rooms/:id` | admin |
| GET | `/screenings`, `/screenings/film/:filmID`, `/screenings/:id` | connecté |
| POST / PATCH / DELETE | `/screenings`, `/screenings/:id` | admin |
| GET | `/reservations/me` | connecté |
| POST | `/reservations` | connecté |
| DELETE | `/reservations/:id` | sa réservation ou admin |
| GET | `/reservations`, `/reservations/screening/:screeningID` | admin |
| GET | `/users/me`, `/users/:id` | connecté |
| PATCH | `/users/:id` | soi-même ou admin |
| PATCH | `/users/:id/role` | admin |
| GET / DELETE | `/users`, `/users/:id` | admin |

## Exemples d'appels
**Réserver 2 places pour la séance 1** (token d'un utilisateur) :
```http
POST /reservations
Authorization: Bearer <token>
Content-Type: application/json

{ "screening": 1, "seats": 2 }
```
→ `201` si des places restent, `403 { "error": "Plus assez de places disponibles" }` sinon.

**Créer un film** (token admin) :
```http
POST /films
Authorization: Bearer <token_admin>
Content-Type: application/json

{ "title": "Inception", "duration": 148, "genre": "Science-fiction" }
```

## Codes de réponse
`200` succès · `201` création · `401` token absent · `403` token invalide / droits insuffisants / champs manquants / plus de places · `404` introuvable · `500` erreur serveur. Toutes les erreurs sont au format `{ "error": "message" }`.

## Bonus réalisés
- **Mot de passe jamais renvoyé** : seules les colonnes publiques (`us_id`, `us_username`, `us_email`, `us_role`) sortent de l'API ; le mot de passe est haché avec bcrypt.
- **Suppressions en cascade** (`ON DELETE CASCADE`) : supprimer une séance supprime ses réservations ; supprimer un utilisateur supprime ses réservations.
- **Séance passée non réservable** : `403 "Impossible de réserver une séance déjà passée"`.
- **Changement de rôle** : `PATCH /users/:id/role` avec `{ "role": "admin" }` ou `{ "role": "user" }` (admin uniquement).
- **Soft delete des films** : `DELETE /films/:id` passe `fi_is_showing` à 0 au lieu de supprimer ; séances et réservations sont conservées. Remise à l'affiche : `PATCH /films/:id` avec `{ "is_showing": 1 }`.
- **Validation des données** (`403` si invalide) : format des e-mails, date et prix (> 0) des séances, durée des films et capacité des salles (entiers > 0).
- **E-mail de confirmation** de réservation via `nodemailer` (SMTP configuré dans `.env`). Si l'envoi échoue, la réservation reste valide (`201`).
- **Erreurs au format JSON** : route inconnue → `404`, JSON mal formé → `400 "JSON invalide"`.

## Tests
La collection Postman `CineHub.postman_collection.json` (à la racine du dépôt) contient les requêtes de test.
