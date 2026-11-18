import express from "express";
import "dotenv/config";
import authRoutes from "./Routes/auth.route.js";
import checkToken from "./Middlewares/auth.middleware.js";
import filmsRoutes from "./Routes/films.route.js";
import roomsRoutes from "./Routes/rooms.route.js";


const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/rooms", checkToken, roomsRoutes);
app.use("/films", checkToken, filmsRoutes);


app.get("/", (req, res) => {
    res.json({ status: "OK" });
});

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://127.0.0.1:${PORT}`);
});
