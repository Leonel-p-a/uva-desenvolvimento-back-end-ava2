import { Router } from "express";
import appointmentController from "../controllers/AppointmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/appointments", authMiddleware, appointmentController.create);
router.get("/appointments", appointmentController.findAll);
router.delete("/appointments/:id/cancel", appointmentController.cancel);
router.patch("/appointments/:id/complete", appointmentController.complete);

export default router;