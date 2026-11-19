import express from "express";
import "dotenv/config";
import authRoutes from "./Routes/auth.route.js";
import checkToken from "./Middlewares/auth.middleware.js";
import filmsRoutes from "./Routes/films.route.js";
import roomsRoutes from "./Routes/rooms.route.js";
import screeningsRoutes from "./Routes/screenings.route.js";
import reservationsRoutes from "./Routes/reservations.route.js";
import usersRoutes from "./Routes/users.route.js";



const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/rooms", checkToken, roomsRoutes);
app.use("/films", checkToken, filmsRoutes);
app.use("/reservations", checkToken, reservationsRoutes);
app.use("/screenings", checkToken, screeningsRoutes);
app.use("/users", checkToken, usersRoutes);
app.get("/", (req, res) => {
    res.json({ status: "OK" });
});

// Aucune route ne correspond → 404 en JSON
app.use((req, res) => {
    res.status(404).json({ error: "Route introuvable" });
});

// Gestion des erreurs (ex : JSON mal formé) → réponse en JSON
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "JSON invalide" });
    }
    res.status(500).json({ error: "Erreur serveur" });
});


const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://127.0.0.1:${PORT}`);
});
