import express from "express";
import roomsController from "../Controllers/rooms.controller.js";
import checkAdmin from "../Middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", roomsController.getAll);
router.get("/:id", roomsController.getById);
router.post("/", checkAdmin, roomsController.create);
router.patch("/:id", checkAdmin, roomsController.update);
router.delete("/:id", checkAdmin, roomsController.remove);

export default router;

