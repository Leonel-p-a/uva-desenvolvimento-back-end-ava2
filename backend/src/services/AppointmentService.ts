import AppointmentModel from "../models/Appointment.js";
import PatientModel from "../models/Patient.js";
import DoctorModel from "../models/Doctor.js";
import { AppError } from "../errors/AppError.js";
import { CreateAppointmentDTO } from "../dtos/CreateAppointmentDTO.js";

class AppointmentService {
    async create(data: CreateAppointmentDTO) {
        const { doctorId, date, userId } = data;

        if (!doctorId || !date || !userId) {
            throw new AppError("Campos obrigatórios não preenchidos", 400);
        }

        const patient = await PatientModel.findOne({ user: userId });

        if (!patient) {
            throw new AppError("Paciente não encontrado para este usuário", 404);
        }

        const patientId = patient._id;

        const APPOINTMENT_DURATION = 60;
        const start = new Date(date);

        if (isNaN(start.getTime())) {
            throw new AppError("Data inválida", 400);
        }

        start.setSeconds(0, 0);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + APPOINTMENT_DURATION);

        if (start < new Date()) {
            throw new AppError("Não pode cadastrar consulta no passado", 400);
        }

        if (start.getHours() < 8 || end.getHours() >= 18) {
            throw new AppError("Consultas devem ser marcadas entre 08:00 e 18:00", 400);
        }

        const doctorExists = await DoctorModel.findById(doctorId);
        if (!doctorExists) {
            throw new AppError("Doutor(a) não encontrado", 404);
        }

        const doctorConflict = await AppointmentModel.findOne({
            doctor: doctorId,
            date: {
                $lt: end,
            },
            $expr: {
                $gt: [
                    { $add: ["$date", APPOINTMENT_DURATION * 60000] },
                    start,
                ],
            },
        });

        if (doctorConflict) {
            throw new AppError("Doutor(a) já tem uma consulta agendada nesse horário", 409);
        }

        const patientConflict = await AppointmentModel.findOne({
            patient: patientId,
            date: {
                $lt: end,
            },
            $expr: {
                $gt: [
                    { $add: ["$date", APPOINTMENT_DURATION * 60000] },
                    start,
                ],
            },
        });

        if (patientConflict) {
            throw new AppError("Paciente já tem uma consulta marcada nesse horário", 409);
        }

        const appointment = await AppointmentModel.create({
            patient: patientId,
            doctor: doctorId,
            date: start,
        });

        return appointment;
    }

    async findAll(userId: string, status?: string) {
        const filter: any = {
            patient: userId
        };

        const validStatus = ["scheduled", "cancelled", "completed"];

        if (status && validStatus.includes(status)) {
            filter.status = status;
        }

        return await AppointmentModel.find(filter)
            .populate("patient")
            .populate("doctor");
    }

    async cancel(id: string) {
        const appointment = await AppointmentModel.findById(id);

        if (!appointment) {
            throw new AppError("Consulta não encontrada", 404);
        }

        if (appointment.status === "cancelled") {
            throw new AppError("Consulta já está cancelada", 400);
        }

        if (appointment.status === "completed") {
            throw new AppError("Consulta já foi realizada", 400);
        }

        const now = new Date();

        if (appointment.date < now) {
            throw new AppError("Não é possível cancelar uma consulta passada", 400);
        }

        appointment.status = "cancelled";
        await appointment.save();
    }

    async complete(id: string) {
        const appointment = await AppointmentModel.findById(id);

        if (!appointment) {
            throw new AppError("Consulta não encontrada", 404);
        }

        if (appointment.status === "cancelled") {
            throw new AppError("Consulta foi cancelada", 400);
        }

        if (appointment.status === "completed") {
            throw new AppError("Consulta já foi concluída", 400);
        }

        const now = new Date();

        if (appointment.date > now) {
            throw new AppError("Consulta ainda não aconteceu", 400);
        }

        appointment.status = "completed";

        await appointment.save();

        return appointment;
    }
}

export default new AppointmentService();