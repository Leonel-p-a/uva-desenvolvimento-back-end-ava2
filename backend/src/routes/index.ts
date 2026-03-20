import { Router } from "express";
import patientRoutes from "./PatientRoutes.js";
import appointmentRoutes from "./AppointmentRoutes.js";
import doctorRoutes from "./DoctorRoutes.js";
import authRoutes from "./AuthRoutes.js";
import viaCepRoutes from "./ViaCepRoutes.js";
import weatherRoutes from "./WeatherRoutes.js";
import userRoutes from "./UserRoutes.js"

const router = Router();

router.use(patientRoutes);
router.use(doctorRoutes);
router.use(appointmentRoutes);
router.use(authRoutes);
router.use(viaCepRoutes);
router.use(weatherRoutes);
router.use(userRoutes);

export default router;