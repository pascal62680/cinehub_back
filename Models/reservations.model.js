import db from "../Config/db.js";

// Toutes les réservations (admin) : qui, quel film, quand, où
async function getAll() {
    const [rows] = await db.query(
        `SELECT re_id, re_seats, re_created_at, us_username,
                re_screening, fi_title, sc_datetime, ro_name
         FROM reservations
         JOIN users ON re_user = us_id
         JOIN screenings ON re_screening = sc_id
         JOIN films ON sc_film = fi_id
         JOIN rooms ON sc_room = ro_id
         ORDER BY re_created_at`
    );
    return rows;
}

// Les réservations d'un utilisateur (pour /me)
async function getByUser(userId) {
    const [rows] = await db.query(
        `SELECT re_id, re_seats, fi_title, sc_datetime, ro_name, sc_price
         FROM reservations
         JOIN screenings ON re_screening = sc_id
         JOIN films ON sc_film = fi_id
         JOIN rooms ON sc_room = ro_id
         WHERE re_user = ?
         ORDER BY sc_datetime`,
        [userId]
    );
    return rows;
}

// Les réservations d'une séance (admin)
async function getByScreening(screeningId) {
    const [rows] = await db.query(
        `SELECT re_id, re_seats, re_created_at, us_username
         FROM reservations
         JOIN users ON re_user = us_id
         WHERE re_screening = ?`,
        [screeningId]
    );
    return rows;
}

// Une réservation par son id
async function getById(id) {
    const [rows] = await db.query("SELECT * FROM reservations WHERE re_id = ?", [id]);
    return rows[0];
}

// Capacité de la salle d'une séance (undefined si la séance n'existe pas)
async function getScreeningCapacity(screeningId) {
    const [rows] = await db.query(
        `SELECT sc_id, ro_capacity
         FROM screenings
         JOIN rooms ON sc_room = ro_id
         WHERE sc_id = ?`,
        [screeningId]
    );
    return rows[0];
}

// Nombre de places déjà réservées pour une séance
async function getReservedSeats(screeningId) {
    const [rows] = await db.query(
        "SELECT COALESCE(SUM(re_seats), 0) AS total FROM reservations WHERE re_screening = ?",
        [screeningId]
    );
    return Number(rows[0].total);
}

// Ajouter une réservation
async function insert(userId, screeningId, seats) {
    const [result] = await db.query(
        "INSERT INTO reservations (re_user, re_screening, re_seats) VALUES (?, ?, ?)",
        [userId, screeningId, seats]
    );
    return result;
}

// Supprimer une réservation
async function remove(id) {
    const [result] = await db.query("DELETE FROM reservations WHERE re_id = ?", [id]);
    return result;
}

export default {
    getAll,
    getByUser,
    getByScreening,
    getById,
    getScreeningCapacity,
    getReservedSeats,
    insert,
    remove
};
