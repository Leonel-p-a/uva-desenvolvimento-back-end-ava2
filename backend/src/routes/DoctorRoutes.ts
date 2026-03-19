import { Router } from "express";
import doctorController from "../controllers/DoctorController.js"

const router = Router();

router.post("/doctors", doctorController.create);
router.get("/doctors", doctorController.findAll);

export default router;