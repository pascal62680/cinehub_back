import db from "../Config/db.js";

async function getAll() {
    const [rows] = await db.query("SELECT * FROM films");
    return rows;
}
async function getShowing() {
    const [rows] = await db.query("SELECT * FROM films WHERE fi_is_showing = 1");
    return rows;
}
// recupère un film par son id
async function getById(id) {
    const [rows] = await db.query("SELECT * FROM films WHERE fi_id = ?", [id]);
    return rows[0];
}
// récupère les séances à venir d'un film
async function getUpcomingScreenings(filmId) {
    const [rows] = await db.query(
        `SELECT sc_id, sc_datetime, sc_price, ro_name
         FROM screenings
         JOIN rooms ON sc_room = ro_id
         WHERE sc_film = ? AND sc_datetime >= NOW()
         ORDER BY sc_datetime`,
        [filmId]
    );
    return rows;
}


async function insert(film) {
    const [result] = await db.query(
        "INSERT INTO films (fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing) VALUES (?, ?, ?, ?, ?, ?)",
        [film.title, film.description ?? null, film.duration, film.genre ?? null, film.release_date ?? null, film.is_showing ?? 1]
    );
    return result;
}

// Remplace les 6 colonnes d'un film
async function update(id, film) {
    const [result] = await db.query(
        `UPDATE films
         SET fi_title = ?, fi_description = ?, fi_duration = ?,
             fi_genre = ?, fi_release_date = ?, fi_is_showing = ?
         WHERE fi_id = ?`,
        [film.title, film.description, film.duration, film.genre, film.release_date, film.is_showing, id]
    );
    return result;
}
// Supprime un film
async function remove(id) {
    const [result] = await db.query("DELETE FROM films WHERE fi_id = ?", [id]);
    return result;
}








export default {
    getAll,
    getShowing,
    getById,
    getUpcomingScreenings,
    insert,
    update,
    remove
};

