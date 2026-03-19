import { Router } from "express";
import patientController from "../controllers/PatientController.js";

const router = Router();

router.post("/patients", patientController.create);
router.get("/patients", patientController.findAll);
router.get("/patients/:id", patientController.findById);
router.patch("/patients/:id", patientController.update);
router.delete("/patients/:id", patientController.delete);

export default router;