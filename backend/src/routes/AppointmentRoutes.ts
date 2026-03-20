import { Router } from "express";
import appointmentController from "../controllers/AppointmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/appointments", authMiddleware, appointmentController.create);
router.get("/appointments", authMiddleware, appointmentController.findAll);
router.get("/appointments/all", appointmentController.findAllPatientsAppointments);
router.patch("/appointments/:id/complete", authMiddleware, appointmentController.complete);
router.delete("/appointments/:id/cancel", authMiddleware, appointmentController.cancel);

export default router;