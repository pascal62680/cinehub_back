import usersModel from "../Models/users.model.js";

// Tous les utilisateurs (admin)
async function getAll(req, res) {
    try {
        const users = await usersModel.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
}

// Mon profil : l'utilisateur vient du token
async function getMe(req, res) {
    try {
        const user = await usersModel.getById(req.user.us_id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du profil" });
    }
}

// Un utilisateur par son id (sans mot de passe)
async function getById(req, res) {
    try {
        const user = await usersModel.getById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
}

// Modifier username / email : soi-même ou admin
async function update(req, res) {
    try {
        const id = Number(req.params.id);

        const isSelf = id === req.user.us_id;
        const isAdmin = req.user.us_role === "admin";

        if (!isSelf && !isAdmin) {
            return res.status(403).json({ error: "Vous ne pouvez modifier que votre propre compte" });
        }

        const user = await usersModel.getById(id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        const body = req.body || {};

        const newUser = {
            username: body.username ?? user.us_username,
            email: body.email ?? user.us_email
        };

        await usersModel.update(id, newUser);
        const updated = await usersModel.getById(id);

        res.json({ message: "Utilisateur modifié", user: updated });
    } catch (error) {
        // username ou email déjà pris (colonnes UNIQUE)
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(403).json({ error: "Nom d'utilisateur ou email déjà utilisé" });
        }
        res.status(500).json({ error: "Erreur lors de la modification de l'utilisateur" });
    }
}

// Supprimer un utilisateur (admin)
async function remove(req, res) {
    try {
        const user = await usersModel.getById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        await usersModel.remove(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
}

export default {
    getAll,
    getMe,
    getById,
    update,
    remove
};
