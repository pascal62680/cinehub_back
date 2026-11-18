import screeningsModel from "../Models/screenings.model.js";
import filmsModel from "../Models/films.model.js";
import roomsModel from "../Models/rooms.model.js";

// Lister les séances (avec titre du film + nom de la salle)
async function getAll(req, res) {
    try {
        const screenings = await screeningsModel.getAll();
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des séances" });
    }
}

// Les séances d'un film
async function getByFilm(req, res) {
    try {
        const film = await filmsModel.getById(req.params.filmID);

        if (!film) {
            return res.status(404).json({ error: "Film introuvable" });
        }

        const screenings = await screeningsModel.getByFilm(req.params.filmID);
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des séances du film" });
    }
}

// Détail d'une séance
async function getById(req, res) {
    try {
        const screening = await screeningsModel.getById(req.params.id);

        if (!screening) {
            return res.status(404).json({ error: "Séance introuvable" });
        }

        res.json(screening);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de la séance" });
    }
}

// Créer une séance (film, room, datetime, price obligatoires)
async function create(req, res) {
    try {
        const screening = req.body || {};

        if (!screening.film || !screening.room || !screening.datetime || !screening.price) {
            return res.status(403).json({ error: "Champs obligatoires : film, room, datetime, price" });
        }

        // Le film et la salle doivent exister
        if (!(await filmsModel.getById(screening.film))) {
            return res.status(404).json({ error: "Film introuvable" });
        }
        if (!(await roomsModel.getById(screening.room))) {
            return res.status(404).json({ error: "Salle introuvable" });
        }

        const result = await screeningsModel.insert(screening);
        res.status(201).json({ message: "Séance créée", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la séance" });
    }
}

// Modifier une séance (seulement les champs envoyés)
async function update(req, res) {
    try {
        const id = req.params.id;
        const screening = await screeningsModel.getById(id);

        if (!screening) {
            return res.status(404).json({ error: "Séance introuvable" });
        }

        const body = req.body || {};

        const newScreening = {
            film: body.film ?? screening.sc_film,
            room: body.room ?? screening.sc_room,
            datetime: body.datetime ?? screening.sc_datetime,
            price: body.price ?? screening.sc_price
        };

        // Si on change de film ou de salle, ils doivent exister
        if (!(await filmsModel.getById(newScreening.film))) {
            return res.status(404).json({ error: "Film introuvable" });
        }
        if (!(await roomsModel.getById(newScreening.room))) {
            return res.status(404).json({ error: "Salle introuvable" });
        }

        await screeningsModel.update(id, newScreening);
        const updated = await screeningsModel.getById(id);

        res.json({ message: "Séance modifiée", screening: updated });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification de la séance" });
    }
}

// Supprimer une séance
async function remove(req, res) {
    try {
        const id = req.params.id;
        const screening = await screeningsModel.getById(id);

        if (!screening) {
            return res.status(404).json({ error: "Séance introuvable" });
        }

        await screeningsModel.remove(id);
        res.json({ message: "Séance supprimée" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la séance" });
    }
}

export default {
    getAll,
    getByFilm,
    getById,
    create,
    update,
    remove
};
