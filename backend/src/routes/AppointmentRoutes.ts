import { Router } from "express";
import appointmentController from "../controllers/AppointmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/appointments", appointmentController.create);
router.get("/appointments", appointmentController.findAll);
router.patch("/appointments/:id/complete", appointmentController.complete);
router.delete("/appointments/:id/cancel", appointmentController.cancel);

export default router;