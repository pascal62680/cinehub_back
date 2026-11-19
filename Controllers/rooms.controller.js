import roomsModel from "../Models/rooms.model.js";

// Lister les salles
async function getAll(req, res) {
    try {
        const rooms = await roomsModel.getAll();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des salles" });
    }
}

// Détail d'une salle
async function getById(req, res) {
    try {
        const room = await roomsModel.getById(req.params.id);

        if (!room) {
            return res.status(404).json({ error: "Salle introuvable" });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de la salle" });
    }
}

// Créer une salle (name et capacity obligatoires)
async function create(req, res) {
    try {
        const room = req.body || {};

        if (!room.name || !room.capacity) {
            return res.status(403).json({ error: "Champs obligatoires : name, capacity" });
        }

        // Bonus : capacité = nombre entier positif
        if (!Number.isInteger(Number(room.capacity)) || Number(room.capacity) <= 0) {
            return res.status(403).json({ error: "La capacité doit être un nombre entier positif" });
        }



        const result = await roomsModel.insert(room);
        res.status(201).json({ message: "Salle créée", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la salle" });
    }
}

// Modifier une salle (seulement les champs envoyés)
async function update(req, res) {
    try {
        const id = req.params.id;
        const room = await roomsModel.getById(id);

        if (!room) {
            return res.status(404).json({ error: "Salle introuvable" });
        }

        const body = req.body || {};

        // Bonus : capacité = nombre entier positif
        if (body.capacity !== undefined && (!Number.isInteger(Number(body.capacity)) || Number(body.capacity) <= 0)) {
            return res.status(403).json({ error: "La capacité doit être un nombre entier positif" });
        }

        const newRoom = {
            name: body.name ?? room.ro_name,
            capacity: body.capacity ?? room.ro_capacity
        };

        await roomsModel.update(id, newRoom);
        const updated = await roomsModel.getById(id);

        res.json({ message: "Salle modifiée", room: updated });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification de la salle" });
    }
}

// Supprimer une salle
async function remove(req, res) {
    try {
        const id = req.params.id;
        const room = await roomsModel.getById(id);

        if (!room) {
            return res.status(404).json({ error: "Salle introuvable" });
        }

        await roomsModel.remove(id);
        res.json({ message: "Salle supprimée" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la salle" });
    }
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
