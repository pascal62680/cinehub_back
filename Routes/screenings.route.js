import express from "express";
import screeningsController from "../Controllers/screenings.controller.js";
import checkAdmin from "../Middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", screeningsController.getAll);
router.get("/film/:filmID", screeningsController.getByFilm);
router.get("/:id", screeningsController.getById);
router.post("/", checkAdmin, screeningsController.create);
router.patch("/:id", checkAdmin, screeningsController.update);
router.delete("/:id", checkAdmin, screeningsController.remove);

export default router;
