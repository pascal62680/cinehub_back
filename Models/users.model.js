import db from "../Config/db.js";

async function insert(user) {
    const [result] = await db.query(
        "INSERT INTO users (us_username, us_email, us_password) VALUES (?, ?, ?)",
        [user.username, user.email, user.password]
    );
    return result;
}

async function getByUsername(username) {
    const [rows] = await db.query(
        "SELECT us_id, us_username, us_email, us_password, us_role FROM users WHERE us_username = ?",
        [username]
    );
    return rows[0];
}

export default {
    insert,
    getByUsername
};
