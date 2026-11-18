import express from "express";
import reservationsController from "../Controllers/reservations.controller.js";
import checkAdmin from "../Middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", checkAdmin, reservationsController.getAll);
router.get("/me", reservationsController.getMine);
router.get("/screening/:screeningID", checkAdmin, reservationsController.getByScreening);
router.post("/", reservationsController.create);
router.delete("/:id", reservationsController.remove);

export default router;

