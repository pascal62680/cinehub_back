-- =====================================================================
-- CineHub : script de création de la base de données
-- Exécution : mysql -u root -p < bdd.sql   (ou import dans phpMyAdmin / Workbench)
-- À exécuter UNE SEULE FOIS. Pour repartir de zéro : DROP DATABASE cinehub; puis relancer.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Création de la base
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS cinehub
-- gestion majuscules minuscule evite deux comptes identhiques
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cinehub;


-- ---------------------------------------------------------------------
-- 2. Création des 5 tables
-- ---------------------------------------------------------------------

-- Tables sans clé étrangère : créées en premier
CREATE TABLE IF NOT EXISTS users (
    us_id        INT PRIMARY KEY AUTO_INCREMENT,
    us_username  VARCHAR(255) NOT NULL UNIQUE,
    us_password  TEXT NOT NULL,
    us_email     VARCHAR(255) NOT NULL UNIQUE,
    us_role      ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS films (
    fi_id            INT PRIMARY KEY AUTO_INCREMENT,
    fi_title         VARCHAR(255) NOT NULL,
    fi_description   TEXT,
    fi_duration      INT NOT NULL,              -- durée en minutes
    fi_genre         VARCHAR(100),
    fi_release_date  DATE,
    fi_is_showing    TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rooms (
    ro_id        INT PRIMARY KEY AUTO_INCREMENT,
    ro_name      VARCHAR(100) NOT NULL UNIQUE,
    ro_capacity  INT NOT NULL
);

-- Dépend de films et rooms sceances
CREATE TABLE IF NOT EXISTS screenings (
    sc_id        INT PRIMARY KEY AUTO_INCREMENT,
    sc_film      INT NOT NULL,
    sc_room      INT NOT NULL,
    sc_datetime  DATETIME NOT NULL,
    sc_price     DECIMAL(6,2) NOT NULL,
    -- ON DELETE CASCADE : supprimer un film (ou une salle) supprime ses séances
    FOREIGN KEY (sc_film) REFERENCES films(fi_id) ON DELETE CASCADE,
    FOREIGN KEY (sc_room) REFERENCES rooms(ro_id) ON DELETE CASCADE
);

-- Dépend de users et screenings : créée en dernier
CREATE TABLE IF NOT EXISTS reservations (
    re_id          INT PRIMARY KEY AUTO_INCREMENT,
    re_user        INT NOT NULL,
    re_screening   INT NOT NULL,
    re_seats       INT NOT NULL DEFAULT 1,
    re_created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Un utilisateur ne peut réserver qu'une seule fois la même séance
    UNIQUE (re_user, re_screening),
    -- ON DELETE CASCADE : supprimer un user ou une séance supprime ses réservations
    FOREIGN KEY (re_user) REFERENCES users(us_id) ON DELETE CASCADE,
    FOREIGN KEY (re_screening) REFERENCES screenings(sc_id) ON DELETE CASCADE
);


-- ---------------------------------------------------------------------
-- 3. Utilisateur MySQL dédié à l'API (doit correspondre au .env)
-- ---------------------------------------------------------------------
-- Créé pour 'localhost' ET '127.0.0.1' : selon la configuration de MySQL,
-- une connexion vers DB_HOST=127.0.0.1 peut être vue sous l'un ou l'autre nom.
CREATE USER IF NOT EXISTS 'cine_user'@'localhost' IDENTIFIED BY 'cinehub';
CREATE USER IF NOT EXISTS 'cine_user'@'127.0.0.1' IDENTIFIED BY 'cinehub';

-- Droits limités au strict nécessaire, et uniquement sur la base cinehub
GRANT SELECT, INSERT, UPDATE, DELETE ON cinehub.* TO 'cine_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON cinehub.* TO 'cine_user'@'127.0.0.1';

FLUSH PRIVILEGES;


-- ---------------------------------------------------------------------
-- 4. Compte administrateur de démonstration
-- ---------------------------------------------------------------------
-- username : pascal
-- password : Admin123!   (stocké ci-dessous sous forme de hash bcrypt, 10 rounds)
INSERT INTO users (us_username, us_password, us_email, us_role) VALUES
('pascal', '$2b$10$fWrFhRDkmpEtpYfs/8XJ3usC.8sPYyA6GTpWWdo9XSCWpPhA..Hfm', 'pascal@cinehub.local', 'admin');


-- ---------------------------------------------------------------------
-- 5. Données de test : films, salles, séances
-- ---------------------------------------------------------------------
INSERT INTO films (fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing) VALUES
('Inception', 'Un voleur s''infiltre dans les rêves.', 148, 'Science-fiction', '2010-07-21', 1),
('Le Roi Lion', 'Un jeune lion doit reprendre sa place de roi.', 88, 'Animation', '1994-11-09', 1),
('Intouchables', 'L''amitié improbable entre un aristocrate et son aide à domicile.', 112, 'Comédie', '2011-11-02', 1),
('Interstellar', 'Des astronautes cherchent une nouvelle planète pour l''humanité.', 169, 'Science-fiction', '2014-11-05', 0);

INSERT INTO rooms (ro_name, ro_capacity) VALUES
('Salle 1', 120),
('Salle 2', 80),
('Salle 3', 10);   -- petite salle : pratique pour tester le contrôle des places

INSERT INTO screenings (sc_film, sc_room, sc_datetime, sc_price) VALUES
(1, 1, '2026-12-01 20:30:00', 9.50),
(1, 2, '2026-12-02 18:00:00', 8.00),
(2, 2, '2026-12-03 14:00:00', 7.50),
(3, 1, '2026-12-04 21:00:00', 9.50),
(3, 3, '2026-12-05 16:00:00', 6.00);
