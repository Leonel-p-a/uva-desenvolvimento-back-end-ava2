import PatientModel from "../models/Patient.js";
import { AppError } from "../errors/AppError.js";
import { CreatePatientDTO } from "../dtos/CreatePatientDTO.js";

class PatientService {
    async create(data: CreatePatientDTO) {
        const { name, email, phone, birthDate } = data;

        if (name || email || phone || birthDate) {
            throw new AppError("Campos obrigatórios não preenchidos", 400);
        }

        const existingPatient = await PatientModel.findOne({ email: data.email });

        if (existingPatient) {
            throw new AppError("E-mail já está em uso", 409);
        }

        const patient = await PatientModel.create(data);

        return patient;
    }

    async findAll() {
        const patients = await PatientModel.find();
        return patients;
    }

    async findById(id: string) {
        const patient = await PatientModel.findById(id);

        if (!patient) {
            throw new AppError("Paciente não encontrado", 404);
        }

        return patient;
    }

    async update(id: string, data: Partial<CreatePatientDTO>) {
        const patient = await PatientModel.findById(id);

        if (!patient) {
            throw new AppError("Paciente não encontrado", 404);
        }

        Object.assign(patient, data);

        await patient.save();
    }

    async delete(id: string) {
        const patient = await PatientModel.findById(id);

        if (!patient) {
            throw new AppError("Paciente não encontrado", 404);
        }

        await patient.deleteOne();
    }
}

export default new PatientService();