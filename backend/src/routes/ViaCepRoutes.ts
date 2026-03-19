import { Router } from "express";
import viaCepController from "../controllers/ViaCepController.js";

const router = Router();

router.get("/cep/:cep", viaCepController.getAddress);

export default router;