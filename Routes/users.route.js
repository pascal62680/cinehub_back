import express from "express";
import usersController from "../Controllers/users.controller.js";
import checkAdmin from "../Middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", checkAdmin, usersController.getAll);
router.get("/me", usersController.getMe);
router.get("/:id", usersController.getById);
router.patch("/:id", usersController.update);
router.delete("/:id", checkAdmin, usersController.remove);

export default router;
