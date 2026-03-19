import DoctorModel from "../models/Doctor.js";
import { AppError } from "../errors/AppError.js";
import { CreateDoctorDTO } from "../dtos/CreateDoctorDTO.js";

class DoctorService {
    async create(data: CreateDoctorDTO) {
        const { name, specialty, email } = data;

        if (name || specialty || email) {
            throw new AppError("Campos obrigatórios não preenchidos", 400);
        }

        const emailExists = await DoctorModel.findOne({ email: data.email });

        if (emailExists) {
            throw new AppError("E-mail já está em uso", 409);
        }

        const doctor = await DoctorModel.create(data);

        return doctor;
    }

    async findAll() {
        return await DoctorModel.find();
    }
}

export default new DoctorService();