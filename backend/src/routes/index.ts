import { Router } from "express";
import patientRoutes from "./PatientRoutes.js";
import appointmentRoutes from "./AppointmentRoutes.js";
import doctorRoutes from "./DoctorRoutes.js";
import authRoutes from "./AuthRoutes.js";
import viaCepRoutes from "./ViaCepRoutes.js";

const router = Router();

router.use(patientRoutes);
router.use(doctorRoutes);
router.use(appointmentRoutes);
router.use(authRoutes);
router.use(viaCepRoutes);

export default router;