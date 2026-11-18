import reservationsModel from "../Models/reservations.model.js";

// Toutes les réservations (admin)
async function getAll(req, res) {
    try {
        const reservations = await reservationsModel.getAll();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des réservations" });
    }
}

// Mes réservations : l'utilisateur vient du token
async function getMine(req, res) {
    try {
        const reservations = await reservationsModel.getByUser(req.user.us_id);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de vos réservations" });
    }
}

// Les réservations d'une séance (admin)
async function getByScreening(req, res) {
    try {
        const screening = await reservationsModel.getScreeningCapacity(req.params.screeningID);

        if (!screening) {
            return res.status(404).json({ error: "Séance introuvable" });
        }

        const reservations = await reservationsModel.getByScreening(req.params.screeningID);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des réservations de la séance" });
    }
}

// Réserver une séance (avec contrôle des places)
async function create(req, res) {
    try {
        const body = req.body || {};
        const screeningId = body.screening;
        const seats = body.seats ?? 1;

        // 1. La séance est obligatoire
        if (!screeningId) {
            return res.status(403).json({ error: "Champ obligatoire : screening" });
        }

        // 2. seats doit être un entier supérieur ou égal à 1
        if (!Number.isInteger(seats) || seats < 1) {
            return res.status(403).json({ error: "seats doit être un entier supérieur ou égal à 1" });
        }

        // 3. La séance doit exister
        const screening = await reservationsModel.getScreeningCapacity(screeningId);
        if (!screening) {
            return res.status(404).json({ error: "Séance introuvable" });
        }

        // 4. Contrôle des places
        const reserved = await reservationsModel.getReservedSeats(screeningId);
        if (reserved + seats > screening.ro_capacity) {
            return res.status(403).json({ error: "Plus assez de places disponibles" });
        }

        // 5. L'utilisateur vient du token, jamais du body
        const result = await reservationsModel.insert(req.user.us_id, screeningId, seats);
        res.status(201).json({ message: "Réservation créée", id: result.insertId });
    } catch (error) {
        // UNIQUE (re_user, re_screening) : déjà réservé
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(403).json({ error: "Vous avez déjà réservé cette séance" });
        }
        res.status(500).json({ error: "Erreur lors de la réservation" });
    }
}

// Annuler une réservation (la sienne, ou n'importe laquelle si admin)
async function remove(req, res) {
    try {
        const reservation = await reservationsModel.getById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ error: "Réservation introuvable" });
        }

        const isOwner = reservation.re_user === req.user.us_id;
        const isAdmin = req.user.us_role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Vous ne pouvez annuler que vos propres réservations" });
        }

        await reservationsModel.remove(req.params.id);
        res.json({ message: "Réservation annulée" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'annulation de la réservation" });
    }
}

export default {
    getAll,
    getMine,
    getByScreening,
    create,
    remove
};
