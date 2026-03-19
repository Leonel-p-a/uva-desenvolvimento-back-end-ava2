import { Request, Response } from "express";
import patientService from "../services/PatientService.js";

class PatientController {
    async create(req: Request, res: Response) {
        const patient = await patientService.create(req.body);
        return res.status(201).json(patient);
    }

    async findAll(req: Request, res: Response) {
        const patients = await patientService.findAll();
        return res.json(patients);
    }

    async findById(req: Request, res: Response) {
        const id = req.params.id as string;
        const patient = await patientService.findById(id);
        return res.json(patient);
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string;
        const patient = await patientService.update(id, req.body);
        return res.json(patient);
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        await patientService.delete(id);
        return res.status(204).send();
    }
}

export default new PatientController();