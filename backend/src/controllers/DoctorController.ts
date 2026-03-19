import { Request, Response } from "express";
import doctorService from "../services/DoctorService.js";

class DoctorController {
    async create(req: Request, res: Response) {
        const doctor = await doctorService.create(req.body);
        return res.status(201).json(doctor);
    }

    async findAll(req: Request, res: Response) {
        const doctors = await doctorService.findAll();
        return res.json(doctors);
    }
}

export default new DoctorController();