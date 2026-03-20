import { Request, Response } from "express";
import appointmentService from "../services/AppointmentService.js";
import { AppError } from "../errors/AppError.js";
import { CreateAppointmentDTO } from "../dtos/CreateAppointmentDTO.js";

class AppointmentController {
    async create(req: Request, res: Response) {
        const body = req.body as Omit<CreateAppointmentDTO, "userId">;
        if (!req.user) {
            throw new AppError("Usuário não autenticado", 401);
        }
        
        const userId = req.user.id;

        const appointment = await appointmentService.create({ ...body, userId: userId });

        return res.status(201).json(appointment);
    }

    async findAll(req: Request, res: Response) {
        if (!req.user) {
            throw new AppError("Usuário não autenticado", 401);
        }

        const userId = req.user.id;

        const { status } = req.query;

        const appointments = await appointmentService.findAll(userId, status as string);

        return res.json(appointments);
    }

    async findAllPatientsAppointments(req: Request, res: Response) {
        const appointments = await appointmentService.findAllPatientsAppointments();

        return res.json(appointments);
    }

    async cancel(req: Request, res: Response) {
        const id = req.params.id as string;

        await appointmentService.cancel(id);

        return res.status(204).send();
    }

    async complete(req: Request, res: Response) {
        const id = req.params.id as string;
    
        const appointment = await appointmentService.complete(id);
    
        return res.json(appointment);
    }
}

export default new AppointmentController();