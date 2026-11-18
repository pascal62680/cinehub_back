import db from "../Config/db.js";

// Partie commune des lectures : la séance + le titre du film + le nom de la salle
const SELECT_SCREENINGS = `
    SELECT sc_id, sc_film, fi_title, sc_room, ro_name, sc_datetime, sc_price
    FROM screenings
    JOIN films ON sc_film = fi_id
    JOIN rooms ON sc_room = ro_id`;

// Toutes les séances
async function getAll() {
    const [rows] = await db.query(`${SELECT_SCREENINGS} ORDER BY sc_datetime`);
    return rows;
}

// Les séances d'un film
async function getByFilm(filmId) {
    const [rows] = await db.query(
        `${SELECT_SCREENINGS} WHERE sc_film = ? ORDER BY sc_datetime`,
        [filmId]
    );
    return rows;
}

// Une séance par son id
async function getById(id) {
    const [rows] = await db.query(`${SELECT_SCREENINGS} WHERE sc_id = ?`, [id]);
    return rows[0];
}

// Ajouter une séance
async function insert(screening) {
    const [result] = await db.query(
        "INSERT INTO screenings (sc_film, sc_room, sc_datetime, sc_price) VALUES (?, ?, ?, ?)",
        [screening.film, screening.room, screening.datetime, screening.price]
    );
    return result;
}

// Modifier une séance (les 4 colonnes)
async function update(id, screening) {
    const [result] = await db.query(
        "UPDATE screenings SET sc_film = ?, sc_room = ?, sc_datetime = ?, sc_price = ? WHERE sc_id = ?",
        [screening.film, screening.room, screening.datetime, screening.price, id]
    );
    return result;
}

// Supprimer une séance
async function remove(id) {
    const [result] = await db.query("DELETE FROM screenings WHERE sc_id = ?", [id]);
    return result;
}

export default {
    getAll,
    getByFilm,
    getById,
    insert,
    update,
    remove
};

