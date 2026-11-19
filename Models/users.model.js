import db from "../Config/db.js";

// Colonnes publiques d'un utilisateur : JAMAIS us_password
const PUBLIC_COLUMNS = "us_id, us_username, us_email, us_role";

// --- Utilisées par l'authentification (déjà existantes) ---

// Inscription
async function insert(user) {
    const [result] = await db.query(
        "INSERT INTO users (us_username, us_email, us_password) VALUES (?, ?, ?)",
        [user.username, user.email, user.password]
    );
    return result;
}

// Connexion : ici on a BESOIN du mot de passe haché pour le comparer
async function getByUsername(username) {
    const [rows] = await db.query(
        "SELECT us_id, us_username, us_email, us_password, us_role FROM users WHERE us_username = ?",
        [username]
    );
    return rows[0];
}

// --- Nouvelles fonctions pour /users ---

// Tous les utilisateurs (sans mot de passe)
async function getAll() {
    const [rows] = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM users`);
    return rows;
}

// Un utilisateur par son id (sans mot de passe)
async function getById(id) {
    const [rows] = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE us_id = ?`, [id]);
    return rows[0];
}

// Modifier username et email
async function update(id, user) {
    const [result] = await db.query(
        "UPDATE users SET us_username = ?, us_email = ? WHERE us_id = ?",
        [user.username, user.email, id]
    );
    return result;
}

// Supprimer un utilisateur
async function remove(id) {
    const [result] = await db.query("DELETE FROM users WHERE us_id = ?", [id]);
    return result;
}
// Changer le rôle d'un utilisateur (admin uniquement)
async function updateRole(id, role) {
    const [result] = await db.query("UPDATE users SET us_role = ? WHERE us_id = ?", [role, id]);
    return result;
}





export default {
    insert,
    getByUsername,
    getAll,
    getById,
    update,
    remove,
    updateRole
};
