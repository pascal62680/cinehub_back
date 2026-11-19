import filmsModel from "../Models/films.model.js";

async function getAll(req, res) {
    try {
        const films = await filmsModel.getAll();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des films" });
    }
}
async function getShowing(req, res) {
    try {
        const films = await filmsModel.getShowing();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des films à l'affiche" });
    }
}
// Détail d'un film et des ses séances à venir
async function getById(req, res) {
    try {
        const film = await filmsModel.getById(req.params.id);

        if (!film) {
            return res.status(404).json({ error: "Film introuvable" });
        }
// les points recupèrent toutes les colonnes du film
        const screenings = await filmsModel.getUpcomingScreenings(req.params.id);
        res.json({ ...film, screenings });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du film" });
    }
}

async function create(req, res) {
    try {
        const film = req.body || {};

        if (!film.title || !film.duration) {
            return res.status(403).json({ error: "Champs obligatoires : title, duration" });
        }

        const result = await filmsModel.insert(film);
        res.status(201).json({ message: "Film créé", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du film" });
    }
}

// Modifier un film (seulement les champs envoyés)
async function update(req, res) {
    try {
        const id = req.params.id;
        const film = await filmsModel.getById(id);

        if (!film) {
            return res.status(404).json({ error: "Film introuvable" });
        }

        const body = req.body || {};

        const newFilm = {
            title: body.title ?? film.fi_title,
            description: body.description ?? film.fi_description,
            duration: body.duration ?? film.fi_duration,
            genre: body.genre ?? film.fi_genre,
            release_date: body.release_date ?? film.fi_release_date,
            is_showing: body.is_showing ?? film.fi_is_showing
        };

        await filmsModel.update(id, newFilm);
        const updated = await filmsModel.getById(id);

        res.json({ message: "Film modifié", film: updated });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification du film" });
    }
}
// Supprimer un film
async function remove(req, res) {
    try {
        const id = req.params.id;
        const film = await filmsModel.getById(id);

        if (!film) {
            return res.status(404).json({ error: "Film introuvable" });
        }

        await filmsModel.hide(id);
        res.json({ message: "Film retiré de l'affiche" });

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression du film" });
    }
}



export default {
    getAll,
    getShowing,
    getById,
    update,
    create,
    remove
};
