import { Router } from "express";
import weatherController from "../controllers/WeatherController.js";

const router = Router();

router.get("/weather/:city", weatherController.getWeather);

export default router;