import db from "../Config/db.js";

// Toutes les salles
async function getAll() {
    const [rows] = await db.query("SELECT * FROM rooms");
    return rows;
}

// Une salle par son id
async function getById(id) {
    const [rows] = await db.query("SELECT * FROM rooms WHERE ro_id = ?", [id]);
    return rows[0];
}

// Ajouter une salle
async function insert(room) {
    const [result] = await db.query(
        "INSERT INTO rooms (ro_name, ro_capacity) VALUES (?, ?)",
        [room.name, room.capacity]
    );
    return result;
}

// Modifier une salle (les 2 colonnes)
async function update(id, room) {
    const [result] = await db.query(
        "UPDATE rooms SET ro_name = ?, ro_capacity = ? WHERE ro_id = ?",
        [room.name, room.capacity, id]
    );
    return result;
}

// Supprimer une salle
async function remove(id) {
    const [result] = await db.query("DELETE FROM rooms WHERE ro_id = ?", [id]);
    return result;
}

export default {
    getAll,
    getById,
    insert,
    update,
    remove
};
