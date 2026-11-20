import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import usersModel from "../Models/users.model.js";

async function register(req, res) {
    try {
        const { username, email, password } = req.body || {};


        if (!username || !email || !password) {
            return res.status(403).json({ error: "Champs obligatoires : username, email, password" });
        }
                // Bonus : l'email doit avoir un format valide
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(403).json({ error: "Email invalide" });
        }


        const hash = bcrypt.hashSync(password, 10);
        const result = await usersModel.insert({ username, email, password: hash });

        res.status(201).json({ message: "Inscription réussie", id: result.insertId });
    } catch (error) {
                // Nom d'utilisateur ou e-mail déjà pris (contrainte UNIQUE)
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(403).json({ error: "Nom d'utilisateur ou e-mail déjà utilisé" });
        }

        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body || {};


        if (!username || !password) {
            return res.status(403).json({ error: "Champs obligatoires : username, password" });
        }

        const user = await usersModel.getByUsername(username);

        if (!user || !bcrypt.compareSync(password, user.us_password)) {
            return res.status(403).json({ error: "Identifiants incorrects" });
        }

        const token = jwt.sign(
            {
                us_id: user.us_id,
                us_username: user.us_username,
                us_email: user.us_email,
                us_role: user.us_role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
}

export default {
    register,
    login
};
